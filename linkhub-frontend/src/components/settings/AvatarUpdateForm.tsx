// src/components/settings/AvatarUpdateForm.tsx
'use client';

import { useState, useRef } from 'react';
import { Image, Upload, User, Loader2, CheckCircle } from 'lucide-react';

interface AvatarUpdateFormProps {
    userId: string | undefined;
    token: string | null;
    // Asumsi: onProfileUpdate adalah callback untuk refresh data user global
    onProfileUpdate: () => void; 
}

export default function AvatarUpdateForm({ userId, token, onProfileUpdate }: AvatarUpdateFormProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Fungsi untuk menampilkan preview dan menyimpan file
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            setErrorMessage('');
        } else {
            setSelectedFile(null);
            setPreviewUrl(null);
            setErrorMessage('Tolong pilih file gambar yang valid.');
        }
    };
    
    // Handler untuk Submit (Placeholder Upload Logic)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFile || !token || !userId) {
            setErrorMessage('Silakan pilih file gambar.');
            return;
        }

        setIsLoading(true);
        setIsSuccess(false);
        setErrorMessage('');

        // --- PLACEHOLDER API CALL (SIMULASI UPLOAD) ---
        try {
            console.log("Simulating file upload to Supabase Storage and database update...");
            await new Promise(resolve => setTimeout(resolve, 2500)); // Simulasikan latency 2.5s

            // *Logic Sesungguhnya* akan melibatkan FormData dan fetch ke:
            // 1. POST /api/storage/upload (untuk menyimpan file dan mendapatkan URL)
            // 2. PATCH /api/user/details (untuk menyimpan URL avatar di tabel profiles)
            
            // Logika simulasi berhasil
            setIsSuccess(true);
            onProfileUpdate(); // Panggil refresh global
            setTimeout(() => setIsSuccess(false), 3000);
            
        } catch (error) {
            setErrorMessage('Gagal mengunggah avatar. Coba lagi.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6 bg-gray-900 rounded-xl shadow-xl border border-white/10">
            <div className="flex items-center space-x-3 mb-5">
                <Image className="w-5 h-5 text-red-400" />
                <h2 className="text-xl font-bold text-white">Ubah Foto Profil (Avatar)</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center space-x-6">
                    {/* Preview Avatar */}
                    <div className="w-24 h-24 rounded-full bg-gray-800 border-2 border-purple-500 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {previewUrl ? (
                            <img src={previewUrl} alt="Avatar Preview" className="w-full h-full object-cover" />
                        ) : (
                            <User className="w-12 h-12 text-gray-500" />
                        )}
                    </div>

                    {/* Tombol Pilih File */}
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/png, image/jpeg, image/webp" />
                    
                    <button 
                        type="button" 
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-semibold transition-colors flex items-center space-x-2"
                        disabled={isLoading}
                    >
                        <Upload className="w-4 h-4" /> <span>Pilih Gambar</span>
                    </button>
                </div>
                
                {errorMessage && <p className="text-sm text-red-400">{errorMessage}</p>}
                
                {/* Tombol Simpan */}
                <div className="flex justify-end pt-2">
                    <button type="submit" disabled={isLoading || !selectedFile}
                        className={`px-6 py-2 rounded-lg text-white font-semibold transition-colors flex items-center space-x-2 ${
                            isSuccess ? 'bg-green-600' : 'bg-purple-600 hover:bg-purple-700'
                        }`}
                    >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : isSuccess ? <><CheckCircle className="w-4 h-4" /> <span>Tersimpan!</span></> : <span>Simpan Avatar</span>}
                    </button>
                </div>
            </form>
        </div>
    );
}