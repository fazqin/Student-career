# CareerTrack

**Student Career & Application Tracking Web Application**

---

## 1. Project Overview

CareerTrack adalah web application yang dirancang untuk membantu mahasiswa mengelola dan memantau proses pencarian internship maupun pekerjaan secara terstruktur.

Mahasiswa sering menyimpan informasi lowongan di berbagai tempat seperti browser bookmark, spreadsheet, chat, atau catatan pribadi. Akibatnya, mereka dapat kesulitan mengetahui lowongan mana yang sudah dilamar, status setiap lamaran, jadwal interview, deadline, serta perkembangan pencarian kerja secara keseluruhan.

CareerTrack menyediakan satu platform untuk menyimpan informasi lowongan, mencatat application, memantau status recruitment, mengelola jadwal interview, dan melihat ringkasan statistik career application.

---

## 2. Problem Statement

Mahasiswa yang sedang mencari internship atau pekerjaan dapat menangani banyak application secara bersamaan. Tanpa sistem tracking yang terstruktur, beberapa masalah dapat muncul:

- sulit mengingat lowongan yang sudah dilamar;
- informasi perusahaan dan posisi tersebar di berbagai tempat;
- deadline application dapat terlewat;
- sulit mengetahui status setiap application;
- jadwal interview tidak terdokumentasi dengan baik;
- mahasiswa tidak memiliki gambaran statistik mengenai proses pencarian kerja mereka.

CareerTrack dibuat untuk menyelesaikan permasalahan tersebut melalui sebuah web application terpusat.

---

## 3. Project Objectives

CareerTrack memiliki tujuan untuk:

1. menyediakan tempat terpusat untuk mengelola informasi lowongan pekerjaan;
2. membantu mahasiswa mencatat dan memantau application;
3. memungkinkan mahasiswa memperbarui status recruitment;
4. membantu mahasiswa mengelola jadwal dan informasi interview;
5. memberikan dashboard ringkas mengenai aktivitas career application;
6. menyediakan analytics sederhana berdasarkan data application pengguna.

---

## 4. Target User

Target utama aplikasi adalah:

> Mahasiswa yang sedang mencari internship, part-time job, maupun entry-level job.

Untuk versi awal, aplikasi hanya memiliki satu jenis pengguna:

- **Student**

Tidak terdapat role recruiter atau company pada MVP agar scope project tetap terkontrol.

---

## 5. Core Features

### 5.1 Authentication

User dapat:

- melakukan register;
- melakukan login;
- melakukan logout;
- mengakses data pribadi setelah authentication.

Security yang digunakan:

- password hashing menggunakan **bcrypt**;
- authentication menggunakan **JWT**;
- protected API routes.

### 5.2 User Profile

User dapat mengelola informasi profile seperti:

- nama
- universitas
- jurusan
- semester
- GitHub
- LinkedIn
- portfolio

Profile digunakan untuk melengkapi informasi career user.

### 5.3 Company Management

Aplikasi menyimpan informasi perusahaan. Data perusahaan meliputi:

- nama perusahaan
- industry
- location
- website

User dapat melihat informasi perusahaan yang tersedia. Pada tahap MVP, data perusahaan dapat dibuat melalui database atau fitur management sederhana.

### 5.4 Job Position Management

Setiap perusahaan dapat memiliki beberapa job position. Informasi position meliputi:

- job title
- description
- company
- location
- employment type
- application deadline

**Contoh:**

| Field | Value |
|---|---|
| Job Title | Data Analyst Intern |
| Company | PT XYZ |
| Location | Jakarta |
| Employment Type | Internship |
| Deadline | 20 September 2026 |

User dapat:

- melihat daftar position;
- mencari position;
- melakukan filtering;
- melihat detail position.

### 5.5 Application Tracking

Application Tracking merupakan **fitur utama** CareerTrack. User dapat mencatat lowongan yang ingin atau sudah dilamar.

Setiap application memiliki status:

