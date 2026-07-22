# Pemilihan Ketua Tingkat 🗳️

Simulasi pemilihan ketua tingkat berbasis web — murni HTML/CSS/JS tanpa framework.

## Fitur

- **Voting interaktif** dengan modal konfirmasi
- **Tombol evasive** — tombol kandidat "diri sendiri" menghindar saat diklik/dihover
- **Persistensi suara** via `localStorage`
- **Accessibility** — `role="dialog"`, `aria-modal`, focus trap, keyboard navigation
- **Responsive** — layout menyesuaikan layar kecil (≤360px)
- **ES Modules** — kode terpisah per tanggung jawab

## Struktur

```
├── index.html          # Halaman utama
├── styles.css          # Seluruh styling + responsive
├── config.js           # Konfigurasi terpusat (nama, kandidat, konstanta UI)
├── app.js              # Entry point, render, modal logic
├── escapeButton.js     # Logika tombol menghindar (absolute positioning + easing)
├── vote.js             # State voting, localStorage, render hasil
```

## Cara Pakai

1. Buka `index.html` di browser
2. Klik tombol "Pilih" pada kandidat
3. Konfirmasi di modal
4. Coba klik tombol merah — tombol akan menghindar

## Konfigurasi

Edit `config.js` untuk mengubah nama kandidat, nama "diri sendiri", atau konstanta UI:

```js
export const CONFIG = {
  YOUR_NAME: 'Anda',
  CANDIDATES: [...],
  UI: {
    EVASIVE_PADDING: 5,
    MESSAGE_DURATION: 2000,
    FLASH_DURATION: 800,
    RESIZE_DEBOUNCE: 300
  },
  STORAGE_KEY: 'peketing_votes'
};
```

## Demo

Buka via GitHub Pages: https://syawal3321.github.io/pemilihan-ketua-tingkat/

## Catatan

Ini murni simulasi teknis, **bukan** untuk pemungutan suara sesungguhnya.

## Lisensi

MIT
