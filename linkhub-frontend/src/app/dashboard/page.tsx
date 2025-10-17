// src/app/dashboard/page.tsx
'use client';

import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import LinkList from '@/components/LinkList';
import EditLinkModal from '@/components/EditLinkModal';
import AddLinkModal from '@/components/AddLinkModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Eye, MousePointerClick, TrendingUp, TrendingDown, Search, BarChart2, LogOut } from 'lucide-react';
import type { Link } from '@/types';
import StatCard from '@/components/dashboard/StatCard';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { LinkIcon, Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const { user, token, logout } = useAuth();
  const router = useRouter();
  const [links, setLinks] = useState<Link[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<Link | null>(null);

  // Data Statistik Dribbble (Diperkaya dengan delta)
  const statsData = [
    { title: "Total Views", value: "2,389", delta: "+15.2%", icon: <Eye className="h-4 w-4" /> },
    { title: "Total Clicks", value: "1,745", delta: "+8.9%", icon: <MousePointerClick className="h-4 w-4" /> },
    { title: "CTR", value: "73.2%", delta: "-2.1%", icon: <TrendingDown className="h-4 w-4" /> }, // Menggunakan TrendingDown untuk negatif
    { title: "Bounce Rate", value: "12%", delta: "+0.5%", icon: <BarChart2 className="h-4 w-4" /> }, // Tambah stat keempat
  ];

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
      <main className="flex min-h-screen items-center justify-center bg-gray-950">
        <div className="flex flex-col items-center space-y-4 p-8 bg-gray-900/80 rounded-xl shadow-2xl border border-white/10 backdrop-blur-md">
          
          {/* Logo LinkHub/Branding */}
          <div className="flex items-center space-x-2 text-white">
            <LinkIcon className="w-8 h-8 text-green-400 animate-pulse" />
            <span className="text-xl font-bold">LinkHub.</span>
          </div>

          {/* Spinner dan Pesan */}
          <div className="flex items-center space-x-2 text-gray-400">
            <Loader2 className="w-5 h-5 animate-spin text-purple-400" />
            <p className="text-sm">Memuat Dashboard...</p>
          </div>
          
        </div>
      </main>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8">
      
      {/* Header Utama (Menggunakan nama DashboardHeader dari struktur file Anda) */}
      {/* Asumsi: DashboardHeader menangani sapaan user/logout */}
      <DashboardHeader
            userEmail={user.email}
            onLogout={handleLogout}
            onAddLinkClick={() => setIsAddModalOpen(true)} // Teruskan handler modal
        />
      
      {/* 1. KARTU STATISTIK (Grid ala Dribbble 4 kolom) */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat, index) => (
          // StatCard kini menerima 'delta' untuk tampilan modern
          <StatCard 
            key={index} 
            title={stat.title} 
            value={stat.value} 
            icon={stat.icon} 
            delta={stat.delta} 
          />
        ))}
      </div>
      
      {/* 2. BAGIAN GRAFIK (Visualisasi Data Kunci Dribbble) */}
      <div className="p-6 bg-white/5 backdrop-blur-md rounded-xl shadow-xl border border-white/10 h-96">
        <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
            <BarChart2 className="h-5 w-5 text-blue-400" /> Performa Link Harian
        </h2>
        <p className="text-gray-500 pt-16 text-center">
            {/* Placeholder untuk grafik Chart JS / Recharts */}
            Area ini akan menampilkan grafik Views dan Clicks untuk tampilan dashboard profesional.
        </p>
      </div>

      {/* 3. Pencarian dan Daftar Link */}
      <div className="space-y-4 pt-4">
          <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Cari link..." 
                className="pl-9 bg-gray-800/50 backdrop-blur-sm border border-gray-700 text-white rounded-xl p-4 focus:ring-purple-500" 
              />
          </div>
          <LinkList
            links={links}
            isLoading={isLoading}
            onEdit={handleOpenEditModal}
            onDelete={handleDelete}
          />
      </div>

      {/* Modal-modal (tidak terlihat sampai dipicu) */}
      {isAddModalOpen && ( <AddLinkModal onClose={() => setIsAddModalOpen(false)} onLinkAdded={() => { fetchLinks(); setIsAddModalOpen(false); }} /> )}
      {isEditModalOpen && ( <EditLinkModal link={editingLink} onClose={handleCloseEditModal} onLinkUpdated={() => { setIsEditModalOpen(false); fetchLinks(); }} /> )}
    </div>
  );
}