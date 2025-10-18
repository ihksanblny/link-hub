// src/components/dashboard/DashboardHeader.tsx
'use client';

import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { LogOut, PlusCircle, Search } from 'lucide-react';
import Link from 'next/link';

// 1. Definisikan props yang akan diterima komponen ini
interface DashboardHeaderProps {
  onAddClick: () => void;
  onLogout: () => void;
}

// 2. Terima props tersebut di parameter fungsi
export default function DashboardHeader({ onAddClick, onLogout }: DashboardHeaderProps) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <Link href="/" className="font-bold text-xl tracking-wider mr-4">
        LinkHub.
      </Link>
      
      <div className="relative ml-auto flex-1 md:grow-0">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Cari..."
          className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
        />
      </div>

      {/* 3. Gunakan prop 'onAddClick' di sini */}
      <Button size="icon" variant="outline" className="rounded-full" onClick={onAddClick}>
        <PlusCircle className="h-5 w-5" />
        <span className="sr-only">Tambah Link Baru</span>
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="overflow-hidden rounded-full">
            <Avatar>
              <AvatarImage src={`https://avatar.vercel.sh/${user?.email}.png`} alt={user?.email} />
              <AvatarFallback>{user?.email?.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Pengaturan</DropdownMenuItem>
          <DropdownMenuSeparator />
          {/* 4. Gunakan prop 'onLogout' di sini */}
          <DropdownMenuItem onClick={onLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}