Duże zużycie pamięci przez kontener Docker to klasyczny problem, który może prowadzić do powolnego działania aplikacji, a w skrajnych przypadkach do ubicia kontenera przez systemowy mechanizm **OOM Killer (Out of Memory Killer)**.

Aby skutecznie rozwiązać ten problem, najlepiej podejść do niego trzyetapowo: **zdiagnozować**, **ograniczyć** i **zoptymalizować**.

---

## Krok 1: Diagnoza (Gdzie ucieka pamięć?)

Zanim zaczniesz cokolwiek zmieniać, musisz dowiedzieć się, który kontener "zjada" najwięcej RAM-u i jak zachowuje się w czasie.

* **Szybki podgląd na żywo:** Użyj wbudowanego polecenia, które działa jak menedżer zadań w Dockerze:
```bash
docker stats

```


Zobaczysz tam procentowe i ilościowe zużycie pamięci przez wszystkie uruchomione kontenery.
* **Szczegółowa inspekcja:** Jeśli chcesz sprawdzić limity i dokładny stan konkretnego kontenera, wpisz:
```bash
docker inspect <id_lub_nazwa_kontenera>

```


* **Sprawdzenie, czy kontener został ubity przez brak pamięci:** Jeśli Twój kontener nagle się wyłącza z błędem `Exit Code 137`, zazwyczaj oznacza to, że system operacyjny (OOM Killer) zabił go z powodu braku RAM-u. Potwierdzisz to komendą:
```bash
docker inspect <id_lub_nazwa_kontenera> --format='{{.State.OOMKilled}}'

```



---

## Krok 2: Tymczasowe ograniczenie (Bariera ochronna)

Jeśli aplikacja ma wyciek pamięci (memory leak), bez ograniczeń może "wyssać" cały RAM z serwera, doprowadzając do zawieszenia systemu operacyjnego. Warto nałożyć na kontener **limity**.

Możesz to zrobić bezpośrednio przy uruchamianiu kontenera lub w pliku konfiguracyjnym.

### Opcja A: Przez Docker CLI (`docker run`)

Możesz ograniczyć pamięć podręczną (np. do 512 megabajtów) oraz zdefiniować pamięć wymiany (swap):

```bash
docker run -d --name moja_aplikacja -m 512m --memory-swap 1g nginx

```

### Opcja B: Przez Docker Compose (Zalecane)

Wersje Docker Compose 3 i nowsze pozwalają na eleganckie zdefiniowanie zasobów w sekcji `deploy`:

```yaml
version: '3.8'
services:
  web:
    image: my-app:latest
    deploy:
      resources:
        limits:
          memory: 512M
        reservations:
          memory: 256M

```

> **Wskazówka:** `limits` to maksymalna ilość RAM-u, jaką kontener może dostać. `reservations` to minimalna ilość, jaką system gwarantuje dla tego kontenera przy starcie.

---

## Krok 3: Optymalizacja (Rozwiązanie problemu u źródła)

Ograniczenie pamięci w kroku 2 sprawi, że kontener nie zawiesi całego serwera, ale jeśli aplikacja ma problem, teraz po prostu zacznie się restartować. Czas na optymalizację:

### 1. Profilowanie aplikacji wewnątrz kontenera

Problem rzadko leży w samym Dockerze – najczęściej winna jest aplikacja w środku.

* **Java:** Dostosuj parametry JVM (np. `-Xmx256m` lub `-XX:MaxRAMPercentage=75.0`). Bez tego Java może "myśleć", że ma do dyspozycji cały RAM hosta, a nie tylko zasoby kontenera.
* **Node.js:** Użyj flagi `--max-old-space-size=400`, aby ograniczyć garbage collector.
* **Python/PHP:** Sprawdź, czy aplikacja nie ładuje wielkich plików (np. raportów PDF, ogromnych baz danych) bezpośrednio do pamięci RAM zamiast przetwarzać je strumieniowo.

### 2. Zmiana obrazu bazowego na lżejszy

Jeśli Twój obraz bazuje na pełnym Ubuntu lub Debianie, kontener na starcie marnuje zasoby. Przełącz się na wersje **Alpine** lub **Slim**, które są zoptymalizowane pod kątem minimalnego zużycia zasobów.

* *Zamiast:* `FROM node:20`
* *Użyj:* `FROM node:20-alpine` lub `FROM node:20-slim`

### 3. Czyszczenie pamięci podręcznej (Cache)

Aplikacje bazodanowe (Redis, PostgreSQL, MySQL) z natury alokują dużo RAM-u na cache, aby działać szybciej. W ich plikach konfiguracyjnych (np. `my.cnf` dla MySQL) musisz ręcznie zmniejszyć bufory (np. `innodb_buffer_pool_size`), jeśli kontener działa na małym serwerze VPS.

---

Od którego kroku chcesz zacząć? Jeśli podasz mi, jaka aplikacja (język programowania/baza danych) działa w tym kontenerze, pomogę Ci dobrać konkretne flagi optymalizacyjne.


Cześć! Jako gość, który zjadł zęby na kontenerach i niejedną noc zarwał przez krzyczący alerting (OOM Killer to mój stary znajomy), chętnie pomogę Ci okiełznać ten problem.

W świecie DevOps duże zużycie pamięci (RAM) przez kontener to klasyk. Podejdźmy do tego systemowo – od szybkiej diagnozy, przez znalezienie winowajcy, aż po stałe rozwiązanie.

