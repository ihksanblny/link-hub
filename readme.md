# LinkHub 🚀

**Satu Link. Semua Persona Anda.**

LinkHub adalah aplikasi web *full-stack* yang memungkinkan pengguna membuat halaman profil publik sederhana untuk membagikan semua link penting mereka di satu tempat, mirip dengan Linktree. Dibangun dengan tumpukan teknologi modern untuk performa dan pengalaman pengguna yang optimal.



## ✨ Fitur Utama

* **Autentikasi Pengguna:** Registrasi dan Login aman menggunakan Supabase Auth.
* **Manajemen Link (CRUD):** Tambah, lihat, edit, dan hapus link melalui dashboard yang interaktif.
* **Halaman Profil Publik:** Halaman dinamis (`/username`) yang menampilkan daftar link pengguna.
* **Kustomisasi Username:** Pengguna dapat mengatur username unik untuk halaman profil mereka.
* **Pelacakan Klik:** Backend melacak jumlah klik untuk setiap link melalui sistem *redirect* cerdas.
* **Dashboard Modern:** Antarmuka pengguna yang bersih dan responsif dibangun dengan Next.js dan Shadcn UI.
* **Desain "Glassmorphism":** Tampilan modern dengan efek kaca buram yang elegan.

## 💻 Tumpukan Teknologi (Tech Stack)

* **Frontend:**
    * [Next.js](https://nextjs.org/) (React Framework)
    * [React](https://reactjs.org/)
    * [TypeScript](https://www.typescriptlang.org/)
    * [Tailwind CSS](https://tailwindcss.com/)
    * [Shadcn UI](https://ui.shadcn.com/) (Library Komponen)
    * [Lucide React](https://lucide.dev/) (Ikon)
* **Backend:**
    * [Node.js](https://nodejs.org/)
    * [Express.js](https://expressjs.com/)
    * [Supabase](https://supabase.com/) (Backend as a Service - Database PostgreSQL, Auth)
    * [JSON Web Tokens (JWT)](https://jwt.io/)
* **Database:**
    * [PostgreSQL](https://www.postgresql.org/) (via Supabase)

## 🚀 Memulai (Getting Started)

Proyek ini terdiri dari dua bagian: backend dan frontend, yang harus dijalankan secara terpisah.

### Prasyarat

* [Node.js](https://nodejs.org/) (Versi LTS direkomendasikan)
* [npm](https://www.npmjs.com/) atau [yarn](https://yarnpkg.com/)
* Akun [Supabase](https://supabase.com/) (Gratis)

### Setup

1.  **Clone Repository:**
    ```bash
    git clone https://github.com/ihksanblny/link-hub.git
    cd linkhub-project
    ```

2.  **Setup Backend:**
    * Masuk ke direktori backend: `cd linkhub-backend`
    * Install dependensi: `npm install`
    * Buat proyek baru di [Supabase](https://supabase.com/).
    * Salin file `.env.example` menjadi `.env`.
    * Isi variabel lingkungan di `.env` dengan kredensial Supabase Anda (`SUPABASE_URL`, `SUPABASE_ANON_KEY`) dan `PORT` (misal: 8080).
    * Jalankan skrip SQL (dari percakapan kita) di Supabase SQL Editor untuk membuat tabel `profiles`, fungsi `increment_clicks`, fungsi trigger, dan memberikan izin (`GRANT`).

3.  **Setup Frontend:**
    * Kembali ke direktori utama, lalu masuk ke direktori frontend: `cd ../linkhub-frontend`
    * Install dependensi: `npm install`
    * Buat file `.env.local`.
    * Isi variabel lingkungan `NEXT_PUBLIC_API_URL` dengan alamat backend Anda (misal: `http://localhost:8080`).

