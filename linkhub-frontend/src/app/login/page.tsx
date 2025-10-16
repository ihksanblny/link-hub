// 'use client' adalah perintah untuk Next.js.
'use client';

// Kita import 'useState' dari React untuk mengelola state (data) di dalam komponen.
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { LogIn, UserPlus, LinkIcon } from 'lucide-react'; // Import ikon

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter(); 
  const { login } = useAuth(); 

  // Fungsi ini akan dijalankan saat tombol 'Login' ditekan.
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

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
        alert(`Login Gagal: ${data.message}`);
      } else {
        const accessToken = data.data.session.access_token
        login(accessToken);
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Terjadi kesalahan:', error);
      alert('Tidak dapat terhubung ke server. Coba lagi nanti.');
    }
  };

  return (
    // Container utama: Dark Theme (bg-gray-950)
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4 sm:p-8">
      
      {/* Container Card Login (Single Column, Glassmorphism) */}
      <div 
        className="bg-gray-900/50 rounded-3xl backdrop-blur-md shadow-2xl shadow-black/50 p-0 
                   flex w-full max-w-lg overflow-hidden border border-white/10" // Max-w lebih kecil
      >
        
        {/* Kolom Penuh: Formulir Login */}
        <div className="w-full p-8 sm:p-12">
          
          {/* Tombol Kembali ke Homepage (Elegan) */}
          <Link href="/" className="flex items-center text-sm font-semibold text-gray-400 hover:text-white mb-8">
            <LinkIcon className="h-4 w-4 mr-1 text-green-400" /> Kembali ke LinkHub
          </Link>

          <div className="space-y-8 mt-4"> 
            <header className="space-y-2">
              <h1 className="text-4xl font-extrabold text-white">Welcome Back.</h1>
              <p className="text-lg text-gray-400">
                Akses dashboard Anda untuk mengelola semua tautan.
              </p>
            </header>
            
            {/* Form Login */}
            <form onSubmit={handleSubmit} className="space-y-6"> 
              <h2 className="text-xl font-bold text-green-400 pt-2">Masuk ke Akun Anda</h2>
              
              {/* Field Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-400">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="mt-1 w-full rounded-xl p-3 bg-black/30 text-white shadow-inner focus:ring-purple-500 focus:border-purple-500 transition-shadow" 
                  required
                />
              </div>

              {/* Field Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-400">Password</label>
                <input 
                  type="password" 
                  id="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="mt-1 w-full rounded-xl p-3 bg-black/30 text-white shadow-inner focus:ring-purple-500 focus:border-purple-500 transition-shadow" 
                  required
                />
              </div>

              {/* Tombol Login */}
              <button
                type="submit"
                className="w-full text-white font-bold py-3 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 mt-8
                           bg-gradient-to-r from-purple-600 to-pink-500 hover:scale-[1.01] hover:shadow-lg shadow-xl"
              >
                <LogIn className="h-5 w-5" /> <span>Login to Dashboard</span>
              </button>

              <p className="text-center text-sm text-gray-400 pt-2">
                Don't have an account? <Link href="/register" className="font-semibold text-green-400 hover:underline">Create a LinkHub</Link>
              </p>
            </form>
          </div>
        </div>
        
      </div>
    </div>
  );
}