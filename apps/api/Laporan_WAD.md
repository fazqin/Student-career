# LAPORAN PERKEMBANGAN PROYEK
## Web Application Development (WAD)
### Proyek: CareerTrack (Student Career & Application Tracking Web Application)

---

## 1. Ringkasan Eksekutif Proyek

**CareerTrack** merupakan aplikasi berbasis web yang dirancang khusus untuk membantu mahasiswa dalam mengelola, mencatat, dan memantau seluruh proses pencarian magang (*internship*) maupun pekerjaan secara terstruktur dan terpusat. 

Permasalahan utama yang diselesaikan oleh CareerTrack adalah terpecahnya data lamaran mahasiswa di berbagai platform (seperti catatan pribadi, bookmark browser, spreadsheet, atau chat), yang kerap menyebabkan terlewatnya tenggat waktu (*deadline*), jadwal wawancara yang bentrok, serta ketiadaan metrik/progres pencarian kerja.

Pada fase pengembangan saat ini, fokus pengerjaan berada pada modul backend API yang terletak di direktori **`apps/api`**. REST API dibangun menggunakan runtime **Node.js** dengan framework **Express.js (v5.1.0)**, mengadopsi arsitektur modular yang memisahkan *Routing*, *Controller*, dan *Middleware*.

---

## 2. Matriks Status Perkembangan Proyek

Berdasarkan capaian di dalam direktori `apps/api`, berikut adalah ringkasan status implementasi masing-masing komponen yang dievaluasi pada tahap ini:

| Komponen / Modul | Status | Keterangan & Catatan Perkembangan |
| :--- | :---: | :--- |
| **API Endpoints & Routing** | **Selesai (Active)** | CRUD lengkap telah diimplementasikan untuk entitas **Positions**, **Companies**, **Applications**, **Interviews**, dan **Profiles**. |
| **Middleware (Validation & Error)** | **Selesai (Active)** | Middleware validasi input request body telah aktif di setiap endpoint POST/PUT. Global Error Handling telah dikonfigurasi secara terpusat. |
| **Database Integration** | **On Progress / Belum Selesai** | Data saat ini masih disimpan secara *In-Memory* (JavaScript Array di tingkat controller). Belum terhubung ke Database Management System (DBMS). |
| **Authentication (Auth)** | **On Progress / Belum Selesai** | Struktur file `auth.routes.js`, `auth.controller.js`, dan `auth.validate.js` sudah disiapkan, namun logika register, login, dan hashing password belum diimplementasikan. |
| **JWT (JSON Web Token)** | **On Progress / Belum Selesai** | Dependensi `jsonwebtoken` belum dipasang di `package.json`, mekanisme penerbitan token serta verifikasi payload token masih dalam tahap perancangan. |
| **Auth Middleware (Protected Routes)** | **On Progress / Belum Selesai** | File `auth.middleware.js` telah dialokasikan, namun logika verifikasi header `Authorization: Bearer <token>` belum aktif. |
| **Dashboard Analytics** | **On Progress / Belum Selesai** | File `dashboard.routes.js` dan `dashboard.controller.js` telah dialokasikan untuk ringkasan metrik statistik lamaran, namun belum memiliki endpoint aktif. |

---

## 3. Arsitektur dan Struktur Kode (`apps/api`)

Struktur direktori modul backend API disusun secara rapi dan modular untuk memudahkan *maintenance* serta pemisahan tanggung jawab (*Separation of Concerns*):

```text
apps/api/
├── package.json                   # Konfigurasi dependensi (Express 5) & scripts
├── server.js                      # Entry point server (port 3000)
├── app.js                         # Inisialisasi Express, mounting route & middleware
├── .env                           # File konfigurasi environment
├── Latihan API/                   # Koleksi testing API (OpenCollection / YAML)
└── src/
    ├── controllers/               # Logika pemrosesan data & respon HTTP
    │   ├── application.controller.js
    │   ├── auth.controller.js     (On Progress)
    │   ├── company.controller.js
    │   ├── dashboard.controller.js(On Progress)
    │   ├── interview.controller.js
    │   ├── positions.controller.js
    │   └── profiles.controller.js
    ├── middlewares/               # Fungsi perantara (validasi & error handler)
    │   ├── error.middleware.js    (Global Error Handler)
    │   ├── logger.js              (Request Logger)
    │   ├── checkPositions.js      (Helper Logger/Checker)
    │   ├── auth.middleware.js     (On Progress)
    │   └── validation/            # Validasi spesifik schema payload
    │       ├── application.validate.js
    │       ├── auth.validate.js   (On Progress)
    │       ├── company.validate.js
    │       ├── dashboard.validate.js (On Progress)
    │       ├── interview.validate.js
    │       ├── position.validate.js
    │       └── profile.validate.js
    └── routes/                    # Definisi endpoint & pemetaan HTTP method
        ├── application.routes.js
        ├── auth.routes.js         (On Progress)
        ├── company.routes.js
        ├── dashboard.routes.js    (On Progress)
        ├── interview.routes.js
        ├── positions.routes.js
        └── profiles.routes.js
```

