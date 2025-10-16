// src/app/register/page.tsx
import Link from "next/link";
import { LinkIcon, UserPlus } from "lucide-react"; 

// Komponen Register
export default function RegisterPage() {
  return (
    // Container utama: Dark Theme (bg-gray-950)
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4 sm:p-8">
      
      {/* Container utama Card (Glassmorphism halus) */}
      <div 
        className="bg-gray-900/50 rounded-3xl backdrop-blur-md shadow-2xl shadow-black/50 p-0 
                   flex w-full max-w-7xl overflow-hidden border border-white/10" 
      >
        
        {/* Kolom Kiri: Mockup Pratinjau LinkHub */}
        <div className="hidden lg:block w-1/2 p-12 bg-gray-900 relative border-r border-white/10">
          
          {/* HANYA PERTAHANKAN TOMBOL KEMBALI KE LINKHUB */}
          <Link href="/" className="flex items-center text-sm font-semibold text-gray-400 hover:text-white mb-10">
            <LinkIcon className="h-4 w-4 mr-1 text-green-400" /> Kembali ke LinkHub
          </Link>

          {/* Mockup Ponsel di Tengah */}
          <div className="flex justify-center">
            <div className="w-[300px] h-[600px] rounded-[36px] bg-black shadow-2xl overflow-hidden border-[12px] border-gray-800 relative">
              
              {/* Konten Mockup LinkHub (Static Preview) */}
              <div className="p-4 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-green-600 mt-4 border-2 border-white/50 shadow-lg"></div>
                <p className="text-white font-bold mt-3 text-lg">@usernameanda</p>
                <p className="text-gray-400 text-xs">Your LinkHub Profile Preview</p>
                
                {/* Contoh Link */}
                <div className="w-full mt-8 space-y-3">
                  <div className="w-full h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center text-white text-sm transition-colors backdrop-blur-sm border border-white/5">Latest Video Link</div>
                  <div className="w-full h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center text-white text-sm transition-colors backdrop-blur-sm border border-white/5">Latest Project</div>
                  <div className="w-full h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center text-white text-sm transition-colors backdrop-blur-sm border border-white/5">Contact Me</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Formulir Register (Lebih Minimalis & Elegan) */}
        <div className="w-full lg:w-1/2 p-8 sm:p-12">
          
          {/* MENGHILANGKAN NAVIGASI SEKUNDER DI SINI */}
          
          <div className="space-y-10 mt-8"> {/* Tambah margin atas agar tidak terlalu ke atas */}
            <header className="space-y-3">
              <h1 className="text-5xl font-extrabold text-white">Let's make it yours.</h1> {/* Font lebih besar */}
              <p className="text-lg text-gray-400"> {/* Font lebih besar */}
                Buat akun Anda. Anda bisa menambahkan dan mengelola link Anda setelah login.
              </p>
            </header>
            
            {/* Form Register Akun */}
            <form className="space-y-6"> 
              <h2 className="text-xl font-bold text-green-400">Buat Akun LinkHub</h2>
              
              {/* Field Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-400">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  placeholder="name@example.com"
                  // Styling Input Tetap Modern
                  className="mt-1 w-full rounded-xl p-3 bg-black/30 text-white shadow-inner focus:ring-purple-500 focus:border-purple-500 transition-shadow" 
                />
              </div>

              {/* Field Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-400">Password</label>
                <input 
                  type="password" 
                  id="password" 
                  placeholder="••••••••"
                  className="mt-1 w-full rounded-xl p-3 bg-black/30 text-white shadow-inner focus:ring-purple-500 focus:border-purple-500 transition-shadow" 
                />
              </div>

              {/* Field Username */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-400">Username Profil</label>
                <input 
                  type="text" 
                  id="username" 
                  placeholder="username_anda"
                  className="mt-1 w-full rounded-xl p-3 bg-black/30 text-white shadow-inner focus:ring-purple-500 focus:border-purple-500 transition-shadow" 
                />
              </div>

              {/* Tombol Register */}
              <button
                type="submit"
                className="w-full text-white font-bold py-3 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 mt-8
                           bg-gradient-to-r from-purple-600 to-pink-500 hover:scale-[1.01] hover:shadow-lg shadow-xl"
              >
                <UserPlus className="h-5 w-5" /> <span>Create My LinkHub</span>
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