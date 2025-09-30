# 📝 Catatanku

**Catatanku** adalah aplikasi web sederhana berbasis React untuk manajemen catatan dengan tampilan yang rapi dan mudah digunakan. Penyimpanan catatan dan akun tersimpan pada database yang sudah dibangun pada API Backend. 

---

## 🚀 Fitur
- Tambah, edit, dan hapus catatan
- Setiap catatan bisa memiliki **title**, **tags**, dan **content**
- Setiap akun memiliki catatan yang berbeda

---

## 📂 Struktur Folder

```
catatanku/
├── public/                
├── src/
│   ├── components/        # Isi program js
│   ├── styles/            # Gaya website
│   ├── App.css
│   ├── App.js
│   ├── App.test.js
│   ├── index.css
│   ├── index.js
│   ├── logo.svg
│   ├── reportWebVitals.js
│   └── setupTests.js
├── .env                   # Konfigurasi environment (API Backend disesuaikan)
├── .gitignore
├── package.json
├── package-lock.json
└── README.md              
```

---

## 🛠️ Teknologi yang Digunakan
- [React](https://reactjs.org/) (Create React App)
- JavaScript (ES6+)
- HTML & CSS

---

## ⚡ Instalasi & Menjalankan Project

Clone repo ini:

```bash
git clone https://github.com/muhzarfan/catatanku.git
cd catatanku
```

Install dependencies:

```bash
npm install
```

Jalankan di mode development:

```bash
npm start
```

Aplikasi akan berjalan di [http://localhost:3000](http://localhost:3000).

Build untuk production:

```bash
npm run build
```

---

## 📸 Preview
_(opsional, bisa tambahkan screenshot UI aplikasi kamu di sini)_

---

## 📌 Catatan
- Pastikan Node.js dan npm sudah terinstall.
- Kamu bisa menambahkan environment variable di file `.env` jika diperlukan.

---

## 📄 License
Project ini menggunakan lisensi **MIT**.  
Silakan gunakan, modifikasi, dan distribusikan sesuai kebutuhan.
