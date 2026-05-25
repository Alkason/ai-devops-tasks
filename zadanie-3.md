# Produkcyjny Dockerfile dla Node.js (Multi-stage Build)

Poniżej znajduje się czysty, gotowy do wdrożenia produkcyjnego plik `Dockerfile` oraz towarzyszący mu `.dockerignore`. 

Ta konfiguracja wykorzystuje **wieloetapowe budowanie (multi-stage build)**. Dzięki temu końcowy obraz produkcyjny jest niezwykle mały i bezpieczny, ponieważ nie zawiera zależności deweloperskich (takich jak kompilatory czy narzędzia testowe), które nie są potrzebne do uruchomienia aplikacji.

---

## 1. Plik `Dockerfile`

Utwórz plik o nazwie `Dockerfile` w głównym katalogu swojego projektu:

```dockerfile
# --- Etap 1: Budowanie bazy ---
FROM node:20-alpine AS builder

# Ustawienie katalogu roboczego
WORKDIR /usr/src/app

# Kopiowanie plików pakietów w pierwszej kolejności, aby wykorzystać cache Dockera
COPY package*.json ./

# Instalacja WSZYSTKICH zależności (w tym devDependencies do budowania/TypeScriptu)
RUN npm ci

# Kopiowanie reszty kodu źródłowego aplikacji
COPY . .

# Opcjonalnie: Krok budowania (odkomentuj, jeśli używasz TypeScript, Next.js, Vite itp.)
# RUN npm run build

# Usunięcie zależności deweloperskich (devDependencies), aby odchudzić obraz
RUN npm prune --production


# --- Etap 2: Środowisko uruchomieniowe (Produkcja) ---
FROM node:20-alpine AS runner

# Ustawienie środowiska na produkcję
ENV NODE_ENV=production

WORKDIR /usr/src/app

# Uruchamianie jako użytkownik bez uprawnień roota (bezpieczeństwo)
USER node

# Kopiowanie tylko niezbędnych plików produkcyjnych z etapu 'builder'
COPY --chown=node:node --from=builder /usr/src/app/package*.json ./
COPY --chown=node:node --from=builder /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=builder /usr/src/app ./

# Otwarcie portu, na którym działa aplikacja (zmień 3000 na swój port)
EXPOSE 3000

# Polecenie uruchamiające aplikację
CMD ["node", "index.js"]

## 1. Plik `Dockerfile`

Utwórz plik o nazwie `Dockerfile` (bez żadnego rozszerzenia) w głównym katalogu swojej aplikacji i wklej do niego poniższą zawartość:

```dockerfile
# 1. Użycie oficjalnego obrazu Node 18 jako bazy (wersja alpine jest lekka i bezpieczna)
FROM node:18-alpine

# 2. Ustawienie katalogu roboczego wewnątrz kontenera
WORKDIR /app

# 3. Skopiowanie plików package.json oraz package-lock.json
COPY package*.json ./

# 4. Instalacja zależności aplikacji
RUN npm install

# 5. Skopiowanie reszty plików źródłowych aplikacji
COPY . .

# 6. Wystawienie portu 3000 na świat
EXPOSE 3000

# 7. Polecenie uruchamiające aplikację wewnątrz kontenera
CMD ["npm", "start"]
## 1. Plik `Dockerfile`

Utwórz plik o nazwie `Dockerfile` (bez żadnego rozszerzenia) w głównym katalogu swojej aplikacji i wklej do niego poniższą zawartość:

    ```dockerfile
    # 1. Użycie oficjalnego obrazu Node 18 jako bazy (wersja alpine jest lekka i bezpieczna)
    FROM node:18-alpine
    
    # 2. Ustawienie katalogu roboczego wewnątrz kontenera
    WORKDIR /app
    
    # 3. Skopiowanie plików package.json oraz package-lock.json
    COPY package*.json ./
    
    # 4. Instalacja zależności aplikacji
    RUN npm install
    
    # 5. Skopiowanie reszty plików źródłowych aplikacji
    COPY . .
    
    # 6. Wystawienie portu 3000 na świat
    EXPOSE 3000
    
    # 7. Polecenie uruchamiające aplikację wewnątrz kontenera
    CMD ["npm", "start"]