@echo off
set CURRENT_PATH=%cd%
set SCRIPT=qckwinsvc --install --name "myRisWebSRVSvc" --description "myRisWeb WEBSRV service" --script "%CURRENT_PATH%\bundle.js" --startImmediately

%SCRIPT%