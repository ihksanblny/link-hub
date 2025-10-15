'use client';

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

//Definisikan Props
interface AddLinkFormProps {
    onLinkAdded: () => void;
}

export default function AddLinkForm ({onLinkAdded}: AddLinkFormProps) {
    //State untuk menyimpan nilai input
    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { token } = useAuth(); // Ambil token untuk otentikasi

    //Fungsi untuk menangani submit form
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!url || !title) return;

        setIsLoading(true);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        try {
            const response = await fetch (`${apiUrl}/links`, {
                method : 'POST',
                headers : {
                    'Content-Type' : 'application/json',
                    'Authorization' : `Bearer ${token}`
                },
                body : JSON.stringify({ title, url }),
            });

            if (!response.ok) {
                throw new Error('Failed to add link');
            }

            //Jika berhasil
            setTitle(''); //Kosongkan form
            setUrl('');
            onLinkAdded(); //Panggil fungsi dari induk untuk refresh daftar link
        }
        catch (error) {
            console.error(error);
            alert('Terjadi kesalahan saat menambahkan link.');
        }
        finally {
            setIsLoading(false);
        }
    };

    // 4. Tampilan JSX untuk form
    return (
        <div className="bg-gray-800 p-6 rounded-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">Tambah Link Baru</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
            <label htmlFor="title" className="block mb-2 text-sm font-medium">Judul</label>
            <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Portfolio Saya"
                className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-colors"
            />
            </div>
            <div>
            <label htmlFor="url" className="block mb-2 text-sm font-medium">URL</label>
            <input
                type="url"
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://..."
                required
                className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-colors"
            />
            </div>
            <button
            type="submit"
            disabled={isLoading}
            className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-colors duration-200 disabled:bg-gray-500"
            >
            {isLoading ? 'Menyimpan...' : 'Simpan Link'}
            </button>
        </form>
        </div>
    );
}