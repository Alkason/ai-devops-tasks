Wdrażanie kontenerów Docker na produkcji wymaga podejścia typu *Defense in Depth* (obrona w głąb). Standardowe konfiguracje Dockera są zorientowane na wygodę dewelopera, a nie na rygorystyczne bezpieczeństwo.

Oto 5 kluczowych praktyk, które pozwolą Ci skutecznie zabezpieczyć aplikacje Dockerowe w środowisku produkcyjnym:

---

## 1. Zasada minimalnych uprawnień: Nigdy nie uruchamiaj jako `root`

Domyślnie Docker uruchamia procesy w kontenerze jako użytkownik `root`. Jeśli napastnik zdoła uciec z kontenera (tzw. *container breakout*), uzyskuje pełne uprawnienia administratora na maszynie hosta.

* **Jak to wdrożyć:** Zdefiniuj dedykowanego, nieuprzywilejowanego użytkownika w swoim pliku `Dockerfile`.
* **Przykład:**
```dockerfile
FROM node:20-alpine
# Tworzenie grupy i użytkownika aplikacji
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app
COPY . .
RUN npm install

# Przełączenie kontekstu na bezpiecznego użytkownika
USER appuser
CMD ["node", "server.js"]

```



---

## 2. Używaj minimalnych obrazów bazowych (Minimal Base Images)

Im większy obraz, tym większa powierzchnia ataku (więcej zainstalowanych pakietów, narzędzi sieciowych i potencjalnych podatności CVE). Tradycyjne obrazy jak `ubuntu` czy `debian` zawierają narzędzia (np. `curl`, `apt`, `python`), które na produkcji są zbędne dla Twojej aplikacji.

* **Dobra praktyka:** Wybieraj minimalistyczne dystrybucje, takie jak **Alpine Linux**, lub całkowicie odchudzone obrazy typu **Distroless** (które zawierają tylko Twoją aplikację i jej bezpośrednie zależności uruchomieniowe, bez powłoki *shell*).
* **Rezultat:** Mniejszy rozmiar obrazu (szybsze wdrożenie) oraz drastyczne ograniczenie podatności na starcie.

---

## 3. Skanowanie obrazów w poszukiwaniu podatności (CVE Scanning)

Kod aplikacji oraz zależności systemowe w obrazie starzeją się i z czasem pojawiają się w nich luki bezpieczeństwa. Skanowanie powinno być integralną częścią potoku CI/CD.

* **Narzędzia:** Używaj otwartoźródłowych lub komercyjnych skanerów, takich jak **Trivy**, **Clair** czy **Grype**.
* **Wdrożenie w CLI:** Możesz sprawdzić obraz lokalnie lub przed wypchnięciem do rejestru za pomocą wbudowanego polecenia:
```bash
docker scout cve nazwa_twojego_obrazu:latest
# lub za pomocą Trivy:
trivy image nazwa_twojego_obrazu:latest

```


* **Zasada:** Blokuj budowanie obrazów produkcyjnych w CI/CD, jeśli skaner wykryje podatności o statusie `CRITICAL` lub `HIGH`.

---

## 4. Ograniczanie zasobów i uprawnień kontenera (Runtime Security)

Kontenery powinny mieć dostęp tylko do tego, co jest im absolutnie niezbędne do działania. Domyślnie Docker daje kontenerom zbyt dużą swobodę.

* **Read-Only Root Filesystem:** Jeśli Twoja aplikacja nie musi zapisywać plików na dysku (poza np. katalogiem `/tmp`), uruchom system plików kontenera jako tylko do odczytu. Uniemożliwi to napastnikowi pobranie i uruchomienie złośliwego skryptu.
```bash
docker run --read-only --tmpfs /tmp nazwa_obrazu

```


* **Limity zasobów (DoS Prevention):** Zablokuj możliwość przejęcia całego CPU lub RAMu hosta przez jeden kontener.
```bash
docker run --memory="512m" --cpus="1.0" nazwa_obrazu

```


* **Drop Capabilities:** Docker domyślnie przyznaje kontenerom zestaw tzw. *Linux Capabilities*. Dobrą praktyką jest odebranie wszystkich i przywrócenie tylko tych wymaganych.
```bash
docker run --cap-drop=ALL --cap-add=NET_BIND_SERVICE nazwa_obrazu

```



---

## 5. Bezpieczne zarządzanie sekretami (Secrets Management)

Nigdy, pod żadnym pozorem, nie zapisuj haseł, kluczy API ani tokenów w pliku `Dockerfile` (instrukcje `ENV`) ani nie przekazuj ich w czystym tekście podczas budowania. Każdy, kto ma dostęp do obrazu, może je łatwo wyciągnąć za pomocą `docker history`.

* **Złe podejście:** `ENV DATABASE_PASSWORD=super_secret_pass`
* **Dobre podejście:** Na produkcji wstrzykuj sekrety w czasie uruchomienia (Runtime) jako zmienne środowiskowe pobierane z bezpiecznego magazynu lub mapowane przez wolumeny z mechanizmów orkiestratora.
* **Gdzie przechowywać:** Używaj dedykowanych narzędzi, takich jak **HashiCorp Vault**, **AWS Secrets Manager**, czy natywnych mechanizmów **Docker Secrets** (w Docker Swarm) / **Kubernetes Secrets**.

---

### 🛡️ Szybka checklista przed produkcją:

