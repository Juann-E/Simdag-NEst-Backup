@echo off
echo ========================================
echo Testing SIMDAG Frontend Build Process
echo ========================================
echo.

echo [1/4] Navigating to Frontend directory...
cd Frontend
if errorlevel 1 (
    echo ERROR: Cannot find Frontend directory!
    pause
    exit /b 1
)

echo [2/4] Installing dependencies...
npm install
if errorlevel 1 (
    echo ERROR: npm install failed!
    pause
    exit /b 1
)

echo [3/4] Running TypeScript check...
npx tsc --noEmit
if errorlevel 1 (
    echo WARNING: TypeScript errors found, but continuing...
)

echo [4/4] Building for production...
npm run build
if errorlevel 1 (
    echo ERROR: Build failed!
    pause
    exit /b 1
)

echo.
echo ========================================
echo ✅ Build completed successfully!
echo ========================================
echo.
echo Build output is in: Frontend/dist/
echo You can now deploy this to Netlify.
echo.
echo To test locally, run: npm run preview
echo.
pause