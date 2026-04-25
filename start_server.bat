@echo off
setlocal

chcp 65001 >nul
cd /d "%~dp0"

echo ========================================
echo   ZenithFit: Flask + Next.js запуск
echo ========================================

if not exist package.json (
  echo Помилка: package.json не знайдено. Запускайте файл з кореня проекту.
  goto :finish
)

where python >nul 2>nul
if errorlevel 1 (
  echo Помилка: Python не знайдено у PATH.
  goto :finish
)

echo Запуск Flask-лаунчера...
python scripts\server.py
set EXIT_CODE=%ERRORLEVEL%

if not "%EXIT_CODE%"=="0" (
  echo.
  echo Сервер завершився з помилкою. Код: %EXIT_CODE%
)

goto :pause

:finish
set EXIT_CODE=1

:pause
echo.
echo Натисніть будь-яку клавішу, щоб закрити це вікно...
pause >nul
exit /b %EXIT_CODE%
