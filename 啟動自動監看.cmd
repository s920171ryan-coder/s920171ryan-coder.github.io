@echo off
chcp 65001 >nul
cd /d "%~dp0"
node watch-gallery.js
if errorlevel 1 pause
