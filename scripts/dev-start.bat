@echo off
REM Development Server Başlatma Script'i (Windows Batch)
REM Port çakışmasını otomatik çözer ve server'ı başlatır

echo 🚀 Development Server Başlatılıyor...

REM Port 9002'yi kontrol et ve temizle
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :9002 ^| findstr LISTENING') do (
    echo ⚠️  Port 9002 kullanımda, temizleniyor...
    taskkill /F /PID %%a >nul 2>&1
)

timeout /t 2 /nobreak >nul

REM .env.local dosyası kontrolü
if not exist ".env.local" (
    echo ⚠️  .env.local dosyası bulunamadı, env.example'dan oluşturuluyor...
    if exist "env.example" (
        copy "env.example" ".env.local" >nul
        echo    ✓ .env.local oluşturuldu (değerleri düzenlemeyi unutmayın!)
    ) else (
        echo    ✗ env.example dosyası bulunamadı
    )
)

REM Node modules kontrolü
if not exist "node_modules" (
    echo 📦 node_modules bulunamadı, npm install çalıştırılıyor...
    call npm install
)

REM Development server'ı başlat
echo.
echo ✅ Server başlatılıyor: http://localhost:9002
call npm run dev



