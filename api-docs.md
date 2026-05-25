```python
import os

markdown_content = """# Dokumentacja API — Główne Repozytorium Użytkowników

Dokument techniczny opisujący architekturę, parametry wejściowe oraz strukturę odpowiedzi dla interfejsu programistycznego zarządzania kontami użytkowników.

---

## Endpoint: Pobieranie Listy Użytkowników

Umożliwia stronicowane pobieranie oraz filtrowanie zarejestrowanych w systemie użytkowników na podstawie przypisanych ról dostępu.

### Informacje Podstawowe

| Metoda | Ścieżka (Endpoint) | Poziom Dostępu | Format Odpowiedzi |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/users` | Administrator, Moderator | `application/json` |

---

### Parametry Zapytania (Query Parameters)

Zapytanie obsługuje parametry opcjonalne przekazywane w adresie URL (Query String). Służą one do kontrolowania podziału na strony (paginacji) oraz ograniczania liczby zwracanych rekordów.

| Parametr | Typ | Wymagany | Domyślnie | Maksymalnie | Opis |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **`page`** | `integer` | Nie | `1` | — | Numer zwracanej strony wyników (indeksowany od 1). |
| **`limit`** | `integer` | Nie | `10` | `100` | Maksymalna liczba obiektów użytkowników na jednej stronie. |
| **`role`** | `string` | Nie | — | — | Filtr roli użytkownika (np. `admin`, `moderator`, `user`). |

---

### Przykłady Żądań (Request Examples)

#### 1. Zapytanie domyślne (Pierwsza strona, 10 rekordów, bez filtrowania ról)
```http
GET /api/users HTTP/1.1
Host: api.example.com
Authorization: Bearer <token_autoryzacyjny>
Accept: application/json

```

#### 2. Zapytanie z pełną parametryzacją i filtrowaniem

Pobranie drugiej strony, ograniczające wyniki do 5 rekordów, filtrując wyłącznie konta z rolą `moderator`.

```http
GET /api/users?page=2&limit=5&role=moderator HTTP/1.1
Host: api.example.com
Authorization: Bearer <token_autoryzacyjny>
Accept: application/json

```

---

### Struktura Odpowiedzi (Response Structure)

Prawidłowe zapytanie zwraca kod statusu `200 OK` oraz obiekt JSON zawierający metadane paginacji (`meta`) oraz tablicę obiektów użytkowników (`data`).

#### Przykładowa Odpowiedź Sukcesu (`200 OK`)

```json
{
  "success": true,
  "data": [
    {
      "id": "usr_94a7b3c2",
      "username": "jan.kowalski",
      "email": "j.kowalski@example.com",
      "role": "moderator",
      "status": "active",
      "created_at": "2025-03-15T09:34:21Z",
      "updated_at": "2026-01-10T14:20:00Z"
    },
    {
      "id": "usr_12f8e9d4",
      "username": "anna.nowak",
      "email": "a.nowak@example.com",
      "role": "moderator",
      "status": "active",
      "created_at": "2025-06-20T11:15:00Z",
      "updated_at": "2026-02-18T08:45:12Z"
    }
  ],
  "meta": {
    "current_page": 2,
    "limit": 5,
    "total_items": 12,
    "total_pages": 3,
    "has_next_page": true,
    "has_prev_page": true
  }
}

```

#### Opis Pól Obiektu Odpowiedzi

##### Główny obiekt:

* **`success`** (`boolean`): Flaga informująca, czy operacja zakończyła się sukcesem.
* **`data`** (`array`): Tablica zawierająca listę obiektów użytkowników spełniających kryteria.
* **`meta`** (`object`): Obiekt zawierający informacje techniczne o bieżącym podziale stron.

##### Obiekt w tablicy `data` (Użytkownik):

* **`id`** (`string`): Unikalny identyfikator użytkownika w systemie.
* **`username`** (`string`): Nazwa użytkownika (login).
* **`email`** (`string`): Adres poczty elektronicznej.
* **`role`** (`string`): Rola przypisana użytkownikowi (np. `admin`, `moderator`, `user`).
* **`status`** (`string`): Stan konta (`active`, `suspended`, `pending`).
* **`created_at`** (`string`/ISO 8601): Data i godzina rejestracji konta w systemie UTC.

