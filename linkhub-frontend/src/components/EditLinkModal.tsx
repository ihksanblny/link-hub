// src/components/EditLinkModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Link } from '@/types';

interface EditLinkModalProps {
  link: Link | null;
  onClose: () => void;
  onLinkUpdated: () => void;
}

export default function EditLinkModal({ link, onClose, onLinkUpdated }: EditLinkModalProps) {
  // Jangan render apa-apa jika tidak ada link yang diedit
  if (!link) return null;

  // State untuk menyimpan perubahan pada input form
  const [title, setTitle] = useState(link.title || '');
  const [url, setUrl] = useState(link.url);
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuth();

  // Fungsi untuk mengirim perubahan ke backend
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

      // Beritahu induk (DashboardPage) bahwa update berhasil
      onLinkUpdated();

    } catch (error) {
      console.error(error);
      alert('Terjadi kesalahan saat memperbarui link.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Latar belakang gelap semi-transparan untuk seluruh layar
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4"
      onClick={onClose} // Menutup modal saat klik di luar area
    >
      <div 
        className="w-full max-w-md"
        onClick={(e) => e.stopPropagation()} // Mencegah klik di dalam modal ikut menutup
      >
        <Card className="bg-card/80 backdrop-blur-xl border-white/10 shadow-2xl">
          <CardHeader>
            <CardTitle>Edit Link</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Judul</Label>
                <Input id="edit-title" value={title} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-url">URL</Label>
                <Input id="edit-url" type="url" value={url} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUrl(e.target.value)} required />
              </div>
              <div className="flex justify-end gap-4 pt-4">
                <Button type="button" variant="ghost" onClick={onClose}>
                  Batal
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}