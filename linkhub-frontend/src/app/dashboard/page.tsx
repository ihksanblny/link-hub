'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AddLinkForm from '@/components/AddLinkForm';
import EditLinkModal from '@/components/EditLinkModal';

// FIX #1: Perbarui tipe data title agar bisa menerima null
interface Link {
  id: number;
  title: string | null; // <-- Diperbaiki
  url: string;
  created_at: string;
}

export default function DashboardPage() {
  const { user, token, logout } = useAuth();
  const router = useRouter();

  // FIX #2: Perbaiki typo dari setlinks menjadi setLinks
  const [links, setLinks] = useState<Link[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<Link | null>(null);

  // FIX #3: Pindahkan fetchLinks ke luar dari useEffect
  // Sekarang ia bisa diakses oleh useEffect DAN handleDelete
  const fetchLinks = async () => {
    if (!token) return;
    setIsLoading(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    try {
      const response = await fetch(`${apiUrl}/links`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch links');
      
      const data = await response.json();
      setLinks(data.data); // Gunakan setLinks yang benar
    } catch (error) {
      console.error('Error fetching links:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (linkId: number) => {
    if (!confirm('Apakah Anda yakin?')) return;
    if (!token) return;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    try {
      const response = await fetch(`${apiUrl}/links/${linkId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Gagal menghapus link.');

      // Sekarang handleDelete bisa memanggil fetchLinks tanpa error
      fetchLinks(); 
    } catch (error) {
        console.error(error); // Lebih baik console.error daripada alert
        alert('Terjadi kesalahan saat menghapus link.');
    }
  };

  const handleOpenEditModal = (link: Link) => {
    setEditingLink(link);
    setIsModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsModalOpen(false);
    setEditingLink(null);
  };
  
  useEffect(() => {
    if (!token) {
      router.push('/login');
    } else {
      fetchLinks(); // Cukup panggil fetchLinks di sini
    }
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

        <AddLinkForm onLinkAdded={fetchLinks} />

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
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleOpenEditModal(link)}
                      className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-medium rounded-md transition-colors">
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(link.id)}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md transition-colors"
                    >
                      Hapus
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">Anda belum memiliki link. Silakan buat satu!</p>
          )}
        </div>
      </div>
      {/* --- RENDER MODAL SECARA KONDISIONAL --- */}
      {isModalOpen && (
        <EditLinkModal
          link={editingLink}
          onClose={handleCloseEditModal}
          onLinkUpdated={() => {
            handleCloseEditModal();
            fetchLinks(); // Refresh daftar link setelah update
          }}
        />
      )}
      {/* -------------------------------------- */}
    </main>
  );
}