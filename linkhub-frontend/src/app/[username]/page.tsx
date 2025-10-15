// src/app/[username]/page.tsx

// 1. Definisikan tipe data yang kita harapkan dari API
interface ProfileData {
  full_name: string | null;
  username: string;
  links: {
    id: number;
    title: string | null;
    url: string;
  }[];
}

// 2. Buat fungsi untuk mengambil data dari backend
async function getProfileData(username: string): Promise<ProfileData | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  try {
    // Kita gunakan { cache: 'no-store' } agar data selalu baru
    const res = await fetch(`${apiUrl}/profile/${username}`, { cache: 'no-store' });
    
    // Jika profil tidak ditemukan (404), kembalikan null
    if (!res.ok) {
      return null;
    }
    
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Failed to fetch profile data:", error);
    return null;
  }
}

// 3. Buat komponen halaman utama
// Perhatikan bagaimana 'params' secara otomatis diberikan oleh Next.js
export default async function ProfilePage({ params }: { params: { username: string } }) {
  // Panggil fungsi untuk mengambil data berdasarkan username dari URL
  const profileData = await getProfileData(params.username);

  // 4. Tampilan jika profil tidak ditemukan
  if (!profileData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-white bg-gray-900">
        <h1 className="text-4xl font-bold">404 - Profil Tidak Ditemukan</h1>
        <p className="mt-4 text-lg">Profil yang Anda cari tidak ada atau URL salah.</p>
      </div>
    );
  }

  // 5. Tampilan jika profil BERHASIL ditemukan
  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white pt-16 sm:pt-20">
      <div className="w-full max-w-3xl px-4">
        <header className="text-center mb-10">
          {/* Nanti kita bisa tambahkan foto profil di sini */}
          <h1 className="text-3xl font-bold">{profileData.full_name || `@${profileData.username}`}</h1>
        </header>

        <main className="space-y-4">
          {profileData.links.length > 0 ? (
            profileData.links.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-gray-800 hover:bg-gray-700 p-4 rounded-lg transition-transform transform hover:scale-105 duration-200 font-semibold text-center"
              >
                {link.title || link.url}
              </a>
            ))
          ) : (
            <p className="text-center text-gray-400">Pengguna ini belum menambahkan link.</p>
          )}
        </main>
      </div>
    </div>
  );
}