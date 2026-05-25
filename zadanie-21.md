Konwersja danych z formatu JSON do CSV wydaje się prosta, ale diabeł tkwi w szczegółach – głównie ze względu na fundamentalne różnice w strukturze obu formatów. JSON jest **hierarchiczny i elastyczny**, podczas gdy CSV to struktura **płaska i tabelaryczna**.

Oto opis procesu takiej konwersji oraz kluczowe wyzwania architektoniczne, przed którymi stoimy.

---

## 1. Opis procesu konwersji (Krok po kroku)

1. **Parsowanie (Rozpakowanie) JSON:** Program czyta plik tekstowy JSON i przekształca go w obiektową strukturę danych w pamięci (np. tablicę obiektów/słowników).
2. **Spłaszczanie (Flattening):** To najważniejszy krok. Złożone struktury (takie jak zagnieżdżone obiekty lub tablice, np. `roles`) muszą zostać sprowadzone do formy płaskiej, jedno-wymiarowej.
3. **Definiowanie nagłówków:** Program ustala listę kolumn na podstawie kluczy głównych obiektów JSON (w tym przypadku: `id`, `name`, `email`, `roles`).
4. **Mapowanie i serializacja danych:** Dla każdego obiektu z JSON-a program wyciąga wartości, formatuje je zgodnie z zasadami CSV i zapisuje jako pojedynczą linię tekstową, oddzielając wartości separatorem (np. przecinkiem).

---

## 2. Wyzwania przy transformacji

### Wyzwanie 1: Jak reprezentować tablicę (np. `roles`) w CSV?

Tablice w JSON mogą zawierać wiele wartości dla jednego rekordu, podczas gdy komórka w CSV standardowo przyjmuje jedną wartość tekstową. Istnieją trzy główne podejścia do rozwiązania tego problemu:

* **Podejście A: Połączenie wartości separatorem wewnętrznym (Zastosowane wyżej)**
* *Jak to działa:* Elementy tablicy łączymy w jeden ciąg tekstowy przy użyciu innego znaku niż separator główny (np. średnik, pionowa kreska `|` lub spacja). Wartość `["admin", "user"]` staje się tekstem `"admin;user"`.
* *Zalety:* Zachowujemy dokładnie jeden wiersz CSV na jeden obiekt JSON. Struktura tabeli pozostaje czytelna.
* *Wady:* System importujący dane musi wiedzieć, że tę konkretną komórkę należy ponownie rozbić (parsować).


* **Podejście B: Rozbicie na osobne kolumny (One-Hot Encoding / Tablica indeksowana)**
* *Jak to działa:* Tworzymy osobne kolumny dla każdej możliwej roli (np. `role_admin`, `role_user` z wartościami `true`/`false`) LUB kolumny indeksowane (`role_1`, `role_2`).
* *Zalety:* Bardzo łatwe do filtrowania w Excelu czy bazach danych SQL.
* *Wady:* Jeśli użytkownik ma 10 ról, tworzy się 10 kolumn. Dla innych użytkowników, którzy mają jedną rolę, większość kolumn będzie pusta (marnowanie przestrzeni, tzw. *sparse matrix*).


* **Podejście C: Denormalizacja (Multiplikacja wierszy)**
* *Jak to działa:* Dla każdego elementu tablicy tworzymy nowy, oddzielny wiersz w CSV, powielając pozostałe dane.
* *Przykład:* Jan Kowalski pojawiłby się w CSV dwukrotnie – raz z rolą `admin`, drugi raz z rolą `user`.
* *Zalety:* Idealne do bezpośredniego importu do relacyjnych baz danych (tabela asocjacyjna).
* *Wady:* Sztucznie zwielokrotnia liczbę wierszy i zaburza unikalność identyfikatora `id` w pliku CSV.



### Wyzwanie 2: Konflikty znaków (Znak ucieczki / Escaping)

Co jeśli nazwisko użytkownika brzmi `"Kowalski, Jan"` (zawiera przecinek), a przecinek jest operatorem rozdzielającym kolumny w CSV?

* **Rozwiązanie:** Wartości tekstowe należy bezwzględnie brać w cudzysłów (`"Kowalski, Jan"`). Jeśli sam tekst zawiera cudzysłów (np. `Jan "Boss" Kowalski`), należy go zdublować zgodnie ze standardem RFC 4180 (`"Jan ""Boss"" Kowalski"`).

### Wyzwanie 3: Brakujące klucze i dynamiczna struktura JSON

JSON pozwala na to, by pierwszy użytkownik miał pole `email`, a drugi w ogóle go nie posiadał. CSV wymaga sztywnej struktury – każda linia musi mieć tyle samo kolumn.

* **Rozwiązanie:** Program konwertujący musi najpierw przeskanować *cały* plik JSON, aby zebrać unikalną listę wszystkich możliwych kluczy i utworzyć nagłówki. Dla obiektów, które nie mają danego klucza, wstawia się pustą wartość (np. `,,`).

### Wyzwanie 4: Silnie zagnieżdżone obiekty

Jeśli JSON zawierałby strukturę: `"address": {"city": "Warszawa", "street": "Prosta"}`, nie da się jej bezpośrednio wrzucić do jednej komórki.

* **Rozwiązanie:** Stosuje się tzw. *dot-notation* (notację z kropką). W CSV powstaną dwie kolumny: `address.city` oraz `address.street`.