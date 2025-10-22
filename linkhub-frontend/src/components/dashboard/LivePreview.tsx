// src/components/dashboard/LivePreview.tsx
'use client';

import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Link } from "@/types";

interface LivePreviewProps {
  links: Link[]; // Komponen ini menerima daftar link dari halaman utama
}

export default function LivePreview({ links }: LivePreviewProps) {
  const { user } = useAuth();
  
  return (
    // 'sticky top-24' akan membuat komponen ini "mengambang" saat Anda scroll daftar link
    <div className="sticky top-24"> 
      <h3 className="font-bold mb-4 text-lg">Live Preview</h3>
      <div className="relative mx-auto border-gray-800 bg-gray-800 border-[8px] rounded-[2.5rem] h-[550px] w-[270px] shadow-xl">
        <div className="w-[130px] h-[18px] bg-gray-800 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute"></div>
        <div className="h-[40px] w-[3px] bg-gray-800 absolute -left-2 top-[60px] rounded-l-lg"></div>
        <div className="h-[40px] w-[3px] bg-gray-800 absolute -left-2 top-[120px] rounded-l-lg"></div>
        <div className="h-[50px] w-[3px] bg-gray-800 absolute -right-2 top-[100px] rounded-r-lg"></div>
        <div className="rounded-[2rem] overflow-y-auto h-full bg-background p-2">
          {/* Konten di dalam layar ponsel */}
          <div className="text-center space-y-3 pt-6">
             <Avatar className="w-16 h-16 mx-auto border-2 border-white/20">
              <AvatarImage 
                    src={
                        user?.avatar_url 
                            // 🟢 SOLUSI CACHE BUSTING: Tambahkan ?t=timestamp saat ini
                            // Timestamp akan berubah setiap kali komponen di-render ulang
                            // (seperti setelah login/logout), memaksa browser memuat ulang gambar.
                            ? `${user.avatar_url}?t=${Date.now()}` 
                            // Fallback Vercel/Gravatar (jika user?.avatar_url null)
                            : (user?.email ? `https://avatar.vercel.sh/${user.email}.png` : undefined)
                    } 
                    alt={user?.email || "User Avatar"} 
                />
                {/* 🟢 SOLUSI UNDEFINED FALLBACK: Gunakan default 'US' */}
                <AvatarFallback>{user?.email?.substring(0, 2).toUpperCase() || 'US'}</AvatarFallback>
            </Avatar>
            <p className="font-semibold text-foreground text-sm">@{user?.email?.split('@')[0]}</p>
            
            <div className="pt-4 space-y-2 px-2">
              {links.length > 0 ? (
                links.map(link => (
                  <div key={link.id} className="bg-primary text-primary-foreground text-sm font-semibold p-3 rounded-lg w-full">
                    {link.title || 'Link Title'}
                  </div>
                ))
              ) : (
                // Tampilan 'empty state' di preview
                <>
                  <div className="bg-card h-12 rounded-lg w-full"></div>
                  <div className="bg-card h-12 rounded-lg w-full"></div>
                  <div className="bg-card h-12 rounded-lg w-full"></div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}