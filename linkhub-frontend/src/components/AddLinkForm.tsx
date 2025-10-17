// src/components/AddLinkForm.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';

interface AddLinkFormProps {
  onLinkAdded: () => void;
}

export default function AddLinkForm({ onLinkAdded }: AddLinkFormProps) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuth();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!url || !token) return;

    setIsLoading(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    try {
      const response = await fetch(`${apiUrl}/links`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ title, url }),
      });
      if (!response.ok) throw new Error('Failed to add link');

      setTitle('');
      setUrl('');
      onLinkAdded();
    } catch (error) {
      console.error(error);
      alert('An error occurred while adding the link.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Gunakan Card dari Shadcn dengan style "glassmorphism"
    <Card className="bg-black/20 backdrop-blur-lg border border-white/10 shadow-lg">
      <CardHeader className="flex flex-row items-center gap-4">
        <PlusCircle className="w-8 h-8 text-primary flex-shrink-0" />
        <div>
          <CardTitle>Tambah Link Baru</CardTitle>
          <CardDescription>Masukkan detail link yang akan ditampilkan.</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Judul</Label>
            <Input
              id="title"
              value={title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
              placeholder="Contoh: Portfolio Saya"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              type="url"
              value={url}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUrl(e.target.value)}
              placeholder="https://..."
              required
            />
          </div>
          <Button type="submit" disabled={isLoading} className="w-full font-bold">
            {isLoading ? 'Menyimpan...' : 'Tambah Link'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}