// Aplikasi PC LDS Quick-Response & Security Dispatch
// Jendela aplikasi yang membuka web aplikasi di GitHub Pages (selalu versi terbaru).

const { app, BrowserWindow, Menu, shell, dialog } = require('electron');
const path = require('path');
const { APP_URL, isAppUrl, toWhatsAppTargets } = require('./links');

const APP_NAME = 'LDS Quick-Response & Security Dispatch';
let win = null;

// Hanya satu jendela aplikasi; bila dibuka lagi, jendela lama dimunculkan
if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (win) {
      if (win.isMinimized()) win.restore();
      win.focus();
    }
  });
  app.setAppUserModelId('id.andiarifin.ldsdispatch');
  app.whenReady().then(() => {
    buildMenu();
    createWindow();
  });
  app.on('window-all-closed', () => app.quit());
}

function createWindow() {
  win = new BrowserWindow({
    width: 1280,
    height: 860,
    minWidth: 380,
    minHeight: 600,
    title: APP_NAME,
    icon: path.join(__dirname, 'build', 'icon.png'),
    backgroundColor: '#F1F5F9',
    autoHideMenuBar: true,
    show: false,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      spellcheck: false
    }
  });

  win.once('ready-to-show', () => win.show());
  win.on('page-title-updated', (e) => e.preventDefault());

  // Link yang membuka jendela/tab baru (mis. tombol WA): jangan buka jendela Electron, arahkan ke luar
  win.webContents.setWindowOpenHandler(({ url }) => {
    openExternalLink(url);
    return { action: 'deny' };
  });

  // Navigasi keluar dari halaman aplikasi juga diarahkan ke luar
  win.webContents.on('will-navigate', (e, url) => {
    if (isAppUrl(url) || url.startsWith('file:')) return;
    e.preventDefault();
    openExternalLink(url);
  });

  // Gagal memuat (mis. tidak ada internet dan belum ada versi tersimpan): tampilkan halaman offline
  win.webContents.on('did-fail-load', (e, code, desc, url, isMainFrame) => {
    if (isMainFrame && code !== -3) {
      win.loadFile(path.join(__dirname, 'offline.html'));
    }
  });

  win.loadURL(APP_URL);
}

// Buka link di luar aplikasi: WhatsApp ke WhatsApp Desktop (cadangan WhatsApp Web), lainnya ke browser
async function openExternalLink(url) {
  const wa = toWhatsAppTargets(url);
  if (wa) {
    let hasDesktop = false;
    try { hasDesktop = !!app.getApplicationNameForProtocol('whatsapp://'); } catch (e) { hasDesktop = false; }
    if (hasDesktop) {
      try {
        await shell.openExternal(wa.desktop);
        return;
      } catch (e) { /* lanjut ke WhatsApp Web */ }
    }
    await shell.openExternal(wa.web);
    return;
  }
  if (/^(https?:|mailto:|tel:)/i.test(url)) {
    await shell.openExternal(url);
  }
}

function buildMenu() {
  const template = [
    {
      label: 'Aplikasi',
      submenu: [
        { label: 'Muat Ulang', accelerator: 'F5', click: () => win && win.webContents.reload() },
        { label: 'Muat Ulang', accelerator: 'CmdOrCtrl+R', visible: false, click: () => win && win.webContents.reload() },
        { label: 'Muat Ulang Penuh', accelerator: 'CmdOrCtrl+Shift+R', click: () => win && win.webContents.reloadIgnoringCache() },
        { label: 'Buka Halaman Utama', click: () => win && win.loadURL(APP_URL) },
        { type: 'separator' },
        { label: 'Perbesar', role: 'zoomIn', accelerator: 'CmdOrCtrl+=' },
        { label: 'Perkecil', role: 'zoomOut' },
        { label: 'Ukuran Normal', role: 'resetZoom' },
        { label: 'Layar Penuh', role: 'togglefullscreen' },
        { type: 'separator' },
        { label: 'Keluar', role: 'quit' }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { label: 'Urungkan', role: 'undo' },
        { label: 'Ulangi', role: 'redo' },
        { type: 'separator' },
        { label: 'Potong', role: 'cut' },
        { label: 'Salin', role: 'copy' },
        { label: 'Tempel', role: 'paste' },
        { label: 'Pilih Semua', role: 'selectAll' }
      ]
    },
    {
      label: 'Bantuan',
      submenu: [
        { label: 'Buka di Browser', click: () => shell.openExternal(APP_URL) },
        {
          label: 'Tentang Aplikasi',
          click: () => dialog.showMessageBox(win, {
            type: 'info',
            title: 'Tentang Aplikasi',
            message: APP_NAME,
            detail: `Versi aplikasi PC: ${app.getVersion()}\nOperation Rokan Area\n\nIsi aplikasi dimuat dari:\n${APP_URL}\nsehingga selalu mengikuti versi terbaru.`
          })
        }
      ]
    }
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}