##### Obiekt `meta` (Paginacja):

* **`current_page`** (`integer`): Numer aktualnie zwróconej strony.
* **`limit`** (`integer`): Zastosowany limit rekordów na stronę.
* **`total_items`** (`integer`): Całkowita liczba wszystkich użytkowników w bazie pasujących do filtra ról.
* **`total_pages`** (`integer`): Łączna liczba stron wyliczona na podstawie limitu i liczby wszystkich elementów.
* **`has_next_page`** (`boolean`): Informacja, czy istnieje kolejna strona z danymi.
* **`has_prev_page`** (`boolean`): Informacja, czy istnieje poprzednia strona z danymi.

---

### Możliwe Kody Statusów Błędów

W przypadku niepoprawnego żądania, serwer może zwrócić jeden z poniższych kodów odpowiedzi:

| Kod Statusu | Nazwa Statusu | Przyczyna | Przykładowy Komunikat (`message`) |
| --- | --- | --- | --- |
| `400` | Bad Request | Przekazano nieprawidłowy typ danych (np. tekst zamiast liczby w `page`) lub przekroczono dopuszczalny `limit` (> 100). | `"Limit cannot exceed 100"` |
| `401` | Unauthorized | Brak poprawnego nagłówka `Authorization` lub token wygasł. | `"Invalid or expired token"` |
| `403` | Forbidden | Użytkownik uwierzytelniony nie posiada uprawnień do przeglądania listy (wymagana rola wyższa). | `"Insufficent permissions"` |
| `500` | Internal Server Error | Wystąpił nieoczekiwany błąd wewnętrzny bazy danych lub aplikacji. | `"An internal server error occurred"` |
| """ |  |  |  |

with open("endpoint_documentation.md", "w", encoding="utf-8") as f:
f.write(markdown_content)

```
Twoja dokumentacja w formacie Markdown jest gotowa. Przygotowałem kompletny plik zawierający przejrzyste tabele parametrów, architekturę struktury odpowiedzi JSON (wraz z metadanymi paginacji) oraz obsługę kodów błędów.

[file-tag: code-generated-file-0-1779714039228371594]

Poniżej znajduje się bezpośredni podgląd wygenerowanej dokumentacji:

```markdown
# Dokumentacja API — Główne Repozytorium Użytkowników

Dokument techniczny opisujący architekturę, parametry wejściowe oraz strukturę odpowiedzi dla interfejsu programistycznego zarządzania kontami użytkowników.

---

## Endpoint: Pobieranie Listy Użytkowników

Umożliwia stronicowane pobieranie oraz filtrowanie zarejestrowanych w systemie użytkowników na podstawie przypisanych ról dostępu.

### Informacje Podstawowe

| Metoda | Ścieżka (Endpoint) | Poziom Dostępu | Format Odpowiedzi |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/users` | Administrator, Moderator | `application/json` |

---

### Parametry Zapytania (Query Parameters)

Zapytanie obsługuje parametry opcjonalne przekazywane w adresie URL (Query String). Służą one do kontrolowania podziału na strony (paginacji) oraz ograniczania liczby zwracanych rekordów.

| Parametr | Typ | Wymagany | Domyślnie | Maksymalnie | Opis |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **`page`** | `integer` | Nie | `1` | — | Numer zwracanej strony wyników (indeksowany od 1). |
| **`limit`** | `integer` | Nie | `10` | `100` | Maksymalna liczba obiektów użytkowników na jednej stronie. |
| **`role`** | `string` | Nie | — | — | Filtr roli użytkownika (np. `admin`, `moderator`, `user`). |

---

### Przykłady Żądań (Request Examples)

#### 1. Zapytanie domyślne (Pierwsza strona, 10 rekordów, bez filtrowania ról)
```http
GET /api/users HTTP/1.1
Host: api.example.com
Authorization: Bearer <token_autoryzacyjny>
Accept: application/json

```

#### 2. Zapytanie z pełną parametryzacją i filtrowaniem

Pobranie drugiej strony, ograniczające wyniki do 5 rekordów, filtrując wyłącznie konta z rolą `moderator`.

```http
GET /api/users?page=2&limit=5&role=moderator HTTP/1.1
Host: api.example.com
Authorization: Bearer <token_autoryzacyjny>
Accept: application/json

```

---

### Struktura Odpowiedzi (Response Structure)

Prawidłowe zapytanie zwraca kod statusu `200 OK` oraz obiekt JSON zawierający metadane paginacji (`meta`) oraz tablicę obiektów użytkowników (`data`).

#### Przykładowa Odpowiedź Sukcesu (`200 OK`)

```json
{
  "success": true,
  "data": [
    {
      "id": "usr_94a7b3c2",
      "username": "jan.kowalski",
      "email": "j.kowalski@example.com",
      "role": "moderator",
      "status": "active",
      "created_at": "2025-03-15T09:34:21Z",
      "updated_at": "2026-01-10T14:20:00Z"
    },
    {
      "id": "usr_12f8e9d4",
      "username": "anna.nowak",
      "email": "a.nowak@example.com",
      "role": "moderator",
      "status": "active",
      "created_at": "2025-06-20T11:15:00Z",
      "updated_at": "2026-02-18T08:45:12Z"
    }
  ],
  "meta": {
    "current_page": 2,
    "limit": 5,
    "total_items": 12,
    "total_pages": 3,
    "has_next_page": true,
    "has_prev_page": true
  }
}

```

#### Opis Pól Obiektu Odpowiedzi

##### Główny obiekt:

* **`success`** (`boolean`): Flaga informująca, czy operacja zakończyła się sukcesem.
* **`data`** (`array`): Tablica zawierająca listę obiektów użytkowników spełniających kryteria.
* **`meta`** (`object`): Obiekt zawierający informacje techniczne o bieżącym podziale stron.

##### Obiekt w tablicy `data` (Użytkownik):

* **`id`** (`string`): Unikalny identyfikator użytkownika w systemie.
* **`username`** (`string`): Nazwa użytkownika (login).
* **`email`** (`string`): Adres poczty elektronicznej.
* **`role`** (`string`): Rola przypisana użytkownikowi (np. `admin`, `moderator`, `user`).
* **`status`** (`string`): Stan konta (`active`, `suspended`, `pending`).
* **`created_at`** (`string`/ISO 8601): Data i godzina rejestracji konta w systemie UTC.

##### Obiekt `meta` (Paginacja):

* **`current_page`** (`integer`): Numer aktualnie zwróconej strony.
* **`limit`** (`integer`): Zastosowany limit rekordów na stronę.
* **`total_items`** (`integer`): Całkowita liczba wszystkich użytkowników w bazie pasujących do filtra ról.
* **`total_pages`** (`integer`): Łączna liczba stron wyliczona na podstawie limitu i liczby wszystkich elementów.
* **`has_next_page`** (`boolean`): Informacja, czy istnieje kolejna strona z danymi.
* **`has_prev_page`** (`boolean`): Informacja, czy istnieje poprzednia strona z danymi.

---

### Możliwe Kody Statusów Błędów

W przypadku niepoprawnego żądania, serwer może zwrócić jeden z poniższych kodów odpowiedzi:

| Kod Statusu | Nazwa Statusu | Przyczyna | Przykładowy Komunikat (`message`) |
| --- | --- | --- | --- |
| `400` | Bad Request | Przekazano nieprawidłowy typ danych (np. tekst zamiast liczby w `page`) lub przekroczono dopuszczalny `limit` (> 100). | `"Limit cannot exceed 100"` |
| `401` | Unauthorized | Brak poprawnego nagłówka `Authorization` lub token wygasł. | `"Invalid or expired token"` |
| `403` | Forbidden | Użytkownik uwierzytelniony nie posiada uprawnień do przeglądania listy (wymagana rola wyższa). | `"Insufficent permissions"` |
| `500` | Internal Server Error | Wystąpił nieoczekiwany błąd wewnętrzny bazy danych lub aplikacji. | `"An internal server error occurred"` |

```

```