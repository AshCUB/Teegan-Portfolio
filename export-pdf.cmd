@echo off
setlocal
set "HERE=%~dp0"
set "OUT=%HERE%Teegan Reed - Portfolio.pdf"
set "CHROME=%ProgramFiles%\Google\Chrome\Application\chrome.exe"
if not exist "%CHROME%" set "CHROME=%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe"
set "URL=file:///%HERE:\=/%book.html"

"%CHROME%" --headless=new --disable-gpu --disable-extensions --log-level=3 --allow-file-access-from-files --no-pdf-header-footer --virtual-time-budget=15000 --print-to-pdf="%OUT%" "%URL%"
echo Saved: %OUT%
