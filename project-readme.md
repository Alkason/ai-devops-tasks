Jasne, oto cały wygenerowany plik `README.md` w formie jednego, czystego bloku kodu:

```text
# Simple Task API

Simple Task API to lekki i wydajne REST API służące do zarządzania zadaniami (CRUD). Projekt został stworzony przy użyciu Node.js, frameworka Express oraz bazy danych MongoDB. Pozwala na pełną kontrolę nad cyklem życia zadań, ich kategoryzację oraz podstawowe zabezpieczenie dostępu.

## Spis treści
- [Główne funkcje](#główne-funkcje)
- [Wymagania wstępne](#wymagania-wstępne)
- [Instalacja](#instalacja)
- [Konfiguracja](#konfiguracja)
- [Uruchomienie projektu](#uruchomienie-projektu)
- [Endpointy API](#endpointy-api)
  - [Autentykacja](#autentykacja)
  - [Zadania (Tasks)](#zadania-tasks)
- [Struktura modelu zadania](#struktura-modelu-zadania)

## Główne funkcje
- **Operacje CRUD:** Tworzenie, odczyt, aktualizacja oraz usuwanie zadań.
- **Filtrowanie i sortowanie:** Możliwość filtrowania zadań po statusie (np. `pending`, `completed`) oraz priorytecie (`low`, `medium`, `high`).
- **Autentykacja:** Prosty mechanizm rejestracji i logowania użytkowników zabezpieczający dostęp do endpointów za pomocą tokenów (np. JWT).

## Wymagania wstępne
Przed uruchomieniem projektu upewnij się, że masz zainstalowane:
- **Node.js** (wersja v14 lub nowsza)
- **npm** (zarządca pakietów Node)
- **MongoDB** (lokalna instancja lub konto na MongoDB Atlas)

## Instalacja

1. Sklonuj repozytorium lub pobierz pliki projektu:
```bash
   git clone [https://github.com/twoj-username/simple-task-api.git](https://github.com/twoj-username/simple-task-api.git)
   cd simple-task-api

```

2. Zainstaluj wymagane zależności:

```bash
   npm install

```

## Konfiguracja

Utwórz plik `.env` w głównym katalogu projektu i zdefiniuj w nim niezbędne zmienne środowiskowe:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/simple-task-api
JWT_SECRET=twoj_super_tajny_klucz_autoryzacji

```

## Uruchomienie projektu

### Tryb deweloperski (z automatycznym restartem za pomocą nodemon):

```bash
npm run dev

```

### Tryb produkcyjny:

```bash
npm start

```

Po uruchomieniu API będzie dostępne pod adresem: `http://localhost:3000`.

## Endpointy API

Wszystkie żądania dotyczące zadań wymagają nagłówka autoryzacyjnego: `Authorization: Bearer <TWÓJ_TOKEN_JWT>`.

### Autentykacja

| Metoda | Endpoint | Opis | Wymagane Body |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | Rejestracja nowego użytkownika | `{ "username": "string", "password": "string" }` |
| `POST` | `/api/auth/login` | Logowanie i pobranie tokenu | `{ "username": "string", "password": "string" }` |

### Zadania (Tasks)

| Metoda | Endpoint | Opis |
| --- | --- | --- |
| `GET` | `/api/tasks` | Pobiera listę wszystkich zadań użytkownika (obsługuje query params, np. `?status=pending&priority=high`) |
| `GET` | `/api/tasks/:id` | Pobiera szczegóły konkretnego zadania po jego ID |
| `POST` | `/api/tasks` | Tworzy nowe zadanie |
| `PUT` | `/api/tasks/:id` | Aktualizuje istniejące zadanie w całości lub częściowo |
| `DELETE` | `/api/tasks/:id` | Usuwa wybrane zadanie |

#### Przykład filtrowania zadań:

Aby pobrać zadania o wysokim priorytecie, które są w trakcie realizacji:

```http
GET http://localhost:3000/api/tasks?status=pending&priority=high

```

## Struktura modelu zadania

Obiekt zadania w bazie danych MongoDB zawiera następujące pola:

```json
{
  "_id": "603dcc9b87023c21a4fa4312",
  "title": "Zaimplementować walidację danych",
  "description": "Dodać bibliotekę Joi lub express-validator do sprawdzania poprawności body żądań.",
  "status": "pending", 
  "priority": "high",  
  "userId": "603dcbfb87023c21a4fa4311",
  "createdAt": "2026-05-25T13:10:00.000Z",
  "updatedAt": "2026-05-25T13:15:00.000Z"
}

```

---

Projekt przygotowany jako przejrzyste, demonstracyjne rozwiązanie architektury REST API.

```

```