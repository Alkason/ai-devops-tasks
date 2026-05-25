Jasne! Przejdźmy na nazewnictwo plików, które dokładnie odpowiada Twojej konfiguracji (`sum.js` oraz `sum.test.js`).

Oto gotowy zestaw plików przygotowany pod uruchomienie w Jest:

### Plik: `sum.js`

Tutaj znajduje się Twoja funkcja. Dodajemy na końcu jej eksport, aby była widoczna dla pliku testowego.

```javascript
function sum(a, b) {
  return a + b;
}

// Eksport funkcji w standardzie CommonJS
module.exports = sum;

```

---

### Plik: `sum.test.js`

Tutaj importujemy funkcję `sum` i sprawdzamy, czy działa poprawnie dla przykładowych danych.

```javascript
// Importujemy funkcję z pliku sum.js
const sum = require('./sum');

// Blok opisujący zestaw testów dla funkcji sum
describe('Funkcja sum', () => {

  // Pierwszy, podstawowy test
  test('powinna poprawnie dodać dwie liczby dodatnie (2 + 3 = 5)', () => {
    expect(sum(2, 3)).toBe(5);
  });

  // Drugi test (opcjonalny, sprawdzenie liczb ujemnych)
  test('powinna poprawnie dodać liczby ujemne (-1 + -1 = -2)', () => {
    expect(sum(-1, -1)).toBe(-2);
  });

});

```

---

### Zaktualizowana struktura plików

Teraz Twoje drzewo katalogu wygląda następująco:

```text
moj-projekt-testowy/
├── sum.js              # Kod źródłowy
├── sum.test.js         # Test jednostkowy
├── package.json
└── node_modules/

```

W terminalu niezmiennie wpisujesz `npm test`, a Jest automatycznie wykryje plik `sum.test.js` i zweryfikuje działanie kodu.