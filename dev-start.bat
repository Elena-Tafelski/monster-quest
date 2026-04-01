@echo off
title Monster Quest Dev Starter
echo ==========================================
echo [1/2] Starte Docker-Datenbank...
echo ==========================================
docker compose up -d db pgadmin

echo.
echo ==========================================
echo [2/2] BEREIT!
echo ==========================================
echo.
echo Starte das Backend manuell mit:
echo    cd backend ^& .\mvnw spring-boot:run
echo.
echo Starte das Frontend manuell mit:
echo    cd frontend ^& npm run dev
echo.
echo ==========================================
pause