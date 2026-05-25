Jak to działa?
.filter(): Przechodzi przez całą tablicę i zostawia tylko te obiekty, których status to dokładnie 'completed'.

.sort((a, b) => a.id - b.id): Sortuje przefiltrowane zadania numerycznie po id. Jeśli wynik odejmowania a.id - b.id jest ujemny, a ląduje przed b (czyli rosnąco).

.map(): Transformuje obiekty na prosty ciąg tekstowy, wyciągając z każdego zadania jedynie wartość pola title.

Przykład użycia:
JavaScript
const przykladoweZadania = [
  { id: 3, title: 'Zrobić zakupy', status: 'completed' },
  { id: 1, title: 'Umyć naczynia', status: 'pending' },
  { id: 2, title: 'Napisać kod', status: 'completed' },
  { id: 5, title: 'Przeczytać książkę', status: 'completed' },
  { id: 4, title: 'Pójść na spacer', status: 'in-progress' }
];

const wyniki = getCompletedTaskTitles(przykladoweZadania);
console.log(wyniki); 
// Wynik w konsoli: ['Napisać kod', 'Zrobić zakupy', 'Przeczytać książkę']