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