@echo off
cd /d "%~dp0"
call npm start
if errorlevel 1 (
  echo.
  echo Hubo un error al abrir la app. Revisa el mensaje de arriba.
  pause
)
