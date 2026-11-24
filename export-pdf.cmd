@echo off
setlocal
set "HERE=%~dp0"
set "OUT=%HERE%Teegan Reed - Portfolio.pdf"
set "TMPOUT=%TEMP%\teegan-portfolio-export.pdf"
set "CHROME=%ProgramFiles%\Google\Chrome\Application\chrome.exe"
if not exist "%CHROME%" set "CHROME=%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe"
set "URL=file:///%HERE:\=/%book.html"

if exist "%TMPOUT%" del "%TMPOUT%"
"%CHROME%" --headless=new --disable-gpu --disable-extensions --log-level=3 --allow-file-access-from-files --no-pdf-header-footer --virtual-time-budget=15000 --print-to-pdf="%TMPOUT%" "%URL%"

if not exist "%TMPOUT%" (
  echo Export failed: Chrome did not produce a PDF.
  goto :end
)
move /y "%TMPOUT%" "%OUT%" >nul 2>&1 || (
  echo Export failed: could not overwrite "%OUT%".
  echo Close the PDF if it is open in a viewer or browser, then run this again.
  goto :end
)
echo Saved: %OUT%

:end
if "%~1"=="" pause
