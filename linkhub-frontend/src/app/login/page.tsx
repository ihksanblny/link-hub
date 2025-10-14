// 'use client' adalah perintah untuk Next.js.
// Ini memberitahu bahwa komponen ini adalah komponen interaktif yang
// akan berjalan di browser, bukan hanya di server.
// Kita membutuhkannya karena kita akan menggunakan hooks seperti useState.
'use client';

// Kita import 'useState' dari React untuk mengelola state (data) di dalam komponen.
import { useState } from 'react';

export default function LoginPage() {
  // Kita buat dua 'state' untuk menyimpan nilai dari input email dan password.
  // 'email' adalah variabel penyimpan nilainya.
  // 'setEmail' adalah fungsi untuk mengubah nilainya.
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Fungsi ini akan dijalankan saat tombol 'Login' ditekan.
  const handleSubmit = async (event: React.FormEvent) => {
    // Mencegah browser me-reload halaman saat form disubmit.
    event.preventDefault();

    // Mengambil URL API dari environment variable.
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    try {
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Jika login gagal (misal: password salah), tampilkan pesan error.
        alert(`Login Gagal: ${data.message}`);
      } else {
        // Jika login berhasil, tampilkan pesan sukses dan tokennya.
        // Nanti kita akan simpan token ini, untuk sekarang kita tampilkan saja.
        alert('Login Berhasil!');
        console.log('Login success data:', data);
      }
    } catch (error) {
      console.error('Terjadi kesalahan:', error);
      alert('Tidak dapat terhubung ke server. Coba lagi nanti.');
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Login to LinkHub</h1>
        
        <div className="mb-4">
          <label htmlFor="email" className="block mb-2 text-sm font-medium">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Setiap ketikan akan update state 'email'
            className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg block w-full p-2.5"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block mb-2 text-sm font-medium">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Setiap ketikan akan update state 'password'
            className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg block w-full p-2.5"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        >
          Login
        </button>
      </form>
    </main>
  );
}