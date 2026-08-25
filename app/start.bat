@echo off
chcp 65001 >nul
cd /d "%~dp0"
title TOEIC Speaking 실전 트레이너

rem 파이썬 찾기 - Windows 는 py / python / python3 중 하나
set "PY="
py -3 --version >nul 2>&1 && (set "PY=py -3") && goto :found
python --version >nul 2>&1 && (set "PY=python") && goto :found
python3 --version >nul 2>&1 && (set "PY=python3") && goto :found
goto :nopython

:found
rem 비어 있는 포트 찾기 (최대 20개까지만 시도)
set /a PORT=8777
set /a TRIES=0
:portcheck
if %TRIES% GEQ 20 goto :portok
netstat -ano | findstr /r /c:":%PORT% .*LISTENING" >nul 2>&1
if errorlevel 1 goto :portok
set /a PORT+=1
set /a TRIES+=1
goto :portcheck

:portok
echo.
echo   TOEIC Speaking 실전 트레이너
echo   http://localhost:%PORT%
echo.
echo   이 창을 닫으면 종료됩니다.
echo.
start "" "http://localhost:%PORT%/"
%PY% -m http.server %PORT%
goto :eof

:nopython
echo.
echo   Python 이 설치되어 있지 않습니다.
echo.
echo   서버 없이도 대부분 동작하므로 index.html 을 바로 엽니다.
echo   단, 브라우저를 완전히 종료하면 지난 녹음 오디오는 사라집니다.
echo   (점수, 메모, 드릴 기록은 남습니다.)
echo.
echo   오디오까지 보관하려면 python.org 에서 Python 을 설치한 뒤
echo   이 파일을 다시 실행하세요.
echo.
start "" "index.html"
pause
