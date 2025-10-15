// src/app/dashboard/page.tsx
'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import AddLinkForm from '@/components/AddLinkForm';
import EditLinkModal from '@/components/EditLinkModal';
import UpdateProfileForm from '@/components/UpdateProfileForm';
import { Button } from '@/components/ui/Button';
import LinkList from '@/components/LinkList'; // <-- Import komponen list baru kita

// (interface Link tetap di sini atau bisa dipindah ke file tipe terpisah)
interface Link {
  id: number;
  title: string | null;
  url: string;
  created_at: string;
}

export default function DashboardPage() {
  const { user, token, logout } = useAuth();
  const router = useRouter();
  const [links, setLinks] = useState<Link[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<Link | null>(null);

  // Gunakan useCallback agar fungsi tidak dibuat ulang di setiap render
  const fetchLinks = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    try {
      const response = await fetch(`${apiUrl}/links`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch links');
      const data = await response.json();
      setLinks(data.data);
    } catch (error) {
      console.error('Error fetching links:', error);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!token) {
      router.push('/login');
    } else {
      fetchLinks();
    }
  }, [token, router, fetchLinks]);

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
      fetchLinks(); 
    } catch (error) {
      console.error(error);
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

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!user) {
    return <main className="flex min-h-screen items-center justify-center bg-background"><p className="text-text">Loading...</p></main>;
  }

  // LIHAT BETAPA BERSIHNYA BAGIAN RETURN INI SEKARANG
  return (
    <main className="bg-background text-text flex min-h-screen flex-col items-center p-8 md:p-24">
      <div className="w-full max-w-4xl space-y-8">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-text-secondary">Selamat datang, {user.email}!</p>
          </div>
          <Button onClick={handleLogout} variant="destructive">
            Logout
          </Button>
        </header>

        <UpdateProfileForm />
        <AddLinkForm onLinkAdded={fetchLinks} />
        <LinkList
          links={links}
          isLoading={isLoading}
          onEdit={handleOpenEditModal}
          onDelete={handleDelete}
        />
      </div>

      {isModalOpen && (
        <EditLinkModal
          link={editingLink}
          onClose={handleCloseEditModal}
          onLinkUpdated={() => {
            handleCloseEditModal();
            fetchLinks();
          }}
        />
      )}
    </main>
  );
}