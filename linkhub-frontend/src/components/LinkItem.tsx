// src/components/LinkItem.tsx
'use client';

import { Button } from "@/components/ui/Button"; // Import Button dari Shadcn

// Definisikan tipe data Link
interface Link {
  id: number;
  title: string | null;
  url: string;
  created_at: string;
}

// Definisikan props yang diterima komponen ini
interface LinkItemProps {
  link: Link;
  onEdit: (link: Link) => void; // Fungsi untuk membuka modal edit
  onDelete: (linkId: number) => void; // Fungsi untuk menghapus
}

export default function LinkItem({ link, onEdit, onDelete }: LinkItemProps) {
  return (
    <li className="bg-card p-4 rounded-lg flex justify-between items-center transition-colors hover:bg-gray-700">
      <div>
        <p className="font-bold text-text">{link.title || 'Tanpa Judul'}</p>
        <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-primary text-sm break-all">
          {link.url}
        </a>
      </div>
      <div className="flex gap-2">
        <Button 
          variant="secondary" // Gunakan variant dari Shadcn
          className="px-3 py-1 h-auto text-sm"
          onClick={() => onEdit(link)}
        >
          Edit
        </Button>
        <Button
          variant="destructive" // Gunakan variant dari Shadcn
          className="px-3 py-1 h-auto text-sm"
          onClick={() => onDelete(link.id)}
        >
          Hapus
        </Button>
      </div>
    </li>
  );
}