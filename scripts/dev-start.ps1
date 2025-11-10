# Development Server Başlatma Script'i
# Port çakışmasını otomatik çözer ve server'ı başlatır

Write-Host "🚀 Development Server Başlatılıyor..." -ForegroundColor Green

# Port 9002'yi kontrol et ve temizle
$port = 9002
$processes = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique

if ($processes) {
    Write-Host "⚠️  Port $port kullanımda, temizleniyor..." -ForegroundColor Yellow
    foreach ($pid in $processes) {
        try {
            Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
            Write-Host "   ✓ Process $pid sonlandırıldı" -ForegroundColor Gray
        } catch {
            Write-Host "   ✗ Process $pid sonlandırılamadı" -ForegroundColor Red
        }
    }
    Start-Sleep -Seconds 2
}

# .env.local dosyası kontrolü
if (-not (Test-Path ".env.local")) {
    Write-Host "⚠️  .env.local dosyası bulunamadı, env.example'dan oluşturuluyor..." -ForegroundColor Yellow
    if (Test-Path "env.example") {
        Copy-Item "env.example" ".env.local"
        Write-Host "   ✓ .env.local oluşturuldu (değerleri düzenlemeyi unutmayın!)" -ForegroundColor Gray
    } else {
        Write-Host "   ✗ env.example dosyası bulunamadı" -ForegroundColor Red
    }
}

# Node modules kontrolü
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 node_modules bulunamadı, npm install çalıştırılıyor..." -ForegroundColor Yellow
    npm install
}

# Development server'ı başlat
Write-Host "`n✅ Server başlatılıyor: http://localhost:$port" -ForegroundColor Green
npm run dev


