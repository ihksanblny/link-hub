// src/app/register/page.tsx
'use client'; // WAJIB: Untuk menggunakan hooks dan interaksi browser

import Link from "next/link";
import { LinkIcon, UserPlus, Loader2 } from "lucide-react";
import { useState } from 'react';
import { useRouter } from 'next/navigation'; 
import { useAuth } from '@/context/AuthContext'; 

// Komponen Register
export default function RegisterPage() {
    // 1. STATE UNTUK INPUT DAN KONTROL FORM
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    
    const router = useRouter();
    const { login } = useAuth();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL; // Pastikan ini adalah base URL backend Anda

    // 2. HANDLER SUBMIT
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Mencegah reload halaman default
        setError('');
        setIsLoading(true);

        try {
            const response = await fetch(`${apiUrl}/auth/register`, { // Asumsi: Endpoint registrasi adalah /auth/register
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, username }), 
            });

            const data = await response.json();

            if (!response.ok) {
                // Tangani error dari backend (misal: username sudah terpakai, password terlalu pendek)
                throw new Error(data.message || 'Pendaftaran gagal. Coba cek input Anda.');
            }

            // Jika pendaftaran berhasil, login secara otomatis dan redirect ke dashboard
            alert('Pendaftaran berhasil! Silakan Login.'); 
            router.push('/login'); // <-- LANGSUNG REDIRECT KE HALAMAN LOGIN

        } catch (err: any) {
            console.error("Registration Error:", err);
            setError(err.message || 'Terjadi kesalahan saat koneksi.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4 sm:p-8">
            
            {/* Container utama Card (Glassmorphism halus) */}
            <div 
                className="bg-gray-900/50 rounded-3xl backdrop-blur-md shadow-2xl shadow-black/50 p-0 
                           flex w-full max-w-7xl overflow-hidden border border-white/10" 
            >
                
                {/* Kolom Kiri: Mockup Pratinjau LinkHub (Tetap sama) */}
                <div className="hidden lg:block w-1/2 p-12 bg-gray-900 relative border-r border-white/10">
                    <Link href="/" className="flex items-center text-sm font-semibold text-gray-400 hover:text-white mb-10">
                        <LinkIcon className="h-4 w-4 mr-1 text-green-400" /> Kembali ke LinkHub
                    </Link>

                    {/* Mockup Ponsel di Tengah (Konten statis) */}
                    <div className="flex justify-center">
                        <div className="w-[300px] h-[600px] rounded-[36px] bg-black shadow-2xl overflow-hidden border-[12px] border-gray-800 relative">
                            <div className="p-4 flex flex-col items-center">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-green-600 mt-4 border-2 border-white/50 shadow-lg"></div>
                                <p className="text-white font-bold mt-3 text-lg">@usernameanda</p>
                                <p className="text-gray-400 text-xs">Your LinkHub Profile Preview</p>
                                <div className="w-full mt-8 space-y-3">
                                    <div className="w-full h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center text-white text-sm transition-colors backdrop-blur-sm border border-white/5">Latest Video Link</div>
                                    <div className="w-full h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center text-white text-sm transition-colors backdrop-blur-sm border border-white/5">Latest Project</div>
                                    <div className="w-full h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center text-white text-sm transition-colors backdrop-blur-sm border border-white/5">Contact Me</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Kolom Kanan: Formulir Register */}
                <div className="w-full lg:w-1/2 p-8 sm:p-12">
                    <div className="space-y-10 mt-8">
                        <header className="space-y-3">
                            <h1 className="text-5xl font-extrabold text-white">Let's make it yours.</h1>
                            <p className="text-lg text-gray-400">
                                Buat akun Anda. Anda bisa menambahkan dan mengelola link Anda setelah login.
                            </p>
                        </header>
                        
                        {/* Form Register Akun */}
                        <form onSubmit={handleSubmit} className="space-y-6"> {/* <--- HANDLER SUBMIT */}
                            <h2 className="text-xl font-bold text-green-400">Buat Akun LinkHub</h2>
                            
                            {error && <p className="text-red-400 text-sm">{error}</p>} {/* Menampilkan Error */}
                            
                            {/* Field Email */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-400">Email</label>
                                <input 
                                    type="email" 
                                    id="email" 
                                    value={email} // <--- BIND STATE
                                    onChange={(e) => setEmail(e.target.value)} 
                                    placeholder="name@example.com"
                                    required
                                    className="mt-1 w-full rounded-xl p-3 bg-black/30 text-white shadow-inner focus:ring-purple-500 focus:border-purple-500 transition-shadow" 
                                />
                            </div>

                            {/* Field Password */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-400">Password</label>
                                <input 
                                    type="password" 
                                    id="password" 
                                    value={password} // <--- BIND STATE
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="mt-1 w-full rounded-xl p-3 bg-black/30 text-white shadow-inner focus:ring-purple-500 focus:border-purple-500 transition-shadow" 
                                />
                            </div>

                            {/* Field Username */}
                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-gray-400">Username Profil</label>
                                <input 
                                    type="text" 
                                    id="username" 
                                    value={username} // <--- BIND STATE
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="username_anda"
                                    required
                                    className="mt-1 w-full rounded-xl p-3 bg-black/30 text-white shadow-inner focus:ring-purple-500 focus:border-purple-500 transition-shadow" 
                                />
                            </div>

                            {/* Tombol Register (Menampilkan Loading Spinner) */}
                            <button
                                type="submit"
                                disabled={isLoading} // Nonaktifkan saat loading
                                className="w-full text-white font-bold py-3 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 mt-8
                                           bg-gradient-to-r from-purple-600 to-pink-500 hover:scale-[1.01] hover:shadow-lg shadow-xl disabled:opacity-50"
                            >
                                {isLoading ? (
                                    <> <Loader2 className="h-5 w-5 animate-spin" /> <span>Creating Account...</span> </>
                                ) : (
                                    <> <UserPlus className="h-5 w-5" /> <span>Create My LinkHub</span> </>
                                )}
                            </button>

                            <p className="text-center text-sm text-gray-400 pt-2">
                                Already have an account? <Link href="/login" className="font-semibold text-green-400 hover:underline">Log in</Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}