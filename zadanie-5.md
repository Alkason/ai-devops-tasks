+-------------------+
|      KLIENT       |  (np. Przeglądarka www, aplikacja mobilna)
+-------------------+
          |
          |  1. Żądanie HTTP (Request)
          |  4. Odpowiedź (Response)
          v
+-------------------+
|  SERWER APLIKACJI |  (np. ASP.NET Core, Node.js, Spring Boot)
+-------------------+
          |
          |  2. Zapytanie SQL / NoSQL (Query)
          |  3. Wynik zapytania (Data)
          v
+-------------------+
|    BAZA DANYCH    |  (np. PostgreSQL, MongoDB, MySQL)
+-------------------+

+-----------------------------------+
       |              KLIENT               |
       |  - Prezentacja danych (UI)        |
       |  - Obsługa interakcji użytkownika |
       +-----------------------------------+
             |                       ^
             |                       |
  1. Żądanie | (HTTP Request /       | 6. Odpowiedź
     danych  |  np. GET, POST)       |    (HTTP Response /
             |                       |    np. JSON, HTML)
             v                       |
       +-----------------------------------+
       |         SERWER APLIKACJI          |
       |  - Logika biznesowa i routing     |
       |  - Autoryzacja i bezpieczeństwo   |
       |  - Mapowanie i walidacja danych   |
       +-----------------------------------+
             |                       ^
             |                       |
2. Zapytanie | (SQL Query /          | 5. Wynik
   o rekordy |  NoSQL Command)       |    (Result Set /
             |                       |    Raw Data)
             v                       |
       +-----------------------------------+
       |            BAZA DANYCH            |
       |  - Trwałe przechowywanie danych   |
       |  - Wykonywanie transakcji         |
       |  - Indeksowanie i optymalizacja   |
       +-----------------------------------+