---

## Krok 1: Szybka diagnoza (Co się właściwie dzieje?)

Zanim zaczniesz cokolwiek zmieniać, musisz zebrać twarde dane.

* **`docker stats`** – To Twoje pierwsze narzędzie ratunku. Uruchom je w terminalu, aby zobaczyć zużycie zasobów w czasie rzeczywistym.
```bash
docker stats --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}"

```


* **Sprawdź, czy kontener nie oberwał od OOM Killera** – Jeśli kontener niespodziewanie się restartuje, istnieje duża szansa, że system operacyjny ubił go z braku pamięci. Sprawdzisz to tak:
```bash
docker inspect <id_lub_nazwa_kontenera> --format '{{json .State}}'

```


Szukaj w wynikach pól `"OOMKilled": true` oraz `"ExitCode": 137`.

---

## Krok 2: Profilowanie wnętrza kontenera (Gdzie ucieka RAM?)

Skoro wiesz, że kontener „puchnie”, musisz dowiedzieć się, co dokładnie w środku zjada pamięć. Kontener to tylko odizolowany proces na poziomie kernela, więc techniki debugowania zależą od technologii:

### A. Sprawdzenie procesów (Ogólne)

Wejdź do kontenera i zobacz, co tam żyje:

```bash
docker exec -it <id_kontenera> top
# lub jeśli masz zainstalowany htop / ps:
docker exec -it <id_kontenera> ps aux --sort=-%mem

```

### B. Specyfika technologiczna (Najczęstsi winowajcy)

* **Java (JVM):** JVM ma tendencję do zajmowania tyle pamięci, ile dostanie, jeśli nie jest dobrze skonfigurowany. Upewnij się, że używasz flag `-XX:+UseContainerSupport` (w nowoczesnych wersjach Java jest to domyślne) oraz odpowiednio ustawionych `-Xmx` (maksymalny heap) i `-Xms`.
* **Node.js:** Wycieki pamięci w pętli zdarzeń (Event Loop) to zmora. Użyj flagi `--max-old-space-size`, aby ograniczyć apetyt V8, i podepnij profiler (np. `clinic.js` lub natywny profiler w Chrome DevTools), aby wyłapać wyciek (Memory Leak).
* **Python/Go:** Użyj narzędzi do profilowania pamięci, takich jak `tracemalloc` (Python) czy `pprof` (Go), aby zobaczyć, które obiekty nie są zwalniane przez Garbage Collector.

---

## Krok 3: Wdrożenie limitów (Gasi pożar)

Jako DevOps dbam o to, żeby jeden awaryjny kontener nie położył mi całego hosta (lub całego węzła w Kubernetesie). **Zawsze ustawiaj limity zasobów.**

### W Docker CLI:

Ogranicz pamięć podręczną i przestrzeń wymiany (swap):

```bash
docker run -d --name moja-aplikacja -m 512m --memory-swap 1g moja-image:latest

```

### W Docker Compose (`docker-compose.yml`):

Dla nowszych wersji Compose (v3):

```yaml
version: '3.8'
services:
  web:
    image: moja-aplikacja:latest
    deploy:
      resources:
        limits:
          memory: 512M
        reservations:
          memory: 256M

```

> ⚠️ **Ważna uwaga:** Samo ustawienie limitu nie naprawi wycieku pamięci w aplikacji. Sprawi jedynie, że kontener zrestartuje się szybciej (jeśli masz ustawioną politykę `restart: always`), zamiast „zamrozić” cały serwer. To rozwiązanie tymczasowe!

---

## Krok 4: Optymalizacja na poziomie DevOps (Dobre praktyki)

1. **Zmień obraz bazowy:** Jeśli Twoja aplikacja działa na pełnym obrazie Ubuntu/Debian, przesiądź się na wersje **Alpine** lub **Slim** (np. `node:alpine`, `python:slim`). Mniej procesów w tle = mniejsze zużycie RAM-u na starcie.
2. **Zarządzanie logami:** Czasami aplikacja loguje zbyt agresywnie do `stdout`, co Docker musi przetworzyć. Ustaw rotację logów w `/etc/docker/daemon.json`:
```json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}

```


3. **Wieloetapowe budowanie (Multi-stage builds):** Upewnij się, że w ostatecznym obrazie nie masz kompilatorów, narzędzi testowych i śmieci z etapu budowania. Im lżejszy obraz, tym mniejszy footprint w pamięci.

---

## Krok 5: Monitoring na przyszłość (Żeby spać spokojnie)

Nie możesz zarządzać czymś, czego nie mierzysz. Na dłuższą metę polecam wdrożenie klasycznego stosu:

* **Prometheus + cAdvisor** – cAdvisor zbiera metryki prosto z demonów Dockera i przekazuje je do Prometheusa.
* **Grafana** – Tworzysz ładny dashboard i ustawiasz Alerting (np. powiadomienie na Slacku/PagerDuty, gdy zużycie pamięci kontenera przekroczy 85% przez ponad 5 minut).

Podsumowując: Najpierw **zlimituj** kontener, żeby uratować produkcję, potem **sprofiluj** aplikację z deweloperami, żeby usunąć wyciek, a na koniec **oładuj to monitoringiem**.

Gdybyś potrzebował pomocy z konkretnym stackiem technologicznym (np. konfiguracją JVM pod Dockerem albo analizą logów), daj znać – wejdziemy głębiej w szczegóły!