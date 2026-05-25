Klasyczny błąd Dockera. Komunikat:
`bind: address already in use` oznacza, że Docker próbuje przypisać kontener do portu **3000** na Twoim komputerze (host), ale **ten port jest już zajęty przez inny proces**.

Może to być inna instancja tej samej aplikacji uruchomiona w tle, lokalnie odpalony serwer node.js/go, albo inny kontener, który nie został poprawnie wyłączony.

Oto jak szybko namierzyć i rozwiązać ten problem krok po kroku:

---

### Krok 1: Znajdź i zabij proces, który blokuje port 3000

Musisz sprawdzić, jaki program "siedzi" na tym porcie.

1. **Uruchom komendę, aby sprawdzić PID (identyfikator) procesu:**
```bash
sudo lsof -i :3000

```


*Alternatywnie, jeśli nie masz `lsof`: `sudo netstat -nlp | grep :3000*`
2. **Zobaczysz wynik podobny do tego:**
```text
COMMAND   PID USER   FD   TYPE DEVICE SIZE/OFF NODE NAME
node    12345 root    7u  IPv4  42199      0t0  TCP *:3000 (LISTEN)

```


Zwróć uwagę na kolumnę **PID** (w tym przykładzie: `12345`).
3. **Ubij ten proces:**
```bash
sudo kill -9 12345

```


*(Zmień `12345` na PID, który wyświetlił się u Ciebie).*

---

### Krok 2: Sprawdź "wiszące" kontenery Dockera

Często bywa tak, że to sam Docker zablokował port, ponieważ poprzedni kontener nie wyłączył się prawidłowo i system myśli, że port jest wciąż zajęty.

1. **Wyświetl wszystkie działające kontenery:**
```bash
docker ps

```


2. Jeśli widzisz tam kontener, który używa portu `3000`, zatrzymaj go:
```bash
docker stop <ID_lub_nazwa_kontenera>

```


3. Na wszelki wypadek możesz też zrestartować całą usługę Dockera, co często czyści zablokowane proxy sieciowe:
```bash
sudo systemctl restart docker

```



---

### Krok 3: Uruchom aplikację ponownie

Gdy port 3000 jest już wolny, spróbuj ponownie podnieść swój projekt:

```bash
docker compose up
# lub docker-compose up, w zależności od wersji

```

---

### Alternatywne rozwiązanie: Zmiana portu w konfiguracji

Jeśli port 3000 musi być zajęty przez coś innego (np. aplikację, nad którą pracujesz lokalnie bez Dockera), możesz zmienić mapowanie portów w swoim pliku `docker-compose.yml`.

Znajdź sekcję `ports` i zmień port po lewej stronie (port hosta):

```yaml
services:
  app:
    # ... reszta konfiguracji ...
    ports:
      - "3001:3000"  # Zamiast "3000:3000"

```

*Zapis `"3001:3000"` oznacza: Chcę wchodzić na aplikację w przeglądarce przez port `3001` na moim komputerze, a Docker przekaże ten ruch wewnętrznie do kontenera na port `3000`.*