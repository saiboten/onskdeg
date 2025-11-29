@echo off
echo Starting Firebase Emulator and seeding data...
echo.

REM Start Firebase emulator in background
start /B cmd /c "firebase emulators:start --import=./emulator-data --export-on-exit"

REM Wait for emulator to start
echo Waiting for emulator to start...
timeout /t 5 /nobreak > nul

REM Run seed script
echo Running seed script...
node scripts/seed-emulator.js

echo.
echo Done! Press any key to continue...
pause > nul