- `WISHLIST`
- `APPLIED`
- `ASSESSMENT`
- `INTERVIEW`
- `OFFER`
- `REJECTED`
- `WITHDRAWN`

**Contoh alur:**

```
WISHLIST → APPLIED → ASSESSMENT → INTERVIEW → OFFER
```

Status juga dapat berakhir menjadi `REJECTED` atau `WITHDRAWN`.

User dapat:

- menambahkan application;
- melihat application;
- mengubah status;
- menambahkan notes;
- menghapus application.

---

## 6. Interview Management

Jika sebuah application masuk ke tahap interview, user dapat mencatat informasi interview meliputi:

- tanggal dan waktu
- interview type
- location/platform
- notes
- result

**Contoh:**

| Field | Value |
|---|---|
| Company | PT XYZ |
| Position | Data Analyst Intern |
| Interview | 18 September 2026, 10:00 WIB |
| Type | Online |
| Platform | Google Meet |

---

## 7. Dashboard

Dashboard memberikan ringkasan aktivitas career user.

**Informasi utama:**

- Total Applications
- Interviews
- Offers
- Rejected

**Dashboard juga menampilkan:**

- application berdasarkan status;
- upcoming application deadlines;
- upcoming interviews;
- recent applications.

**Contoh:**

| Metric | Value |
|---|---|
| Total Applications | 18 |
| Interviews | 3 |
| Offers | 1 |
| Rejected | 5 |

---

## 8. Career Analytics

CareerTrack menyediakan analytics sederhana berdasarkan data application user.

### Application Status

| Status | Count |
|---|---|
| Applied | 8 |
| Assessment | 3 |
| Interview | 3 |
| Offer | 1 |
| Rejected | 3 |

### Interview Rate

```
Interview Rate = (Interview Applications ÷ Total Applications) × 100%
```

### Offer Rate

```
Offer Rate = (Offers ÷ Total Applications) × 100%
```

Analytics ditampilkan dalam bentuk angka, chart, atau visualisasi sederhana.

---

## 9. Job Data

### Development Data

Mock/seed data digunakan selama development dan testing. Contoh:

- companies
- positions
- applications
- interviews

### Optional Data Import

Sebagai fitur tambahan, aplikasi dapat dikembangkan agar mampu menerima data lowongan dari sumber eksternal melalui proses import.

Data scraping **bukan** merupakan dependency utama aplikasi. Dengan demikian, apabila sumber eksternal mengalami perubahan atau tidak tersedia, fitur utama CareerTrack tetap dapat berjalan menggunakan data PostgreSQL.

---

## 10. Technology Stack

| Layer | Teknologi | Keterangan |
|---|---|---|
| **Frontend** | React, Vite, Tailwind CSS, React Router, Recharts | Berfungsi sebagai client yang mengonsumsi REST API dari backend. |
| **Backend** | Node.js, Express.js | Bertanggung jawab terhadap API, authentication, authorization, business logic, validation, dan database interaction. |
| **Database** | PostgreSQL, Supabase | Supabase digunakan sebagai hosted PostgreSQL database. Backend mengakses database menggunakan PostgreSQL client dan raw SQL query. **Tidak menggunakan ORM.** |
| **Authentication & Security** | bcrypt, JWT, dotenv | Password tidak disimpan dalam bentuk plaintext. |

---

## 11. API Architecture

CareerTrack menggunakan REST API.

### Auth

```
POST   /api/auth/register
POST   /api/auth/login
```

### Companies

```
GET    /api/companies
POST   /api/companies
GET    /api/companies/:id
PUT    /api/companies/:id
DELETE /api/companies/:id
```

### Positions

```
GET    /api/positions
POST   /api/positions
GET    /api/positions/:id
PUT    /api/positions/:id
DELETE /api/positions/:id
```

### Applications

```
GET    /api/applications
POST   /api/applications
GET    /api/applications/:id
PUT    /api/applications/:id
PATCH  /api/applications/:id/status
DELETE /api/applications/:id
```

