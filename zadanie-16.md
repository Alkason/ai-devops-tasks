Formatowanie daty: W PowerShellu format +%Y%m%d_%H%M%S zastępujemy przez Get-Date -Format "yyyyMMdd_HHmmss". Zwróć uwagę na wielkość liter (MM to miesiąc, mm to minuta).

Ścieżki systemowe: Zmieniłem ścieżkę na C:\var\backups\db. Do bezpiecznego łączenia ścieżek użyłem dedykowanego polecenia Join-Path.

Tworzenie katalogu: Test-Path sprawdza istnienie folderu, a New-Item -ItemType Directory działa jak mkdir -p.

Obsługa błędów: Odpowiednikiem bashowego $? w kontekście uruchamiania zewnętrznych programów (.exe) jest w PowerShellu zmienna automatyczna $LASTEXITCODE. Jeśli zwraca 0, oznacza to sukces.

Kwestia interaktywności (Flaga -p): Podobnie jak w Bashu, wywołanie mysqldump -u root -p zatrzyma skrypt i poprosi o wpisanie hasła z klawiatury. Jeśli skrypt ma działać w tle (np. przez Harmonogram zadań Windows), bezpieczniej jest przekazać hasło bezpośrednio, np. -p"TwojeHaslo" (brak spacji między -p a hasłem jest kluczowy dla mysqldump).