---

## 4. Rincian Implementasi API yang Telah Selesai

Pada tahap ini, modul-modul utama untuk fungsionalitas pencatatan karier mahasiswa telah memiliki endpoint yang berjalan dengan baik.

### 4.1. Modul Positions (`/api/positions`)
Mengelola data lowongan/posisi magang atau pekerjaan.

* **Daftar Endpoint:**
  * `GET /api/positions` — Mendapatkan seluruh daftar posisi.
  * `GET /api/positions/:id` — Mendapatkan detail posisi berdasarkan ID spesifik.
  * `POST /api/positions` — Menambahkan posisi baru (dilengkapi middleware `validatePosition`).
  * `PUT /api/positions/:id` — Memperbarui data posisi berdasarkan ID (dilengkapi middleware `validatePosition`).
  * `DELETE /api/positions/:id` — Menghapus data posisi berdasarkan ID.

* **Contoh Request `POST /api/positions`:**
  ```json
  {
    "name": "Frontend Developer Intern",
    "industry": "Technology",
    "location": "Jakarta Selatan",
    "InternStatus": "Paid"
  }
  ```

* **Contoh Response (HTTP 201 Created):**
  ```json
  {
    "id": 3,
    "name": "Frontend Developer Intern",
    "industry": "Technology",
    "location": "Jakarta Selatan",
    "InternStatus": "Paid"
  }
  ```

---

### 4.2. Modul Companies (`/api/companies`)
Mengelola data direktori perusahaan yang membuka lowongan.

* **Daftar Endpoint:**
  * `GET /api/companies` — Mendapatkan seluruh daftar perusahaan.
  * `GET /api/companies/:id` — Mendapatkan data perusahaan berdasarkan ID.
  * `POST /api/companies` — Menambahkan perusahaan baru (dilengkapi middleware `validateCompany`).
  * `PUT /api/companies/:id` — Memperbarui data perusahaan (dilengkapi middleware `validateCompany`).
  * `DELETE /api/companies/:id` — Menghapus data perusahaan berdasarkan ID.

* **Contoh Request `POST /api/companies`:**
  ```json
  {
    "name": "Gojek Indonesia",
    "industry": "Ride-Hailing & Tech",
    "location": "Jakarta",
    "website": "https://gojek.com"
  }
  ```

* **Contoh Response (HTTP 201 Created):**
  ```json
  {
    "id": 3,
    "name": "Gojek Indonesia",
    "industry": "Ride-Hailing & Tech",
    "location": "Jakarta",
    "website": "https://gojek.com"
  }
  ```

---

### 4.3. Modul Applications (`/api/applications`)
Modul inti untuk pelacakan lamaran yang diajukan oleh pengguna.

* **Daftar Endpoint:**
  * `GET /api/applications` — Mendapatkan seluruh lamaran pengguna.
  * `GET /api/applications/:id` — Mendapatkan detail lamaran tertentu.
  * `POST /api/applications` — Membuat entri lamaran baru (dilengkapi `validateApplicationBody`).
  * `PUT /api/applications/:id` — Memperbarui seluruh field lamaran (dilengkapi `validateApplicationBody`).
  * `PATCH /api/applications/:id` — Memperbarui sebagian data lamaran (misalnya hanya mengubah status lamaran).
  * `DELETE /api/applications/:id` — Menghapus lamaran.

* **Contoh Request `POST /api/applications`:**
  ```json
  {
    "company": "Traveloka",
    "position": "Software Engineer Intern",
    "status": "Applied",
    "deadline": "2026-05-01"
  }
  ```

* **Contoh Response (HTTP 201 Created):**
  ```json
  {
    "id": 4,
    "company": "Traveloka",
    "position": "Software Engineer Intern",
    "status": "Applied",
    "deadline": "2026-05-01"
  }
  ```

---

### 4.4. Modul Interviews (`/api/interview`)
Mendokumentasikan jadwal dan format wawancara terkait lamaran yang sedang aktif.

* **Daftar Endpoint:**
  * `GET /api/interview` — Mendapatkan seluruh daftar jadwal interview.
  * `GET /api/interview/:id` — Mendapatkan detail interview berdasarkan ID.
  * `POST /api/interview` — Menambahkan jadwal interview baru (dilengkapi `validateInterviewBody`).
  * `PUT /api/interview/:id` — Memperbarui jadwal interview (dilengkapi `validateInterviewBody`).
  * `DELETE /api/interview/:id` — Menghapus jadwal interview.

