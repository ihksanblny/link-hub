// src/components/EditLinkModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

// Definisikan tipe data Link
interface Link {
  id: number;
  title: string | null;
  url: string;
}

// Definisikan props yang akan diterima komponen ini
interface EditLinkModalProps {
  link: Link | null;
  onClose: () => void;
  onLinkUpdated: () => void;
}

export default function EditLinkModal({ link, onClose, onLinkUpdated }: EditLinkModalProps) {
  if (!link) return null;

  const [title, setTitle] = useState(link.title || '');
  const [url, setUrl] = useState(link.url);
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuth();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    try {
      const response = await fetch(`${apiUrl}/links/${link.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ title, url }),
      });

      if (!response.ok) {
        throw new Error('Gagal memperbarui link');
      }

      onLinkUpdated(); // Beritahu induk bahwa update berhasil
      onClose(); // Tutup modal

    } catch (error) {
      console.error(error);
      alert('Terjadi kesalahan saat memperbarui link.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Latar belakang gelap semi-transparan
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Edit Link</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="edit-title" className="block mb-2 text-sm font-medium">Judul</label>
            <input
              type="text"
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg block w-full p-2.5"
            />
          </div>
          <div>
            <label htmlFor="edit-url" className="block mb-2 text-sm font-medium">URL</label>
            <input
              type="url"
              id="edit-url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg block w-full p-2.5"
            />
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg disabled:bg-gray-500"
            >
              {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}