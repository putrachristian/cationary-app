# Cationary

Aplikasi web untuk menemukan informasi lengkap tentang berbagai ras kucing dan menemukan ras yang cocok untuk Anda.

## Running the code

Run `npm i` to install the dependencies.

Run `npm run dev` to start the development server.

## PWA (Progressive Web App)

Aplikasi ini telah dikonfigurasi sebagai PWA. Untuk mengaktifkan fitur PWA:

1. Install dependencies:

   ```bash
   npm install
   ```

2. Tambahkan ikon-ikon PWA di folder `public/` (lihat `public/README.md` untuk detail)

3. Build aplikasi:

   ```bash
   npm run build
   ```

4. Serve build untuk testing PWA:
   ```bash
   npx serve build
   ```

### Fitur PWA

- ✅ Offline support dengan service worker
- ✅ Installable sebagai aplikasi
- ✅ Caching untuk performa lebih baik
- ✅ Auto-update saat ada versi baru
- ✅ Support untuk iOS dan Android

### Testing PWA

- **Chrome DevTools**: Buka DevTools > Application > Service Workers
- **Lighthouse**: Jalankan audit PWA di Chrome DevTools
- **Mobile**: Test di perangkat mobile dengan HTTPS atau localhost

### Install ke Device

📖 **Lihat panduan lengkap**: [PWA_INSTALL_GUIDE.md](./PWA_INSTALL_GUIDE.md)

**Quick Start**:

1. Build aplikasi: `npm run build`
2. Serve build: `npm run preview` atau `npm run serve`
3. Buka di browser: `http://localhost:3001`
4. Install:
   - **Android**: Menu → "Install app"
   - **iOS**: Safari → Share → "Add to Home Screen"
   - **Desktop**: Klik ikon install di address bar
