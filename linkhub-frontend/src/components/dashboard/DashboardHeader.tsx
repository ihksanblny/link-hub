// src/components/dashboard/DashboardHeader.tsx
'use client';

import { Link } from '@/types/index';
import { LogOut, Plus, LinkIcon } from 'lucide-react';
import { Menu } from 'lucide-react';
import { useSidebar } from '@/context/SidebarContext';

// Definisikan Props yang diperlukan
interface DashboardHeaderProps {
    userEmail: string | undefined; // Email pengguna
    onLogout: () => void; // Handler logout
    onAddLinkClick: () => void; // Handler buka modal Tambah Link
}

export default function DashboardHeader({ userEmail, onLogout, onAddLinkClick }: DashboardHeaderProps) {
    const { toggleSidebar } = useSidebar();
    return (
        <header className="sticky top-4 z-20 w-full mb-8">
            <div 
                // Header Kapsul: Tetap glassmorphism
                className="mx-auto h-16 rounded-full bg-black/50 backdrop-blur-md shadow-2xl shadow-black/50 
                           flex items-center justify-between px-6 border border-white/10"
            >
                <div className="flex items-center space-x-4">
                    {/* Tombol Hamburger/Menu di sisi kiri */}
                    <button 
                        onClick={toggleSidebar}
                        className="p-2 rounded-full text-white transition-colors hover:bg-gray-800/50 hidden lg:block" // Hanya tampil di desktop
                        title="Toggle Sidebar"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    
                    <LinkIcon className="h-6 w-6 text-green-400" /> 
                    <span className="font-extrabold text-xl tracking-tight text-white">Dashboard Analitik</span>
                </div>
                
                {/* 2. AREA AKSI & INFORMASI PENGGUNA */}
                <div className="flex items-center space-x-4">
                    
                    {/* Info Pengguna (Welcome, Email) */}
                    <div className="hidden sm:flex flex-col items-end text-sm">
                        <span className="text-gray-300">Welcome,</span>
                        <span className="font-semibold text-green-400">{userEmail || 'User LinkHub'}</span>
                    </div>
                    
                    {/* TOMBOL TAMBAH LINK (GLASSMORPHISM) */}
                    <button 
                        onClick={onAddLinkClick}
                        className="p-3 rounded-full transition-colors w-10 h-10 flex items-center justify-center 
                                   bg-white/10 backdrop-blur-sm text-purple-400 hover:bg-white/20 border border-purple-500/50"
                        title="Tambah Link Baru"
                    >
                        <Plus className="h-5 w-5" />
                    </button>
                    
                    {/* TOMBOL LOGOUT (GLASSMORPHISM) */}
                    <button
                        onClick={onLogout}
                        className="p-3 rounded-full transition-colors w-10 h-10 flex items-center justify-center 
                                   bg-white/10 backdrop-blur-sm text-red-400 hover:bg-white/20 border border-red-500/50"
                        title="Logout"
                    >
                        <LogOut className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </header>
    );
}