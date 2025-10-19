// src/app/dashboard/page.tsx
'use client';

import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import LinkList from '@/components/LinkList';
import EditLinkModal from '@/components/EditLinkModal';
import AddLinkModal from '@/components/AddLinkModal';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import LivePreview from '@/components/dashboard/LivePreview'; // <-- Import komponen baru
import type { Link } from '@/types';
import StatCard from '@/components/dashboard/StatCard'; // <-- IMPORT BARU
import { Eye, MousePointerClick, TrendingUp } from 'lucide-react'; // <-- IMPORT IKON BARU

export default function DashboardPage() {
  const { user, token, logout } = useAuth();
  const router = useRouter();
  const [links, setLinks] = useState<Link[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<Link | null>(null);

  const fetchLinks = useCallback(async () => {
    // ... (Logika fetchLinks)
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

  const totalClicks = links.reduce((sum, link)=> sum + link.clicks, 0);

  useEffect(() => {
    if (!token) {
      router.push('/login');
    } else {
      fetchLinks();
    }
  }, [token, router, fetchLinks]);

  const handleDelete = async (linkId: number) => {
    if (!confirm('Are you sure you want to delete this link?')) return;
    // ... (Logika delete)
    if (!token) return;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    try {
      const response = await fetch(`${apiUrl}/links/${linkId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to delete link.');
      fetchLinks(); 
    } catch (error) {
      console.error(error);
      alert('An error occurred while deleting the link.');
    }
  };

  const handleOpenEditModal = (link: Link) => {
    setEditingLink(link);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingLink(null);
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!user) {
    // --- TAMPILAN LOADING MODERN ---
    return (
      // Gunakan min-h-screen dan bg-gray-950 dari layout
      <main className="flex min-h-screen items-center justify-center bg-gray-950">
        <p className="text-white text-xl font-medium">Loading...</p> 
      </main>
    );
  }

  return (
    <>
    <div className="flex min-h-screen w-full flex-col">
      <DashboardHeader 
        onAddClick={() => setIsAddModalOpen(true)}
        onLogout={handleLogout}
      />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        
        {/* --- 2. TAMBAHKAN BAGIAN KARTU STATISTIK DI SINI --- */}
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard title="Total Views" value="-" icon={<Eye className="h-4 w-4 text-muted-foreground" />} />
          <StatCard title="Total Clicks" value={totalClicks.toLocaleString('id-ID')} icon={<MousePointerClick className="h-4 w-4 text-muted-foreground" />} />
          <StatCard title="Total Links" value={links.length.toString()} icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />} />
        </div>
        {/* ---------------------------------------------------- */}
        
        <LinkList
          links={links}
          isLoading={isLoading}
          onEdit={handleOpenEditModal}
          onDelete={handleDelete}
        />
      </main>

        {/* Kolom Kanan: Live Preview (tersembunyi di layar kecil) */}
        <div className="hidden lg:block">
          <LivePreview links={links} />
        </div>

      </div>

      {/* Modal-modal ini tidak terlihat sampai dipicu */}
      {isAddModalOpen && (
        <AddLinkModal
          onClose={() => setIsAddModalOpen(false)}
          onLinkAdded={() => {
            fetchLinks();
            setIsAddModalOpen(false);
          }}
        />
      )}
      {isEditModalOpen && (
        <EditLinkModal
          link={editingLink}
          onClose={handleCloseEditModal}
          onLinkUpdated={() => {
            handleCloseEditModal();
            fetchLinks();
          }}
        />
      )}
    </>
  );
}