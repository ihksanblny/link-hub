// src/app/dashboard/settings/page.tsx
'use client';

import { useState } from 'react'; // Impor useState untuk state button delete
import { useAuth } from "@/context/AuthContext";
import { useRouter } from 'next/navigation'; // Impor useRouter
import { Settings, Image, User as UserIcon, Loader2 } from "lucide-react";
// Import komponen formulir yang sudah kita buat/modifikasi
import ProfileDetailsForm from "@/components/settings/ProfileDetailsForm";
import PasswordUpdateForm from "@/components/settings/PasswordUpdateForm";
import AvatarUpdateForm from "@/components/settings/AvatarUpdateForm";

export default function SettingsPage() {
    const { user, token, logout, refreshUser, isAuthLoading } = useAuth(); 
    const router = useRouter(); // Inisialisasi router
    const [isDeleting, setIsDeleting] = useState(false); // State untuk button delete
    
    // Asumsi endpoint DELETE /user
    const API_ENDPOINT = `${process.env.NEXT_PUBLIC_API_URL}/user`;

    const handleProfileUpdate = () => {
        // Logika untuk me-refresh data user di Context (jika ada refreshUser)
        if (typeof refreshUser === 'function') {
            refreshUser();
        }
        // Opsional: Tampilkan notifikasi sukses global jika ada sistem notifikasi
    };

    // 🟢 FUNGSI BARU: Logika Hapus Akun Permanen
    const handleDeleteAccount = async () => {
        if (!token || !API_ENDPOINT) return;
        
        const confirmation = window.confirm("PERINGATAN KERAS: Anda yakin ingin menghapus akun Anda secara permanen? Semua link dan data akan HILANG!");
        if (!confirmation) return;
        
        setIsDeleting(true);

        try {
            // Panggil API DELETE /user
            const response = await fetch(API_ENDPOINT, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Gagal menghapus akun.");
            }

            // Sukses: Logout dan alihkan ke halaman login
            alert("Akun berhasil dihapus. Sampai jumpa!");
            logout(); // Hapus token/user state di frontend
            router.replace('/login'); // Redirect ke halaman login

        } catch (error: any) {
            alert(`Gagal menghapus akun: ${error.message}`);
            console.error("Delete account error:", error);
        } finally {
            setIsDeleting(false);
        }
    };
    
    // ------------------------------------------------------------------
    // --- PENANGANAN LOADING DAN OTENTIKASI ---
    // ------------------------------------------------------------------
    if (isAuthLoading || !user) {
        return (
            <div className="flex justify-center items-center h-[500px]">
                <p className="text-gray-400">Memuat pengaturan...</p>
            </div>
        );
    }
    
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
                
                {/* 🟢 Implementasi Tombol Delete */}
                <button 
                    onClick={handleDeleteAccount} // Panggil handler
                    disabled={isDeleting} // Nonaktifkan saat loading
                    className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white font-semibold transition-colors flex items-center space-x-2 disabled:opacity-50"
                >
                    {isDeleting ? <><Loader2 className="w-4 h-4 animate-spin" /> <span>Menghapus...</span></> : <span>Hapus Akun Permanen</span>}
                </button>
            </div>
        </div>
    );
}