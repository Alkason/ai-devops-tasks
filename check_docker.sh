#!/bin/bash

# Nazwa sprawdzanej usługi
SERVICE="docker"

# Sprawdzenie czy usługa jest aktywna
if systemctl is-active --quiet "$SERVICE"; then
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] Usługa $SERVICE działa prawidłowo."
else
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] Usługa $SERVICE nie działa! Próba uruchomienia..."
    
    # Próba uruchomienia usługi
    systemctl start "$SERVICE"
    
    # Ponowne sprawdzenie statusu po próbie uruchomienia
    if systemctl is-active --quiet "$SERVICE"; then
        echo "[$(date +'%Y-%m-%d %H:%M:%S')] Sukces: Usługa $SERVICE została pomyślnie uruchomiona."
    else
        echo "[$(date +'%Y-%m-%d %H:%M:%S')] Błąd: Nie udało się uruchomić usługi $SERVICE." >&2
        exit 1
    fi
fi