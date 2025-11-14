// Cross-platform development server starter
const { execSync, spawn } = require('child_process');
const port = 9002;

// Kill port first
try {
  require('./kill-port.js');
  // Wait a bit for port to be released
  if (process.platform === 'win32') {
    execSync('timeout /t 1 /nobreak >nul 2>&1', { stdio: 'ignore' });
  } else {
    execSync('sleep 1', { stdio: 'ignore' });
  }
} catch (e) {
  // Continue even if kill-port fails
}

// Start Next.js dev server
console.log('🚀 Starting development server on port', port);
const nextDev = spawn('npx', ['next', 'dev', '--turbopack', '-p', port.toString()], {
  stdio: 'inherit',
  shell: true
});

nextDev.on('error', (err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

nextDev.on('exit', (code) => {
  process.exit(code || 0);
});


