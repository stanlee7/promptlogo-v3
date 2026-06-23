/**
 * PromptLogo 데스크톱 (Electron) 메인 프로세스
 *
 * dist/ 를 내부 정적 서버(127.0.0.1:랜덤포트)로 서빙한 뒤 그 URL을 로드한다.
 * → 렌더러 origin이 http://127.0.0.1:PORT 가 되어 로컬 Ollama(localhost:11434)가
 *   CORS 기본 허용(localhost origin)으로 응답한다. file:// 로딩 시의 CORS/경로 문제를 회피.
 */

const { app, BrowserWindow, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const http = require('http');

const isDev = !app.isPackaged;
const DEV_URL = 'http://localhost:5173';
const DIST_DIR = path.join(__dirname, '..', 'dist');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
};

/** dist/ 를 서빙하는 최소 정적 서버. 시작된 http URL을 resolve. */
function startStaticServer() {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      try {
        const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
        let rel = urlPath === '/' ? '/index.html' : urlPath;
        let filePath = path.normalize(path.join(DIST_DIR, rel));

        // 디렉토리 탈출 방지
        if (!filePath.startsWith(DIST_DIR)) {
          res.writeHead(403).end('Forbidden');
          return;
        }
        // 없으면 SPA fallback
        if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
          filePath = path.join(DIST_DIR, 'index.html');
        }

        const ext = path.extname(filePath).toLowerCase();
        res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
        fs.createReadStream(filePath).pipe(res);
      } catch (e) {
        res.writeHead(500).end('Server error');
      }
    });

    server.on('error', reject);
    // 127.0.0.1 + 랜덤 포트
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      resolve(`http://127.0.0.1:${port}/`);
    });
  });
}

async function createWindow() {
  const win = new BrowserWindow({
    width: 1240,
    height: 880,
    minWidth: 720,
    minHeight: 600,
    backgroundColor: '#0a0a0f',
    title: 'PromptLogo',
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // 외부 링크는 기본 브라우저로
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  if (isDev) {
    win.loadURL(DEV_URL);
  } else {
    const url = await startStaticServer();
    win.loadURL(url);
  }
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
