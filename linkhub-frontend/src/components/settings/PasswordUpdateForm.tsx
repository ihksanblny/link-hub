// src/components/settings/PasswordUpdateForm.tsx
'use client';

import { useState } from 'react';
import { KeyRound, Loader2, CheckCircle } from 'lucide-react';

export default function PasswordUpdateForm({ token }: { token: string | null }) {
    // State sudah dideklarasikan dengan benar
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    
    // Asumsi endpoint sudah benar: http://localhost:8080/user/password
    const ENDPOINT = `${apiUrl}/user/password`; 

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Cek Token terlebih dahulu
        if (!token || !apiUrl) {
             setErrorMessage("Token atau URL API tidak tersedia.");
             return;
        }

        // --- PENTING: Validasi Frontend Kritis ---
        if (oldPassword.trim() === '' || newPassword.trim() === '') {
            setErrorMessage("Password lama dan baru wajib diisi.");
            return; 
        }
        
        // Asumsi Anda tidak memerlukan konfirmasi password,
        // jika perlu, tambahkan state confirmPassword di atas.

        if (newPassword.length < 6) {
            setErrorMessage("Password baru minimal 6 karakter.");
            return;
        }

        setIsLoading(true);
        setIsSuccess(false);
        setErrorMessage('');
        
        try {
            const response = await fetch(ENDPOINT, { 
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                // 🟢 PERBAIKAN KRITIS: Menggunakan state yang sudah dideklarasikan
                // dan memastikan KEY JSON sesuai dengan backend: old_password & new_password
                body: JSON.stringify({ 
                    old_password: oldPassword, // Menggunakan state oldPassword
                    new_password: newPassword, // Menggunakan state newPassword
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                // Tangkap error 400 dari backend (misal: "Password lama salah")
                throw new Error(data.message || `Gagal mengubah password (Status: ${response.status}).`);
            }

            // Reset field dan tampilkan sukses
            setOldPassword('');
            setNewPassword('');
            setIsSuccess(true);
            setTimeout(() => setIsSuccess(false), 3000);

        } catch (error: any) {
            console.error('Change password failed:', error.message);
            setErrorMessage(error.message || 'Terjadi kesalahan jaringan.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6 bg-gray-900 rounded-xl shadow-xl border border-white/10">
            <div className="flex items-center space-x-3 mb-5">
                <KeyRound className="w-5 h-5 text-blue-400" />
                <h2 className="text-xl font-bold text-white">Ubah Password</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
                {/* Field Password Lama */}
                <div>
                    <label htmlFor="old-pass" className="block text-sm font-medium text-gray-400 mb-2">Password Lama</label>
                    <input 
                        type="password" 
                        id="old-pass" 
                        value={oldPassword} 
                        onChange={(e) => setOldPassword(e.target.value)}
                        className="w-full p-3 rounded-xl bg-black/30 text-white shadow-inner focus:ring-purple-500 transition-shadow" 
                        required 
                    />
                </div>
                
                {/* Field Password Baru */}
                <div>
                    <label htmlFor="new-pass" className="block text-sm font-medium text-gray-400 mb-2">Password Baru</label>
                    <input 
                        type="password" 
                        id="new-pass" 
                        value={newPassword} 
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full p-3 rounded-xl bg-black/30 text-white shadow-inner focus:ring-purple-500 transition-shadow" 
                        required 
                    />
                </div>

                {errorMessage && <p className="text-sm text-red-400">{errorMessage}</p>}

                {/* Tombol Simpan */}
                <div className="flex justify-end pt-2">
                    <button type="submit" disabled={isLoading || isSuccess}
                        className={`px-6 py-2 rounded-lg text-white font-semibold transition-colors flex items-center space-x-2 ${
                            isSuccess ? 'bg-green-600' : 'bg-purple-600 hover:bg-purple-700'
                        }`}>
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : isSuccess ? <><CheckCircle className="w-4 h-4" /> <span>Berhasil!</span></> : <span>Ubah Password</span>}
                    </button>
                </div>
            </form>
        </div>
    );
}