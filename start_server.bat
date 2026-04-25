@echo off
setlocal

chcp 65001 >nul

echo ========================================
echo    ZenithFit: Запуск веб-сервера...
echo ========================================

if not exist package.json (
  echo Помилка: Файл package.json не знайдено. Запускайте скрипт з кореня проекту.
  exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
  echo Помилка: Команду npm не знайдено. Встановіть Node.js та npm.
  exit /b 1
)

echo Виконується команда: npm run dev
npm run dev
if errorlevel 1 (
  echo Помилка під час запуску npm run dev.
  exit /b 1
)

endlocal