### Interviews

```
GET    /api/interviews
POST   /api/interviews
GET    /api/interviews/:id
PUT    /api/interviews/:id
DELETE /api/interviews/:id
```

### Dashboard

```
GET    /api/dashboard
```

### Profile

```
GET    /api/profile
PUT    /api/profile
```

---

## 12. Database Overview

Database utama terdiri dari:

- `users`
- `profiles`
- `companies`
- `positions`
- `applications`
- `interviews`

**Relasi utama:**

```
USER 1:N APPLICATION N:1 POSITION N:1 COMPANY
APPLICATION 1:N INTERVIEW
```

---

## 13. Data Flow

```
┌─────────────────────┐
│   React Frontend    │
└──────────┬──────────┘
           │ HTTP / JSON
           ↓
┌─────────────────────┐
│  Express REST API   │
│ Routes / Controllers│
│ Middleware / Valid. │
└──────────┬──────────┘
           │ Raw SQL
           ↓
┌─────────────────────┐
│ Supabase PostgreSQL │
└─────────────────────┘
```

---

## 14. Example User Scenario

1. Seorang mahasiswa menemukan lowongan **Data Analyst Intern — Company XYZ**.
2. User membuka CareerTrack, melihat detail position, lalu memilih **Add to Application**. Application dibuat dengan status `APPLIED`.
3. Beberapa hari kemudian perusahaan mengundang user untuk interview. User mengubah status `APPLIED` → `INTERVIEW`, lalu menambahkan jadwal: 18 September 2026, 10:00 WIB, Online Interview.
4. Setelah interview, perusahaan memberikan offer. User mengubah status `INTERVIEW` → `OFFER`.
5. Dashboard kemudian otomatis memperbarui: **Applications: 1, Interviews: 1, Offers: 1**.

---

## 15. MVP Scope

### Required

- [ ] Register
- [ ] Login
- [ ] JWT authentication
- [ ] Password hashing
- [ ] User profile
- [ ] Company data
- [ ] Job position data
- [ ] Application CRUD
- [ ] Application status
- [ ] Interview CRUD
- [ ] Dashboard
- [ ] Basic analytics
- [ ] PostgreSQL
- [ ] REST API
- [ ] Raw SQL
- [ ] Input validation
- [ ] Error handling

### Optional

- Job scraping
- CSV import
- Application status history
- Email reminder
- Resume management
- Advanced recommendation
- AI career assistant

> Optional features hanya dikerjakan **setelah MVP selesai**.

---

## 16. Non-Goals

Untuk menjaga scope tetap realistis, CareerTrack **tidak** ditujukan menjadi:

- job marketplace
- recruitment platform
- LinkedIn clone
- HR management system
- company recruitment dashboard
- full AI career advisor

CareerTrack berfokus pada:

> **Personal career application management untuk mahasiswa.**

---

## 17. Success Criteria

Project dianggap berhasil apabila user dapat:

- membuat akun
- login
- melihat job position
- menyimpan application
- mengubah status application
- mencatat interview
- melihat deadline
- melihat dashboard
- melihat career analytics

Seluruhnya melalui REST API yang terhubung dengan PostgreSQL.

Selain fungsi aplikasi, project juga harus menunjukkan penggunaan:

- relational database
- foreign key
- JOIN
- aggregation
- parameterized query
- authentication
- authorization
- REST API
- raw SQL
- proper HTTP status codes
- error handling

---

## 18. Project Goal

Tujuan akhir CareerTrack bukan sekadar membuat website pencatat lowongan.

Project ini ditujukan untuk menunjukkan kemampuan membangun sebuah **full web application backend** yang terdiri dari:

```
Database + Raw SQL + REST API + Authentication + Business Logic + Frontend Client
```

Sehingga CareerTrack dapat menjadi project yang menunjukkan kemampuan mahasiswa dalam membangun aplikasi berbasis database dari sisi backend sampai client.