* [ ] Czy w kontenerze działa użytkownik inny niż `root`?
* [ ] Czy obraz bazowy to wersja `alpine` / `distroless`?
* [ ] Czy pipeline CI/CD automatycznie skanuje obrazy pod kątem CVE?
* [ ] Czy flagi `--read-only` oraz limity pamięci są wdrożone?
* [ ] Czy upewniłeś się, że `docker history` nie pokazuje żadnych haseł?

Implementacja pierwszej praktyki – czyli **uruchamiania aplikacji jako użytkownik nieuprzywilejowany (non-root)** – wymaga odpowiedniej konfiguracji zarówno na etapie budowania obrazu (`Dockerfile`), jak i podczas jego uruchamiania (`docker-compose.yml`).

Poniżej znajdziesz kompletny przewodnik, jak to zrobić krok po kroku.

---

### 1. Konfiguracja w `Dockerfile`

W pliku `Dockerfile` musisz utworzyć systemową grupę oraz użytkownika, a następnie zmienić właściciela katalogu roboczego aplikacji, aby nowy użytkownik miał do niego prawa zapisu/odczytu. Na koniec instrukcją `USER` przełączasz domyślny kontekst wykonawczy.

Oto uniwersalny przykład (na bazie lekkiego obrazu Alpine Linux):

```dockerfile
FROM alpine:3.19

# 1. Tworzymy grupę i użytkownika o nazwie 'appuser'
# Flaga -S tworzy użytkownika systemowego bez hasła i katalogu domowego
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# 2. Ustawiamy katalog roboczy
WORKDIR /app

# 3. Kopiujemy pliki aplikacji (np. skompilowany kod lub skrypty)
COPY . .

# 4. KLUCZOWY KROK: Zmieniamy właściciela katalogu /app na nowego użytkownika
# Domyślnie skopiowane pliki należą do root-a, przez co 'appuser' mógłby nie mieć do nich dostępu
RUN chown -R appuser:appgroup /app

# 5. Przełączamy kontekst wykonawczy na bezpiecznego użytkownika
# Od tego momentu wszystkie kolejne instrukcje (oraz domyślny ENTRYPOINT/CMD)
# będą uruchamiane z uprawnieniami 'appuser', a nie 'root'
USER appuser

# Przykładowe polecenie uruchamiające aplikację
CMD ["./my-application"]

```

*Wskazówka:* Jeśli używasz oficjalnych obrazów (np. `node:alpine` lub `python:alpine`), bardzo często użytkownik nieuprzywilejowany (np. o nazwie `node`) **jest już tam utworzony**. Wtedy pomijasz instrukcję `RUN adduser...`, a musisz jedynie wykonać `RUN chown -R node:node /app` oraz dodać `USER node`.

---

### 2. Konfiguracja w `docker-compose.yml`

Docker Compose automatycznie respektuje instrukcję `USER` zapisaną w `Dockerfile`. Możesz jednak jawnie wymusić uruchomienie kontenera z konkretnym identyfikatorem użytkownika (UID) i grupy (GID) z poziomu pliku `docker-compose.yml`.

Jest to szczególnie ważne, **gdy montujesz wolumeny (volumes)** z maszyny hosta – dzięki temu unikniesz problemów z uprawnieniami do plików na dysku Twojego serwera.

```yaml
version: '3.8'

services:
  web-app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "8080:8080"
    
    # Jawnym zdefiniowaniem użytkownika nadpisujesz domyślne zachowanie.
    # Bezpieczna praktyka: uruchomienie z konkretnym UID:GID (np. 1000:1000)
    user: "1000:1000"
    
    # Jeśli montujesz wolumeny, upewnij się, że katalog na hoście 
    # ma uprawnienia zapisu/odczytu dla użytkownika o UID 1000
    volumes:
      - ./data:/app/data
      
    restart: unless-stopped

```

#### Dynamiczne przekazywanie UID/GID (Najlepsza praktyka produkcyjna)

Często na różnych serwerach produkcyjnych użytkownik ma inne ID. Zamiast wpisywać `1000:1000` na sztywno, możesz użyć zmiennych środowiskowych w `docker-compose.yml`:

```yaml
    user: "${CURRENT_UID}:${CURRENT_GID}"

```

Przed uruchomieniem kontenera (`docker compose up -d`) na serwerze wystarczy wyeksportować te wartości w terminalu lub zapisać je w pliku `.env`:

```bash
export CURRENT_UID=$(id -u)
export CURRENT_GID=$(id -g)

```

---

### ⚠️ Ważne pułapki (Na co uważać?):

1. **Zajęte porty (0-1023):** Użytkownik typu *non-root* nie może domyślnie bindować aplikacji na portach systemowych (np. port `80` lub `443`). Jeśli Twoja aplikacja wewnątrz kontenera próbuje nasłuchiwać na porcie 80, wyrzuci błąd `Permission denied`.
* *Rozwiązanie:* Skonfiguruj aplikację tak, aby wewnątrz kontenera działała na porcie wyższym (np. `8080` lub `5000`), a na zewnątrz (w `docker-compose` lub na poziomie Reverse Proxy typu Nginx/Traefik) przekieruj port `80 -> 8080`.


2. **Uprawnienia do wolumenów:** Jeśli kontener działający jako `appuser` (UID 1000) spróbuje zapisać coś w zamontowanym katalogu na hoście, a ten katalog na hoście należy do `root`a, aplikacja się scrashuje. Przed uruchomieniem kontenerów upewnij się, że folder docelowy na serwerze ma odpowiednie uprawnienia (np. wykonując `chown -R 1000:1000 ./data`).