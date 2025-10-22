// src/app/dashboard/page.tsx
'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import LinkList from '@/components/LinkList';
import EditLinkModal from '@/components/EditLinkModal';
import AddLinkModal from '@/components/AddLinkModal';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import LivePreview from '@/components/dashboard/LivePreview';
import type { Link } from '@/types';
import StatCard from '@/components/dashboard/StatCard';
import { Eye, MousePointerClick, TrendingUp, Loader2 } from 'lucide-react';

export default function DashboardPage() {
    const { user, token, logout, isAuthLoading} = useAuth();
    const router = useRouter();
    const [links, setLinks] = useState<Link[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingLink, setEditingLink] = useState<Link | null>(null);

    const fetchLinks = useCallback(async () => {
        if (!token) return;
        setIsLoading(true);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        
        try {
            const response = await fetch(`${apiUrl}/links`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.status === 401) {
                logout();
                return;
            }

            if (!response.ok) throw new Error("Gagal mengambil link.");

            const data = await response.json();
            setLinks(data.data || []);
        } catch (error) {
            console.error("Fetch links error:", error);
            setLinks([]);
        } finally {
            setIsLoading(false);
        }
    }, [token, logout]); 

    // --- FETCH DATA HANYA JIKA AUTHENTIKASI BERHASIL ---
    useEffect(() => {
        if (token && user) {
            fetchLinks();
        }
    }, [token, user, fetchLinks]);
    
    useEffect(() => {
        if (!isAuthLoading && !user) {
            console.log("DASHBOARD REDIRECT: Auth finished, user is null. Redirecting to /login.");
            router.replace('/login'); 
        }
    }, [isAuthLoading, user, router]);

    // Hitung totalClicks secara efisien
    const totalClicks = useMemo(() => {
        return links.reduce((sum, link) => sum + (link.clicks || 0), 0);
    }, [links]);

    // --- Handler functions ---

    const handleDelete = useCallback(async (linkId: number) => {
        if (!token) {
            console.error("Token tidak tersedia untuk menghapus link.");
            return;
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        
        // Konfirmasi sebelum menghapus
        const isConfirmed = window.confirm("Apakah Anda yakin ingin menghapus link ini secara permanen?");
        if (!isConfirmed) return;

        try {
            // Panggil API DELETE ke endpoint /links/:linkId
            const response = await fetch(`${apiUrl}/links/${linkId}`, {
                method: 'DELETE', 
                headers: { 
                    'Authorization': `Bearer ${token}` 
                },
            });

            if (response.status === 401) {
                logout();
                return;
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Gagal menghapus link.");
            }

            // Setelah sukses, refresh daftar links
            console.log(`Link ID: ${linkId} berhasil dihapus.`);
            fetchLinks(); 

        } catch (error: any) {
            console.error("Delete link error:", error);
            alert(`Gagal menghapus link: ${error.message}`);
        }
    }, [token, fetchLinks, logout]); // Dependensi

    const handleOpenAddModal = () => setIsAddModalOpen(true);
    const handleOpenEditModal = (link: Link) => { setEditingLink(link); setIsEditModalOpen(true); };
    const handleCloseEditModal = () => { setEditingLink(null); setIsEditModalOpen(false); fetchLinks(); };
    // 🔴 Logika delete dihapus dan digantikan oleh fungsi handleDelete di atas.
    
    // --- KRUSIAL: LOGIC PENANGANAN LOADING DAN REDIRECT ---
    if (isAuthLoading) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-gray-950">
                <div className="flex flex-col items-center space-y-4 p-8 bg-gray-900/80 rounded-xl shadow-2xl border border-white/10 backdrop-blur-md">
                    <div className="flex items-center space-x-2 text-white">
                        <span className="text-xl font-bold">Dashboard.</span>
                    </div>

                    <div className="flex items-center space-x-2 text-gray-400">
                        <Loader2 className="w-5 h-5 animate-spin text-purple-400" />
                        <p className="text-sm">Loading...</p>
                    </div>
                </div>
            </main>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <>
        <div className="flex min-h-screen w-full flex-col">
            <DashboardHeader 
                onAddClick={handleOpenAddModal}
                onLogout={logout}
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
                    // 🟢 Meneruskan fungsi delete yang sudah lengkap
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