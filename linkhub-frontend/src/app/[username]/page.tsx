// src/app/[username]/page.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
      <div className="flex flex-col items-center justify-center min-h-screen text-white bg-background">
        <h1 className="text-4xl font-bold">404 - Profil Tidak Ditemukan</h1>
        <p className="mt-4 text-lg text-muted-foreground">Profil yang Anda cari tidak ada.</p>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen w-full bg-cover bg-center bg-fixed text-foreground"
      style={{ backgroundImage: "url('/mesh-gradient.jpg')" }}
    >
      <div className="flex flex-col items-center min-h-screen w-full bg-black/50 pt-16 sm:pt-20">
        <div className="w-full max-w-md px-4">
          
          <header className="text-center space-y-4 mb-8">
            <Avatar className="w-24 h-24 mx-auto border-4 border-white/20 shadow-lg">
              <AvatarImage src={`https://avatar.vercel.sh/${profileData.username}.png`} alt={profileData.username} />
              <AvatarFallback>{profileData.username.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">{profileData.full_name || `@${profileData.username}`}</h1>
              <p className="text-muted-foreground">Selamat datang di halaman link saya!</p>
            </div>
          </header>

          <main className="space-y-4">
            {profileData.links.length > 0 ? (
              profileData.links.map((link) => (
                <a
                  key={link.id}
                  // 2. PERBAIKI HREF: Arahkan ke endpoint redirect di backend
                  href={`${apiUrl}/${link.short_code}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-black/20 backdrop-blur-lg border border-white/10 p-4 rounded-lg font-semibold text-center transition-all duration-200 hover:bg-white/10 hover:scale-105"
                >
                  {link.title || link.url}
                </a>
              ))
            ) : (
              <div className="text-center text-muted-foreground bg-black/20 backdrop-blur-lg border border-white/10 p-8 rounded-lg">
                <p>Pengguna ini belum menambahkan link apa pun.</p>
              </div>
            )}
          </main>
          
          <footer className="text-center mt-12">
            <Link href="/" className="font-bold text-xl tracking-wider text-white/50 hover:text-white/80 transition-colors">
              LinkHub.
            </Link>
          </footer>
        </div>
      </div>
    </div>
  );
}