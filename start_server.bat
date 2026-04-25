@echo off
setlocal

chcp 65001 >nul
cd /d "%~dp0"

echo ========================================
echo   ZenithFit: Node.js запуск
echo ========================================

if not exist package.json (
  echo Помилка: package.json не знайдено.
  echo Запускайте цей файл з кореня Node.js проекту.
  goto :finish
)

where node >nul 2>nul
if errorlevel 1 (
  echo Помилка: Node.js не знайдено у PATH.
  echo Встановіть Node.js: https://nodejs.org/
  goto :finish
)

where npm >nul 2>nul
if errorlevel 1 (
  echo Помилка: npm не знайдено у PATH.
  echo Перевстановіть Node.js або перевірте PATH.
  goto :finish
)

if "%HOSTNAME%"=="" set HOSTNAME=127.0.0.1
if "%PORT%"=="" set PORT=3000

if not exist node_modules (
  echo Залежності не знайдено. Виконую npm install...
  call npm install
  if errorlevel 1 (
    echo Помилка під час npm install.
    goto :finish
  )
)

echo Запуск Next.js: npm run dev (HOSTNAME=%HOSTNAME%, PORT=%PORT%)
call npm run dev
set EXIT_CODE=%ERRORLEVEL%

if not "%EXIT_CODE%"=="0" (
  echo.
  echo Сервер завершився з помилкою. Код: %EXIT_CODE%
)

goto :pause

:finish
if "%EXIT_CODE%"=="" set EXIT_CODE=1

:pause
echo.
echo Натисніть будь-яку клавішу, щоб закрити це вікно...
pause >nul
exit /b %EXIT_CODE%
