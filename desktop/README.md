# Aplikasi PC – LDS Quick-Response & Security Dispatch

Aplikasi Windows (Electron) yang membuka web aplikasi
https://andiarifin171-prog.github.io/lds-pertagas-ora/ di jendela sendiri.
Isi aplikasi selalu mengikuti versi terbaru di GitHub Pages; installer cukup dipasang sekali.

## Fitur
- Jendela aplikasi sendiri, muncul di Start Menu, Desktop, dan taskbar.
- Tombol WA membuka **WhatsApp Desktop**; bila belum terpasang, otomatis memakai WhatsApp Web.
- Halaman "Tidak ada koneksi internet" bila aplikasi belum bisa dimuat.
- Menu: Muat Ulang (F5), Muat Ulang Penuh (Ctrl+Shift+R), Perbesar/Perkecil, Layar Penuh (F11).

## Cara mendapatkan installer
Installer dibuat otomatis oleh GitHub Actions (`.github/workflows/build-desktop.yml`)
setiap ada perubahan di folder `desktop/`, lalu diterbitkan di halaman **Releases** repo.

## Merilis versi baru aplikasi PC
Perubahan pada web aplikasi (`index.html`) **tidak** memerlukan installer baru.
Installer baru hanya diperlukan bila isi folder `desktop/` berubah: naikkan `version`
di `desktop/package.json`, lalu kirim ke GitHub.

## Menjalankan dari kode (opsional)
```
cd desktop
npm install
npm start          # jalankan aplikasi
npm run dist:win   # buat installer Windows di desktop/dist/
```
