'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Link {
  id : number;
  title : string;
  url : string;
  created_at : string;
}

export default function DashboardPage() {
  const { user, token, logout } = useAuth();
  const router = useRouter();

  // State untuk menyimpan daftar link
  const [links, setlinks] = useState<Link[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(()=> {
    if (!token) {
      router.push('/login');
      return;
    }

    // Fungsi untuk mengambil data link dari Backend
    const fetchLinks = async () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      try {
        const response = await fetch (`${apiUrl}/links`, {
          headers : {
            'Authorization' : `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch links');
      }
      
        const data = await response.json();
        setlinks(data.data); // Simpan data link ke state
      } catch (error) {
      console.error('Error fetching links:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  fetchLinks();
  }, [token, router]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!user) {
    return <main className="flex min-h-screen items-center justify-center"><p>Loading...</p></main>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-8 md:p-24">
      <div className="w-full max-w-4xl">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-400">Selamat datang, {user.email}!</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg"
          >
            Logout
          </button>
        </header>

        {/* Tampilkan daftar link */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Link Anda</h2>
          {isLoading ? (
            <p>Memuat data link...</p>
          ) : links.length > 0 ? (
            <ul className="space-y-4">
              {links.map((link) => (
                <li key={link.id} className="bg-gray-700 p-4 rounded-lg flex justify-between items-center">
                  <div>
                    <p className="font-bold">{link.title || 'Tanpa Judul'}</p>
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 text-sm break-all">
                      {link.url}
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">Anda belum memiliki link. Silakan buat satu!</p>
          )}
        </div>
      </div>
    </main>
  );
}