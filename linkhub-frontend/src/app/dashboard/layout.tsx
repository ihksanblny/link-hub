// src/app/dashboard/layout.tsx
'use client'; 

import Sidebar from "@/components/dashboard/Sidebar";
import { SidebarProvider, useSidebar } from '@/context/SidebarContext'; 

// Komponen utama layout
const LayoutContent = ({ children }: { children: React.ReactNode }) => {
    const { isSidebarOpen } = useSidebar();
    
    // Lebar sidebar saat terbuka (w-64) dan tertutup (w-20)
    const transition = 'transition-all duration-300 ease-in-out';
    // Margin ml-64 (256px) atau ml-20 (80px) untuk memberi ruang pada sidebar
    const mainMarginClass = isSidebarOpen ? 'ml-64' : 'ml-20'; 

    return (
        <div className="min-h-screen bg-[#111827] text-white flex">
            {/* Sidebar: Posisi fixed, tidak perlu margin di sini */}
            <Sidebar isCollapsed={!isSidebarOpen} onToggle={() => {}} />

            {/* Main Content: Margin menyesuaikan lebar sidebar */}
            <main className={`flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto ${transition} ${mainMarginClass}`}>
                {children}
            </main>
        </div>
    );
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider> 
            <LayoutContent children={children} />
        </SidebarProvider>
    );
}