* **Contoh Request `POST /api/interview`:**
  ```json
  {
    "application_id": 4,
    "company": "Traveloka",
    "position": "Software Engineer Intern",
    "interview_date": "2026-05-10T09:00:00Z",
    "type": "Online (Google Meet)",
    "status": "Scheduled"
  }
  ```

* **Contoh Response (HTTP 201 Created):**
  ```json
  {
    "id": 3,
    "application_id": 4,
    "company": "Traveloka",
    "position": "Software Engineer Intern",
    "interview_date": "2026-05-10T09:00:00Z",
    "type": "Online (Google Meet)",
    "status": "Scheduled"
  }
  ```

---

### 4.5. Modul Profiles (`/api/profiles`)
Mengelola identitas akademik dan tautan portofolio mahasiswa.

* **Daftar Endpoint:**
  * `GET /api/profiles` — Mengambil data profil mahasiswa.
  * `PUT /api/profiles/:id` — Memperbarui profil mahasiswa (dilengkapi `validateProfile`).

* **Contoh Request `PUT /api/profiles/1`:**
  ```json
  {
    "name": "Agus Teri",
    "university": "Telkom University",
    "major": "Informatika",
    "semester": 6,
    "github": "https://github.com/agusteri",
    "linkedin": "https://linkedin.com/in/agusteri",
    "portfolio": "https://agusteri.dev"
  }
  ```

* **Contoh Response (HTTP 200 OK):**
  ```json
  {
    "id": 1,
    "name": "Agus Teri",
    "university": "Telkom University",
    "major": "Informatika",
    "semester": 6,
    "github": "https://github.com/agusteri",
    "linkedin": "https://linkedin.com/in/agusteri",
    "portfolio": "https://agusteri.dev"
  }
  ```

---

## 5. Rincian Implementasi Middleware

Middleware telah diimplementasikan untuk menjamin validitas data input sebelum masuk ke controller serta menangani kegagalan sistem secara konsisten.

### 5.1. Input Validation Middleware
Terletak di `src/middlewares/validation/`, middleware ini berfungsi memeriksa kelengkapan *request body* dan tipe data:
* **`validatePosition`**:
  * Memastikan field `name`, `industry`, `location`, dan `InternStatus` tidak kosong.
  * Memvalidasi tipe data berupa `string` dan panjang string nama berada pada rentang 3–50 karakter.
  * Memastikan nilai `InternStatus` harus bernilai `"Paid"` atau `"Unpaid"`.
* **`validateCompany`**:
  * Memeriksa field `name`, `industry`, `location`, dan `website`.
  * Memvalidasi panjang string nama antara 3–100 karakter.
* **`validateApplicationBody`**:
  * Memastikan keberadaan field `company`, `position`, `status`, dan `deadline`. Jika kosong, mengembalikan error `HTTP 400 Bad Request`.
* **`validateInterviewBody`**:
  * Memastikan seluruh field wajib interview terisi lengkap (`application_id`, `company`, `position`, `interview_date`, `type`, `status`).
* **`validateProfile`**:
  * Memvalidasi bahwa `semester` merupakan integer positif dan data profil lainnya bertipe string valid.

### 5.2. Centralized Error Handling Middleware
Terletak di `src/middlewares/error.middleware.js`:
```javascript
const errorHandler = (err, req, res, next) => {
    console.error(err);

    const status = err.status || 500;
    res.status(status).json({
        error: err.message || "Internal Server Error"
    });
};

module.exports = errorHandler;
```
Middleware ini diregistrasikan di akhir rantai middleware pada `app.js`. Ketika terjadi error (misalnya `Position Not Found` dengan kode 404 atau kesalahan validasi dengan kode 400), fungsi controller/middleware memanggil `next(error)` sehingga respon error memiliki format JSON yang seragam di seluruh aplikasi.

---

## 6. Komponen yang Belum Selesai / On Progress

Sesuai dengan ekspektasi evaluasi, berikut adalah komponen yang statusnya **masih dalam tahap pengerjaan (on progress)** atau **belum selesai diimplementasikan**, beserta penjelasan teknis dan kendalanya:

### 6.1. Database Integration (Status: On Progress)
* **Kondisi Saat Ini:**
  * Aplikasi saat ini masih menggunakan penyimpanan sementara di memori (*In-Memory JavaScript Array*) di dalam masing-masing controller (`const positions = [...]`, `const companies = [...]`, dst.).
  * Setiap kali server mengalami *restart*, data baru yang ditambahkan via POST/PUT akan kembali ke kondisi data awal (*initial state*).
* **Rencana Implementasi:**
  * Mengintegrasikan Relational DBMS (seperti **PostgreSQL** atau **MySQL**) dengan Object-Relational Mapping (ORM) seperti **Prisma** atau **Sequelize**, atau menggunakan query builder.
  * Membuat migration script untuk skema tabel: `users`, `profiles`, `companies`, `positions`, `applications`, dan `interviews`.

