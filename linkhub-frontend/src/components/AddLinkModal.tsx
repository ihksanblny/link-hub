// src/components/AddLinkModal.tsx
'use client';

import AddLinkForm from "@/components/AddLinkForm";

interface AddLinkModalProps {
  onClose: () => void;
  onLinkAdded: () => void;
}

export default function AddLinkModal({ onClose, onLinkAdded }: AddLinkModalProps) {
  return (
    // Latar belakang gelap semi-transparan
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4"
      onClick={onClose} // Menutup modal saat klik di luar area
    >
      <div 
        className="w-full max-w-md"
        onClick={(e) => e.stopPropagation()} // Mencegah klik di dalam modal ikut menutup
      >
        {/* Kita panggil AddLinkForm di sini */}
        <AddLinkForm onLinkAdded={() => {
          onLinkAdded();
          onClose();
        }} />
      </div>
    </div>
  );
}