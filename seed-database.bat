@echo off
title StaffSync HRM - Database Seeder
echo ====================================================
echo Seeding StaffSync HRM Initial Data & Accounts...
echo ====================================================
set PATH=C:\Users\DELL\AppData\Local\Microsoft\WinGet\Packages\OpenJS.NodeJS.LTS_Microsoft.Winget.Source_8wekyb3d8bbwe\node-v24.20.0-win-x64;%PATH%
npm run seed
pause
