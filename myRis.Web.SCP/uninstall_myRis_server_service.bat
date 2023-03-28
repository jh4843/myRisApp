@echo off
set CURRENT_PATH=%cd%
set SCRIPT=qckwinsvc --uninstall --name "myRisWebSRVSvc" --script "%CURRENT_PATH%\bundle.js" 

%SCRIPT%