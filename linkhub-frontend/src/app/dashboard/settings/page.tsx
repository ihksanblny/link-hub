'use client';

import { useAuth } from "@/context/AuthContext";
import { Settings, Image, User as UserIcon } from "lucide-react";
// Import komponen formulir yang sudah kita buat/modifikasi
import ProfileDetailsForm from "@/components/settings/ProfileDetailsForm";
import PasswordUpdateForm from "@/components/settings/PasswordUpdateForm";
import AvatarUpdateForm from "@/components/settings/AvatarUpdateForm";

export default function SettingsPage() {
    // Ambil data user, token, dan fungsi refreshUser dari Context
    const { user, token, refreshUser, isAuthLoading } = useAuth(); 
    
    // Asumsi: refreshUser ada di AuthContext untuk update state global setelah PATCH
    // Jika refreshUser tidak ada, Anda bisa memanggil fetchLinks dari dashboard/page.tsx jika diperlukan.
    const handleProfileUpdate = () => {
        // Logika untuk me-refresh data user di Context (jika ada refreshUser)
        if (typeof refreshUser === 'function') {
             refreshUser();
        }
        // Opsional: Tampilkan notifikasi sukses global jika ada sistem notifikasi
    };

    // ------------------------------------------------------------------
    // --- PENANGANAN LOADING DAN OTENTIKASI ---
    // ------------------------------------------------------------------
    if (isAuthLoading || !user) {
        // Ini akan sangat cepat, karena layout utama sudah menangani loading utama.
        // Tampilkan placeholder jika user masih null, meskipun seharusnya tidak terjadi 
        // karena layout sudah memblokirnya.
        return (
            <div className="flex justify-center items-center h-[500px]">
                <p className="text-gray-400">Memuat pengaturan...</p>
            </div>
        );
    }
    
    // Ambil ID pengguna dan token dengan aman
    const userId = user.id;
    const accessToken = token;

    return (
        <div className="space-y-10">
            <h1 className="text-4xl font-extrabold text-white flex items-center space-x-3">
                <Settings className="w-8 h-8 text-purple-400" />
                <span>Pengaturan Akun</span>
            </h1>

            {/* Bagian 1: Detail Profil (Username dan Full Name) */}
            <ProfileDetailsForm 
                userId={userId} 
                token={accessToken} 
                onProfileUpdate={handleProfileUpdate} // Teruskan callback untuk refresh user
            />

            {/* Bagian 2: Password */}
            <PasswordUpdateForm 
                token={accessToken} 
            />

            {/* Bagian 3: Avatar */}
            <AvatarUpdateForm 
                userId={userId} 
                token={accessToken}
                onProfileUpdate={handleProfileUpdate} // Teruskan callback untuk refresh user 
            />
            
            {/* Bagian 4: Danger Zone */}
            <div className="p-6 bg-gray-900 rounded-xl border border-red-500/50">
                <h2 className="text-2xl font-bold text-red-400 mb-2">Zona Bahaya</h2>
                <p className="text-gray-400 mb-4">Menghapus akun Anda akan menghapus semua link dan data profil secara permanen.</p>
                <button className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white font-semibold transition-colors">
                    Hapus Akun Permanen
                </button>
            </div>
        </div>
    );
}