// src/app/dashboard/layout.tsx
'use client'; 

import Sidebar from "@/components/dashboard/Sidebar";
import { SidebarProvider, useSidebar } from '@/context/SidebarContext'; 
import { useAuth } from '@/context/AuthContext'; 

// Komponen utama layout
const LayoutContent = ({ children }: { children: React.ReactNode }) => {
    const { isSidebarOpen } = useSidebar();
    const { user } = useAuth(); 

    const transition = 'transition-all duration-300 ease-in-out';
    
    // Tentukan apakah sidebar harus ditampilkan (Hanya sembunyikan saat user == null)
    const showSidebar = !!user; 

    // Tentukan lebar sidebar sebenarnya: 64 (saat terbuka) atau 20 (saat tertutup)
    const currentSidebarWidth = isSidebarOpen ? 'w-64' : 'w-20';
    
    // Margin ml-64 (256px) atau ml-20 (80px) untuk memberi ruang pada sidebar, 
    // atau ml-0 jika tidak ada sidebar (saat loading)
    const finalMarginClass = showSidebar ? (isSidebarOpen ? 'ml-64' : 'ml-20') : 'ml-0'; 
    const finalSidebarWidthClass = showSidebar ? currentSidebarWidth : 'w-0';


    if (!user) {
        // Saat user null (loading/logout), render hanya children (loading screen) tanpa sidebar
        return (
            <main className="flex min-h-screen w-full items-center justify-center bg-gray-950">
                {children}
            </main>
        );
    }
    
    // Jika user sudah ada, tampilkan layout penuh
    return (
        <div className="min-h-screen bg-[#111827] text-white flex">
            {/* Sidebar hanya di-render jika showSidebar TRUE */}
            <div className={`h-full fixed ${transition} ${finalSidebarWidthClass}`}>
                 <Sidebar isCollapsed={!isSidebarOpen} onToggle={() => {}} />
            </div>
            
            {/* Main Content: Margin menyesuaikan lebar sidebar/ketiadaan sidebar */}
            <main className={`flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto ${transition} ${finalMarginClass}`}>
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