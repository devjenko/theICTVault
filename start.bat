@echo off
echo Starting Exam Portal...

:: Kill any existing process on port 8000
for /f "tokens=5" %%a in ('netstat -aon ^| find ":8000"') do taskkill /F /PID %%a 2>nul

:: Start Python server
start "Exam Portal Server" python -m http.server 8000

:: Wait a moment for the server to start
timeout /t 2 /nobreak

:: Open the browser
start http://localhost:8000/dashboard.html

echo Server is running...
echo The exam portal should open in your browser automatically.
echo DO NOT CLOSE THIS WINDOW while using the exam portal.
echo.
echo Press Ctrl+C to stop the server when you're done.
pause >nul 