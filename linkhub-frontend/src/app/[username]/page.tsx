// src/app/[username]/page.tsx
import Link from "next/link";

// 1. PERBARUI TIPE DATA: Tambahkan 'short_code' dan 'clicks'
interface ProfileData {
  full_name: string | null;
  username: string;
  links: {
    id: number;
    title: string | null;
    url: string;
    short_code: string; // <-- Diperlukan untuk membuat URL redirect
    clicks: number;
  }[];
  avatar_url: string | null;
}

// Fungsi untuk mengambil data dari backend (TIDAK BERUBAH)
async function getProfileData(username: string): Promise<ProfileData | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  try {
    const res = await fetch(`${apiUrl}/profile/${username}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Gagal mengambil data profil:", error);
    return null;
  }
}

export default async function ProfilePage({ params }: { params: { username: string } }) {
  const profileData = await getProfileData(params.username);
  // Definisikan apiUrl di sini agar bisa diakses di dalam return
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!profileData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-white bg-[#020617]">
        <h1 className="text-4xl font-bold">404 - Profil Tidak Ditemukan</h1>
        <p className="mt-4 text-lg text-slate-400">Profil yang Anda cari tidak ada.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#020617] relative overflow-hidden text-white selection:bg-purple-500/30">

      {/* Animated Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-600/20 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-600/20 blur-[120px] animate-pulse delay-1000" />
        <div className="absolute top-[40%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-[100px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center min-h-screen w-full px-4 py-16 sm:py-24">
        <div className="w-full max-w-lg mx-auto">

          {/* Header Section */}
          <header className="flex flex-col items-center text-center space-y-6 mb-12 animate-fade-in">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 blur"></div>
              <div className="relative w-28 h-28 rounded-full border-4 border-[#020617] shadow-2xl overflow-hidden bg-slate-800">
                {profileData.avatar_url ? (
                  <img
                    src={profileData.avatar_url}
                    alt={profileData.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-800 text-white text-3xl font-bold">
                    {profileData.username.substring(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                {profileData.full_name || `@${profileData.username}`}
              </h1>
              <p className="text-slate-400 text-lg max-w-sm mx-auto leading-relaxed">
                Selamat datang di halaman link saya!
              </p>
            </div>
          </header>

          {/* Links Section */}
          <main className="space-y-4 w-full">
            {profileData.links.length > 0 ? (
              profileData.links.map((link, index) => (
                <a
                  key={link.id}
                  href={`${apiUrl}/${link.short_code}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex items-center justify-center w-full p-4 sm:p-5 rounded-full 
                             bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/30
                             backdrop-blur-md transition-all duration-300 ease-out
                             hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(168,85,247,0.25)]"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <span className="font-semibold text-white tracking-wide group-hover:text-purple-200 transition-colors">
                    {link.title || link.url}
                  </span>

                  {/* Optional: Right Arrow or Icon on Hover */}
                  <div className="absolute right-6 opacity-0 transform translate-x-[-10px] group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400">
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </div>
                </a>
              ))
            ) : (
              <div className="text-center py-12 px-6 rounded-3xl bg-white/5 border border-white/5 border-dashed">
                <p className="text-slate-500">Pengguna ini belum menambahkan link apa pun.</p>
              </div>
            )}
          </main>

          {/* Footer */}
          <footer className="mt-16 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors text-sm font-medium text-slate-400 hover:text-white"
            >
              <span>Powered by</span>
              <span className="font-bold text-white tracking-wide">LinkHub.</span>
            </Link>
          </footer>

        </div>
      </div>
    </div>
  );
}
