graph LR
    A[Commit] --> B[Build]
    B --> C[Test]
    C --> D[Deploy]

    style A fill:#f9f,stroke:#333,stroke-width:2px
    style B fill:#bbf,stroke:#333,stroke-width:2px
    style C fill:#bfb,stroke:#333,stroke-width:2px
    style D fill:#fbb,stroke:#333,stroke-width:2px

    Krótkie wyjaśnienie kroków:
Commit: Deweloper wypycha (pushuje) nowe zmiany w kodzie do repozytorium (np. GitHub, GitLab).

Build: System CI pobiera kod i kompiluje go lub buduje obraz kontenera (np. Docker).

Test: Uruchamiane są automatyczne testy (jednostkowe, integracyjne), aby upewnić się, że zmiany niczego nie zepsuły.

Deploy: Po pomyślnym przejściu testów, aplikacja jest automatycznie lub półautomatycznie wdrażana na środowisko (testowe lub produkcyjne).