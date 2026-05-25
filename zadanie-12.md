def find_duplicates(list_of_items):
    duplicates = []
    for i in range(len(list_of_items)):
        for j in range(i+1, len(list_of_items)):
            if list_of_items[i] == list_of_items[j] and list_of_items[i] not in duplicates:
                duplicates.append(list_of_items[i])
    return duplicates

Tak, ten kod zdecydowanie można (i warto!) zoptymalizować.

Obecna wersja korzysta z dwóch zagnieżdżonych pętli `for`. Oznacza to, że dla każdego elementu przeszukujesz resztę listy. Taki algorytm ma złożoność obliczeniową **$O(n^2)$** (kwadratową). Jeśli Twoja lista będzie miała np. 10 000 elementów, kod wykona miliony operacji i zacznie drastycznie zwalniać.

Oto jak można zrobić to znacznie szybciej i elegancko w Pythonie.

---

## Rozwiązanie optymalne: Złożoność $O(n)$

Najlepszym sposobem na przyspieszenie tego kodu jest użycie **zbioru (ang. *set*)**. Wyszukiwanie elementów w zbiorze w Pythonie odbywa się w czasie stałym $O(1)$, podczas gdy wyszukiwanie w liście (`not in duplicates`) zmusza Pythona do przeglądania całej listy za każdym razem.

Oto zoptymalizowana wersja:

```python
def find_duplicates(list_of_items):
    seen = set()
    duplicates = set()
    
    for item in list_of_items:
        if item in seen:
            duplicates.add(item)
        else:
            seen.add(item)
            
    return list(duplicates)

```

### Dlaczego to rozwiązanie jest lepsze?

* **Szybkość:** Przechodzimy przez listę tylko **jeden raz** (złożoność liniowa **$O(n)$**). Dla dużych danych ten kod zadziała błyskawicznie.
* **Brak duplikatów w wynikach:** Użycie zbioru `duplicates` automatycznie dba o to, aby ta sama powtarzająca się wartość nie została dodana do końcowego wyniku wielokrotnie. Na koniec po prostu konwertujemy zbiór z powrotem na listę za pomocą `list()`.

---

## Porównanie wydajności

Żeby zobrazować różnicę, zobacz jak zachowają się oba algorytmy przy różnych wielkościach danych:

| Liczba elementów ($n$) | Twój kod ($O(n^2)$) - liczba operacji | Zoptymalizowany kod ($O(n)$) - liczba operacji |
| --- | --- | --- |
| **10** | ~100 | ~10 |
| **1 000** | ~1 000 000 | ~1 000 |
| **100 000** | ~10 000 000 000 (Zaczyna się zawieszać) | ~100 000 (Ułamek sekundy) |

> **Ważna uwaga:** Rozwiązanie ze zbiorami (`set`) wymaga, aby elementy na liście były *hashowalne* (np. liczby, stringi, krotki). Jeśli Twoja lista zawierałaby inne listy lub słowniki, ta metoda wyrzuci błąd `TypeError`. W zdecydowanej większości przypadków pracujemy jednak na typach prostych, gdzie `set` sprawdza się idealnie.