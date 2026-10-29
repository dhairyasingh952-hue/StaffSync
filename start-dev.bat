@echo off
title StaffSync HRM - Dev Server
echo ====================================================
echo Starting StaffSync HRM (Backend: 5000, Frontend: 3000)
echo ====================================================
set PATH=C:\Users\DELL\AppData\Local\Microsoft\WinGet\Packages\OpenJS.NodeJS.LTS_Microsoft.Winget.Source_8wekyb3d8bbwe\node-v24.20.0-win-x64;%PATH%
npm run dev
pause