### 6.2. Authentication & Authorization (Status: On Progress)
* **Kondisi Saat Ini:**
  * File `src/routes/auth.routes.js`, `src/controllers/auth.controller.js`, dan `src/middlewares/validation/auth.validate.js` sudah dibuat dalam struktur proyek, namun konten kodenya masih kosong (`0 bytes`).
  * Belum ada endpoint aktif untuk `POST /api/auth/register`, `POST /api/auth/login`, maupun `POST /api/auth/logout`.
* **Rencana Implementasi:**
  * Menginstal library keamanan kata sandi seperti `bcrypt` atau `bcryptjs`.
  * Membuat fungsi registrasi user baru dengan *password hashing*.
  * Membuat fungsi login yang mencocokkan kredensial email dan password terenkripsi.

### 6.3. JSON Web Token / JWT (Status: On Progress)
* **Kondisi Saat Ini:**
  * Dependensi `jsonwebtoken` belum terdapat pada `apps/api/package.json`.
  * Belum ada utilitas untuk membuat (*signing*) access token saat user berhasil melakukan login.
* **Rencana Implementasi:**
  * Menambahkan dependensi `jsonwebtoken` ke dalam proyek.
  * Membuat generator token berjangka waktu (misal: *expires in 1d* atau *7d*) yang memuat `userId` dan informasi dasar pengguna di payload.
  * Menyiapkan secret key aman melalui environment variable (`JWT_SECRET` di `.env`).

### 6.4. Authentication Middleware (Status: On Progress)
* **Kondisi Saat Ini:**
  * File `src/middlewares/auth.middleware.js` telah dialokasikan, namun belum ada logika verifikasi token.
  * Seluruh endpoint yang ada saat ini masih bersifat publik (dapat diakses tanpa otentikasi).
* **Rencana Implementasi:**
  * Menulis middleware pemeriksa header HTTP `Authorization`.
  * Mengekstrak Bearer token, memverifikasi keabsahannya dengan `jwt.verify`, dan menempelkan informasi user ke objek `req.user`.
  * Melindungi endpoint sensitif (seperti data lamaran, profil, dan jadwal interview milik masing-masing user).

### 6.5. Dashboard & Analytics API (Status: On Progress)
* **Kondisi Saat Ini:**
  * File `src/routes/dashboard.routes.js` dan `src/controllers/dashboard.controller.js` masih kosong (`0 bytes`).
* **Rencana Implementasi:**
  * Menyediakan endpoint ringkasan statistik (contoh: total lamaran yang diajukan, lamaran yang sedang dalam tahap interview, lamaran yang ditolak, serta rasio keberhasilan).

---

## 7. Rencana Tindak Lanjut (Next Steps & Roadmap)

Untuk menyelesaikan tahap berikutnya, tim telah merumuskan langkah perbaikan dan penyelesaian sebagai berikut:

```
[Tahap 1: Setup DBMS & Schema Migration]
        │
        ▼
[Tahap 2: Implementasi Auth & Password Hashing (Bcrypt)]
        │
        ▼
[Tahap 3: Implementasi JWT Signing & Verification]
        │
        ▼
[Tahap 4: Aktivasi Auth Middleware pada Endpoint Private]
        │
        ▼
[Tahap 5: Integrasi Penuh Backend API dengan Frontend (apps/web)]
```

1. **Migrasi Penyimpanan ke Database:** Menghubungkan aplikasi ke database relasional agar seluruh manipulasi data (CRUD) tersimpan secara persisten.
2. **Penyelesaian Modul Autentikasi & JWT:** Membangun alur pendaftaran akun, login, pembuatan JWT, dan proteksi rute API menggunakan `auth.middleware.js`.
3. **Penyusunan Endpoint Dashboard:** Mengimplementasikan agregasi data lamaran untuk ditampilkan pada halaman utama pengguna.
4. **Integrasi Client-Server:** Menghubungkan modul frontend React/Vite yang berada di `apps/web` dengan API backend di `apps/api`.

---

## 8. Kesimpulan

Proyek **CareerTrack** pada bagian backend (`apps/api`) telah menunjukkan perkembangan yang signifikan pada sisi **arsitektur dasar REST API**, **routing modular**, **implementasi CRUD lengkap** untuk lima entitas utama (Positions, Companies, Applications, Interviews, Profiles), serta **middleware validasi input dan error handling terpusat**.

Adapun fitur-fitur tingkat lanjut seperti **Database Integration**, **Authentication (Auth)**, dan **JWT** saat ini berstatus **on progress / belum selesai**. Struktur file untuk fitur-fitur tersebut telah disiapkan dan menjadi prioritas utama pada iterasi pengembangan berikutnya.
