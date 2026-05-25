Ta funkcja cierpi na tzw. **drabinę `if-else**`, która jest trudna w utrzymaniu, powtarza ten sam kod (zasada DRY - *Don't Repeat Yourself*) i niepotrzebnie dubluje domyślną konfigurację dla środowiska `development` oraz bloku `else`.

Oto znacznie czystsze, bardziej czytelne i nowoczesne podejście do refaktoryzacji tego kodu w JavaScript.

---

### Rozwiązanie: Słownik (Mapowanie obiektów) + Destrukturyzacja

Najlepszym wzorcem projektowym w tym przypadku jest zastąpienie warunków obiektem-słownikiem (`CONFIG_MAP`). Dzięki temu dodanie nowego środowiska w przyszłości będzie wymagało dopisania tylko jednej linijki, bez ruszania logiki funkcji.

```javascript
const CONFIG_MAP = {
  development: {
    apiUrl: 'http://localhost:3000/api',
    debug: true,
    timeout: 5000
  },
  testing: {
    apiUrl: 'http://test-server:3000/api',
    debug: true,
    timeout: 5000
  },
  staging: {
    apiUrl: 'https://staging.example.com/api',
    debug: false,
    timeout: 10000
  },
  production: {
    apiUrl: 'https://api.example.com',
    debug: false,
    timeout: 15000
  }
};

function getEnvironmentConfig(env) {
  // Jeśli środowisko nie istnieje w mapie, domyślnie zwracamy konfigurację dla 'development'
  return CONFIG_MAP[env] || CONFIG_MAP.development;
}

```

---

### Dlaczego ta wersja jest lepsza?

* **Brak powtórzeń (DRY):** W Twojej oryginalnej wersji konfiguracja dla `development` była wpisana "z palca" dwa razy (raz w pierwszym `if`, raz w `else`). Tutaj `CONFIG_MAP.development` służy jako jedno źródło prawdy (Single Source of Truth).
* **Wydajność:** Wyszukiwanie klucza w obiekcie (`CONFIG_MAP[env]`) ma złożoność obliczeniową **$O(1)$**. Twój oryginalny kod w najgorszym wypadku musiał sprawdzić 4 warunki po kolei.
* **Czytelność (Clean Code):** Oddzieliliśmy dane (konfigurację) od logiki sterującej (funkcji). Funkcja ma teraz tylko jedną linię kodu.
* **Łatwość rozbudowy:** Jeśli dojdzie nowe środowisko (np. `preprod`), po prostu dopisujesz obiekt do `CONFIG_MAP`. Nie ryzykujesz, że popsujesz nawiasy klamrowe w rozbudowanym `if-else`.