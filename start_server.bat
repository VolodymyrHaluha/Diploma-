@echo off
setlocal EnableExtensions

cd /d "%~dp0"
set "EXIT_CODE=0"

echo ========================================
echo   ZenithFit: Node server
echo ========================================

if not exist package.json (
  echo Error: package.json was not found.
  goto :finish
)

where node >nul 2>nul
if errorlevel 1 (
  echo Error: Node.js was not found in PATH.
  goto :finish
)

where npm >nul 2>nul
if errorlevel 1 (
  echo Error: npm was not found in PATH.
  goto :finish
)

set "APP_HOST=%HOSTNAME%"
if "%APP_HOST%"=="" set "APP_HOST=0.0.0.0"

set "APP_PORT=%PORT%"
if "%APP_PORT%"=="" set "APP_PORT=3000"

set "APP_MODE=production"

set "PGHOST=localhost"
set "PGPORT=5432"
set "PGDATABASE=ZenithFit"
set "PGMAINTENANCE_DATABASE=postgres"
set "PGUSER=postgres"
set "PGPASSWORD=admin"

echo App mode: %APP_MODE%
echo App address: %APP_HOST%:%APP_PORT%
echo PostgreSQL: %PGUSER%@%PGHOST%:%PGPORT%/%PGDATABASE%

if not exist node_modules (
  echo Dependencies were not found. Running npm install...
  call npm install
  if errorlevel 1 goto :finish
)

echo Checking PostgreSQL connection...
node -e "const {Pool}=require('pg');const pool=new Pool({host:process.env.PGHOST,port:Number(process.env.PGPORT),database:process.env.PGMAINTENANCE_DATABASE,user:process.env.PGUSER,password:process.env.PGPASSWORD,connectionTimeoutMillis:3000});pool.query('select 1').then(()=>pool.end()).then(()=>process.exit(0)).catch(e=>{console.error('PostgreSQL check failed: '+(e.code||'')+' '+e.message);process.exit(1);});"
if errorlevel 1 goto :finish

call :free_port
if errorlevel 1 goto :finish

echo Running production build...
call npm run build
if errorlevel 1 goto :finish

if exist .next\routes-manifest.json (
  node -e "const fs=require('fs');const p='.next/routes-manifest.json';const m=JSON.parse(fs.readFileSync(p,'utf8'));if(!Array.isArray(m.dataRoutes))m.dataRoutes=[];fs.writeFileSync(p,JSON.stringify(m));"
  if errorlevel 1 goto :finish
)

echo Starting Next.js server: npm run start -- -H %APP_HOST% -p %APP_PORT%
call npm run start -- -H "%APP_HOST%" -p "%APP_PORT%"
set "EXIT_CODE=%ERRORLEVEL%"
goto :after_run

:free_port
set "BUSY_PID="
for /f "tokens=5" %%P in ('netstat -ano -p tcp ^| findstr /r /c:":%APP_PORT% .*LISTENING"') do (
  if not "%%P"=="0" set "BUSY_PID=%%P"
)

if "%BUSY_PID%"=="" exit /b 0

set "BUSY_NAME="
for /f "tokens=1 delims=," %%N in ('tasklist /fi "PID eq %BUSY_PID%" /fo csv /nh 2^>nul') do set "BUSY_NAME=%%~N"

echo Port %APP_PORT% is already used by %BUSY_NAME% PID %BUSY_PID%.
echo %BUSY_NAME% | findstr /i /c:"node.exe" >nul
if errorlevel 1 (
  echo This is not a Node.js process. Close it or set another port, for example: set PORT=3001
  exit /b 1
)

echo Stopping previous Node.js server on port %APP_PORT%...
taskkill /F /PID %BUSY_PID% >nul 2>nul
timeout /t 1 /nobreak >nul
exit /b 0

:after_run
if not "%EXIT_CODE%"=="0" (
  echo.
  echo Server stopped with error code: %EXIT_CODE%
)

goto :pause

:finish
if "%EXIT_CODE%"=="" set "EXIT_CODE=1"
if "%EXIT_CODE%"=="0" set "EXIT_CODE=1"

:pause
echo.
echo Press any key to close this window...
pause >nul
exit /b %EXIT_CODE%
