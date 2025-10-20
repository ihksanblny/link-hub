// src/components/settings/ProfileDetailsForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { User, CheckCircle, Loader2 } from 'lucide-react';

interface ProfileDetailsFormProps {
    userId: string | undefined;
    token: string | null;
    // Asumsi: onProfileUpdate adalah fungsi untuk me-refresh data user di AuthContext/Dashboard
    onProfileUpdate: () => void; 
}

export default function ProfileDetailsForm({ userId, token, onProfileUpdate }: ProfileDetailsFormProps) {
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    // 1. Fetch Data Profil Awal (Placeholder Logic untuk mendapatkan data awal)
    useEffect(() => {
        const fetchDetails = async () => {
            if (!userId || !token) return;
            // Endpoint GET yang benar untuk mendapatkan detail profil (asumsi /api/profile/me)
            try {
                const response = await fetch(`${apiUrl}/user/me`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();

                if (response.ok && data.data) {
                    setFullName(data.data.full_name || '');
                    setUsername(data.data.username || '');
                }
            } catch (error) {
                console.error("Failed to fetch initial profile details", error);
            }
        };
        fetchDetails();
    }, [userId, token, apiUrl]);


    // 2. Handler Submit (PATCH API CALL)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token || !userId) return;

        setIsLoading(true);
        setIsSuccess(false);
        setErrorMessage('');
        
        try {
            const response = await fetch(`${apiUrl}/user/details`, { // <--- ENDPOINT BACKEND BARU
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ full_name: fullName, username: username }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Gagal menyimpan profil.');
            }

            setIsSuccess(true);
            onProfileUpdate(); // Panggil refresh di dashboard/context
            setTimeout(() => setIsSuccess(false), 3000);

        } catch (error: any) {
            setErrorMessage(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6 bg-gray-900 rounded-xl shadow-xl border border-white/10">
            <div className="flex items-center space-x-3 mb-5">
                <User className="w-5 h-5 text-green-400" />
                <h2 className="text-xl font-bold text-white">Detail Profil Publik</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Field Full Name */}
                <div>
                    <label htmlFor="fullname" className="block text-sm font-medium text-gray-400 mb-2">Nama Lengkap</label>
                    <input type="text" id="fullname" value={fullName} onChange={(e) => setFullName(e.target.value)}
                        className="w-full p-3 rounded-xl bg-black/30 text-white shadow-inner focus:ring-purple-500 transition-shadow" />
                </div>
                
                {/* Field Username */}
                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-400 mb-2">Username Publik</label>
                    <div className="flex rounded-xl overflow-hidden shadow-inner border border-gray-700">
                        <span className="bg-gray-800 text-gray-400 p-3 text-sm flex items-center">linkhub.com/</span>
                        <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)}
                            className="w-full p-3 bg-black/30 text-white focus:ring-purple-500 transition-shadow" />
                    </div>
                </div>

                {errorMessage && <p className="text-sm text-red-400">{errorMessage}</p>}

                {/* Tombol Simpan */}
                <div className="flex justify-end pt-4">
                    <button type="submit" disabled={isLoading || isSuccess}
                        className={`px-6 py-2 rounded-lg text-white font-semibold transition-colors flex items-center space-x-2 ${
                            isSuccess ? 'bg-green-600' : 'bg-purple-600 hover:bg-purple-700'
                        }`}>
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : isSuccess ? <><CheckCircle className="w-4 h-4" /> <span>Tersimpan!</span></> : <span>Simpan Perubahan</span>}
                    </button>
                </div>
            </form>
        </div>
    );
}