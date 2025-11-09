// Port temizleme script'i
const { execSync } = require('child_process');
const port = process.argv[2] || 9002;

try {
  if (process.platform === 'win32') {
    // Windows
    try {
      const result = execSync(`netstat -ano | findstr :${port}`, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'ignore'] });
      const lines = result.split('\n').filter(line => line.includes('LISTENING'));
      
      if (lines.length > 0) {
        lines.forEach(line => {
          const parts = line.trim().split(/\s+/);
          const pid = parts[parts.length - 1];
          if (pid && !isNaN(pid)) {
            try {
              execSync(`taskkill /F /PID ${pid}`, { stdio: 'ignore' });
              console.log(`✓ Port ${port} temizlendi (PID: ${pid})`);
            } catch (e) {
              // Process zaten sonlanmış olabilir
            }
          }
        });
      } else {
        console.log(`Port ${port} zaten temiz`);
      }
    } catch (e) {
      // Port kullanımda değilse hata verme
      if (!e.message.includes('findstr')) {
        console.log(`Port ${port} zaten temiz`);
      }
    }
  } else {
    // Linux/Mac
    try {
      execSync(`lsof -ti:${port} | xargs kill -9 2>/dev/null || true`, { stdio: 'ignore' });
      console.log(`✓ Port ${port} temizlendi`);
    } catch (e) {
      console.log(`Port ${port} zaten temiz`);
    }
  }
} catch (e) {
  // Genel hata durumunda devam et
  console.log(`Port ${port} kontrol edildi`);
}

