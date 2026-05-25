Ignorowanie tych plików to absolutny fundament pracy z Gitem z trzech głównych powodów: **bezpieczeństwa**, **wydajności repozytorium** oraz **stabilności samej aplikacji**.

Oto szczegółowe wyjaśnienie, dlaczego wrzucenie poszczególnych folderów do repozytorium to zły pomysł:

### 1. Bezpieczeństwo danych (Pliki `.env`, sekrety)

Pliki `.env` zawierają klucze API, hasła do bazy danych (np. root password do MongoDB) czy tokeny sesji.

* **Co się stanie, jeśli ich nie zignorujesz?** Trafią na serwer (np. GitHub). Istnieją boty, które sekundę po upublicznieniu kodu skanują repozytoria w poszukiwaniu haseł. Jeśli znajdą tam dostęp do Twojej bazy danych lub klucze AWS, możesz obudzić się z wyczyszczoną bazą lub gigantycznym rachunkiem za usługi w chmurze.

### 2. Rozmiar i wydajność repozytorium (`node_modules/`, dane MongoDB)

Git został stworzony do śledzenia zmian w **kodzie źródłowym** (pliki tekstowe), a nie do przechowywania ciężkich plików binarnych czy całego internetu pobranego na dysk.

* **`node_modules/`:** Ten folder potrafi ważyć od kilkuset megabajtów do kilku gigabajtów i składa się z dziesiątek tysięcy malutkich plików. Wrzucenie go na Gita sprawi, że komendy takie jak `git status`, `git push` czy `git clone` będą działać potwornie wolno. Każdy programista w zespole pobiera te paczki sam poprzez `npm install`.
* **Dane MongoDB (`data/`, `db/`):** Wolumeny Dockera z bazą danych zawierają pliki binarne generowane przez silnik bazy. Baza puchnie przy każdym dodaniu rekordu. Git nie potrafi efektywnie śledzić zmian w plikach binarnych – zamiast zapisywać małą zmianę (diff), przy każdej modyfikacji bazy zapisywałby w swojej historii cały wielki plik na nowo. Błyskawicznie zapchałbyś pamięć repozytorium.

### 3. Konflikty w zespole i środowiskach (`.vscode/`, `dist/`, dane bazy)

Repozytorium powinno zawierać tylko to, co jest uniwersalne dla każdego programisty i każdego środowiska (lokalne, testowe, produkcyjne).

* **Lokalna baza danych:** Jeśli wrzucisz pliki bazy MongoDB na Gita, Twój kolega z zespołu po pobraniu kodu nadpisze swoją lokalną bazę Twoimi testowymi danymi.
* **Foldery budowania (`dist/`, `build/`):** Kod produkcyjny (skompilowany TypeScript czy zminifikowany JavaScript) jest generowany automatycznie. Jeśli dwie osoby zbudują projekt lokalnie, ich pliki w `dist/` minimalnie się różnią (np. znacznikami czasu), co generuje sztuczne, trudne do rozwiązania konflikty przy scalaniu kodu (merge conflict).
* **Pliki edytora (`.vscode/`, `.idea/`):** Każdy programista ma swoje ulubione fonty, skróty klawiszowe czy ułożenie okien w edytorze. Wrzucanie tego do projektu zmusza innych do korzystania z Twoich osobistych preferencji.

---

### Podsumowując: złota zasada Gita

> Do repozytorium wrzucamy wyłącznie **przepis** na to, jak zbudować aplikację (kod źródłowy, pliki konfiguracyjne, listę zależności `package.json`), a nigdy **składniki**, które powstają w trakcie jej działania (baza danych, pobrane paczki `node_modules`, pliki wynikowe kompilacji).