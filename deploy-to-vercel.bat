@echo off
echo ===================================================
echo   🚀 Deploying SmartKitchen AI to Vercel (Free)
echo ===================================================
echo.
echo [1/3] Installing Vercel CLI (if missing)...
call npm install -g vercel
echo.

echo [2/3] Starting Deployment...
echo    - If asked to Log In: Choose 'Continue with GitHub'
echo    - If asked "Set up and deploy?": Type 'Y'
echo    - If asked "Which scope?": Select your name
echo    - If asked "Link to existing project?": Type 'N'
echo    - Accept all other defaults (just press Enter)
echo.
echo [3/3] Running 'vercel' now...
echo.

call npx vercel

echo.
echo ===================================================
echo   ✅ If you see a URL above, you are LIVE!
echo   ⚠️ Don't forget to add environment variables in the Vercel Dashboard!
echo ===================================================
pause
