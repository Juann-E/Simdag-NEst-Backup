@echo off
echo ========================================
echo    SIMDAG Deployment Script
echo ========================================
echo.

set SERVER_IP=10.10.11.149
set SERVER_USER=bowo
set SERVER_PASS=Bowo@123

echo [1/5] Building Frontend...
cd "Frontend"
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Frontend build failed!
    pause
    exit /b 1
)
echo Frontend build completed!
echo.

echo [2/5] Building Backend...
cd "..\Backend"
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Backend build failed!
    pause
    exit /b 1
)
echo Backend build completed!
echo.

echo [3/5] Creating deployment package...
cd ".."
if exist "deployment-package" rmdir /s /q "deployment-package"
mkdir "deployment-package"

:: Copy frontend build
xcopy "Frontend\dist" "deployment-package\frontend" /E /I /Y

:: Copy backend files (exclude node_modules)
xcopy "Backend" "deployment-package\backend" /E /I /Y /EXCLUDE:deployment-exclude.txt

:: Create exclude file for xcopy
echo node_modules\ > deployment-exclude.txt
echo .git\ >> deployment-exclude.txt
echo *.log >> deployment-exclude.txt
echo .env >> deployment-exclude.txt

echo Deployment package created!
echo.

echo [4/5] Upload instructions:
echo.
echo Manual upload required using one of these methods:
echo.
echo A) Using WinSCP:
echo    - Download: https://winscp.net/
echo    - Host: %SERVER_IP%
echo    - Username: %SERVER_USER%
echo    - Password: %SERVER_PASS%
echo    - Upload 'deployment-package' folder to /home/bowo/
echo.
echo B) Using SCP command (if available):
echo    scp -r deployment-package %SERVER_USER%@%SERVER_IP%:/home/bowo/
echo.
echo C) Using HestiaCP File Manager:
echo    - URL: https://%SERVER_IP%:8083
echo    - Username: Bowo
echo    - Password: Bowo@123
echo    - Upload files through web interface
echo.

echo [5/5] Server setup commands:
echo.
echo After uploading, run these commands on the server:
echo.
echo ssh %SERVER_USER%@%SERVER_IP%
echo cd /home/bowo/deployment-package/backend
echo npm install --production
echo cp .env.example .env
echo nano .env  # Edit database and other settings
echo npm run build
echo pm2 start dist/main.js --name simdag-backend
echo pm2 save
echo.
echo Setup Nginx to serve frontend from: /home/bowo/deployment-package/frontend
echo.

echo ========================================
echo Deployment package ready!
echo Check 'deployment-package' folder
echo Follow the upload instructions above
echo ========================================
echo.
pause