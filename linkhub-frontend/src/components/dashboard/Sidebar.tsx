// src/components/dashboard/Sidebar.tsx
'use client';

import { LayoutDashboard, Settings, LogOut, LinkIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useSidebar } from '@/context/SidebarContext';

interface SidebarProps {
    isCollapsed: boolean;
    onToggle: () => void; // Fungsi untuk membuka/menutup (hanya jika Anda ingin tombolnya di sidebar)
}

export default function Sidebar({ isCollapsed }: SidebarProps) {
    const router = useRouter();
    const { user, logout } = useAuth(); // Asumsi: untuk footer user info dan logout
    const { isSidebarOpen } = useSidebar();

    const navItems = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Pengaturan', href: '/dashboard/settings', icon: Settings },
    ];
    
    // Lebar sidebar saat terbuka (w-64) dan tertutup (w-20)
    const sidebarWidth = isCollapsed ? 'w-20' : 'w-64'; 
    const transition = 'transition-all duration-300 ease-in-out';

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    return (
        <aside 
            className={`fixed h-full bg-gray-900 border-r border-gray-800 z-30 flex flex-col justify-between ${sidebarWidth} ${transition}`}
        >
            {/* Top Section: Logo & Navigasi */}
            <div className="flex flex-col">
                <div className={`flex items-center p-4 border-b border-gray-800 h-16 ${!isSidebarOpen ? 'justify-center' : 'justify-start space-x-2'}`}>
                    <LinkIcon className="w-6 h-6 text-green-400 flex-shrink-0" />
                    {isSidebarOpen && <span className="text-xl font-bold text-white">LinkHub.</span>} {/* Perhatikan kondisi state */}
                </div>

                {/* Navigasi Link */}
                <nav className="mt-6 space-y-2 p-3">
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center p-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white ${transition}`}
                        >
                            <item.icon className={`w-5 h-5 flex-shrink-0 ${!isSidebarOpen ? 'mr-0' : 'mr-3'}`} />
                            {isSidebarOpen && <span className="font-medium">{item.name}</span>} {/* Perhatikan kondisi state */}
                        </Link>
                    ))}
                </nav>
            </div>

            {/* Bottom Section: User Info & Logout */}
            <div className={`p-3 border-t border-gray-800 ${!isSidebarOpen ? 'justify-center' : 'justify-start'}`}>
                <div className={`flex items-center p-2 rounded-lg bg-gray-800 hover:bg-gray-700 ${!isSidebarOpen ? 'justify-center' : 'justify-start space-x-3'}`}>
                    <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {user?.email ? user.email[0].toUpperCase() : 'N'}
                    </div>
                    {isSidebarOpen && ( /* Perhatikan kondisi state */
                        <div className="flex-grow min-w-0 truncate">
                            <p className="text-sm font-semibold text-white truncate">{user?.email || 'Guest'}</p>
                            <p onClick={handleLogout} className="text-xs text-red-400 cursor-pointer hover:text-red-300 flex items-center">
                                <LogOut className="w-3 h-3 mr-1" /> Logout
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
}