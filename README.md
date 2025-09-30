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
![Tampilan Awal](https://github.com/user-attachments/assets/9698ce0e-9193-4585-8407-58389ad5d148)
![Membuat Catatan](https://github.com/user-attachments/assets/39dafefc-9f7d-424a-bc4c-25fd3cd012ea)
![List Catatan](https://github.com/user-attachments/assets/530f5b99-ce38-4648-a952-1b42019fe3c3)

---

## 📌 Catatan
- Pastikan Node.js dan npm sudah terinstall.
- Environment variable di file `.env` diperlu diatur sesuai API Backend yang digunakan.

---
