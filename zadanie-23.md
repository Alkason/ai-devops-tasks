Twój aktualny kod wykorzystuje podejście **brute-force** (siłowe). Przeanalizujmy jego obecną wydajność, a następnie przejdziemy do znacznie szybszych rozwiązań.

---

## Analiza obecnego algorytmu

### 1. Złożoność czasowa: $O(n^2)$

Wynika to z zastosowania dwóch zagnieżdżonych pętli `for`:

* Zewnętrzna pętla wykonuje się $n$ razy (gdzie $n$ to długość tablicy).
* Wewnętrzna pętla przy każdym kroku przeszukuje pozostałą część tablicy.
* Łączna liczba porównań odpowiada sumie ciągu arytmetycznego, co daje w przybliżeniu $\frac{n \cdot (n - 1)}{2}$ operacji. W notacji dużego O odrzucamy stałe, co daje nam **kwadratową złożoność obliczeniową**. Jeśli tablica będzie miała 100 000 elementów, algorytm wykona około 5 miliardów operacji, co drastycznie spowolni działanie programu.

### 2. Złożoność pamięciowa: $O(1)$ lub $O(k)$

* Jeśli nie liczymy pamięci potrzebnej na zwracaną tablicę `pairs` (bo wynik i tak musimy gdzieś zapisać), złożoność pamięciowa wynosi **$O(1)$ (stała)**. Algorytm nie tworzy żadnych dodatkowych struktur danych zależnych od wielkości tablicy wejściowej.
* Jeśli uwzględniamy pamięć na wynik, wynosi ona $O(k)$, gdzie $k$ to liczba znalezionych par spełniających warunek.

---

## Czy można to zoptymalizować?

**Tak, i to diametralnie.** W zależności od tego, czy tablica wejściowa jest posortowana, czy nie, oraz czy zależy Ci na optymalizacji czasu kosztem pamięci, masz do dyspozycji dwa świetne podejścia.

### Podejście 1: Hash Set (Zbiór) – Najszybsze ($O(n)$ czasowo)

Jeśli tablica **nie jest posortowana**, możemy użyć struktury `Set` (wyszukiwanie w niej trwa $O(1)$). Zamiast szukać na oślep, dla każdej liczby obliczamy jej "dopełnienie" do sumy docelowej (`targetSum - currentElement`) i sprawdzamy, czy to dopełnienie już widzieliśmy.

* **Złożoność czasowa:** $O(n)$ – przechodzimy przez tablicę tylko raz.
* **Złożoność pamięciowa:** $O(n)$ – musimy zapisać elementy w pamięci `Set`.

```javascript
function findPairsOptimized(arr, targetSum) {
  const pairs = [];
  const seenNumbers = new Set();

  for (const num of arr) {
    const complement = targetSum - num;

    if (seenNumbers.has(complement)) {
      pairs.push([complement, num]);
    }
    
    seenNumbers.add(num);
  }

  return pairs;
}

```

*Uwaga: Ta wersja świetnie radzi sobie z unikalnymi parami, ale jeśli w tablicy powtarzają się te same liczby i chcesz wyciągnąć absolutnie wszystkie kombinacje indeksów (tak jak w Twoim oryginalnym kodzie), bezpieczniej użyć `Map` do zliczania wystąpień.*

### Podejście 2: Two Pointers (Dwa wskaźniki) – $O(n \log n)$ czasowo, $O(1)$ pamięciowo

Jeśli tablica **jest już posortowana** (lub możemy ją posortować), idealną metodą jest technika dwóch wskaźników – jednego na początku, drugiego na końcu tablicy.

* **Złożoność czasowa:** $O(n \log n)$ jeśli musimy najpierw posortować tablicę; samo szukanie par to $O(n)$.
* **Złożoność pamięciowa:** $O(1)$ (lub $O(n)$ w zależności od implementacji metody `sort` w silniku JS), ponieważ nie tworzymy dużych struktur danych.

```javascript
function findPairsTwoPointers(arr, targetSum) {
  const pairs = [];
  // Sortujemy tablicę rosnąco (uwaga: sort modyfikuje oryginalną tablicę)
  arr.sort((a, b) => a - b); 

  let left = 0;
  let right = arr.length - 1;

  while (left < right) {
    const currentSum = arr[left] + arr[right];

    if (currentSum === targetSum) {
      pairs.push([arr[left], arr[right]]);
      left++;
      right--;
    } else if (currentSum < targetSum) {
      left++; // Suma za mała, przesuwamy lewy wskaźnik w prawo (szukamy większej liczby)
    } else {
      right--; // Suma za duża, przesuwamy prawy wskaźnik w lewo (szukamy mniejszej liczby)
    }
  }

  return pairs;
}

```

### Podsumowanie: którą opcję wybrać?

* Wybierz **Podejście 1 (Hash Set)**, jeśli zależy Ci na maksymalnej szybkości działania dla ogromnych, nieposortowanych baz danych i możesz poświęcić na to trochę pamięci RAM.
* Wybierz **Podejście 2 (Two Pointers)**, jeśli pamięć jest mocno ograniczona lub dane wejściowe dostajesz już posortowane.