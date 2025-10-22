'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

// ----------------------------------------------------------------------
// 1. PERBAIKAN INTERFACE USER (Menambahkan data Profil sebagai Optional)
// ----------------------------------------------------------------------
interface User {
    id: string;
    email: string;
    // Data Profil dari tabel 'profiles' (Optional karena tidak ada di JWT)
    full_name?: string | null;
    username?: string | null;
    avatar_url?: string | null;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (token: string) => void;
    logout: () => void;
    isAuthLoading: boolean;
    refreshUser: () => Promise<void>;
    // HAPUS avatar_url: string | null; karena sudah ada di user.avatar_url
    // Jika Anda ingin properti ini di tingkat atas, Anda harus menambahkannya, 
    // tetapi kita akan menggunakan user?.avatar_url
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isAuthLoading, setIsAuthLoading] = useState(true);

    // --- 1. FUNGSI UTAMA: refreshUser ---
    const refreshUser = useCallback(async () => {
        // 🟢 PERBAIKAN: Gunakan token dari closure useCallback
        // Karena kita akan memicu fungsi ini melalui token dependency, 
        // token di sini sudah terjamin nilai terbarunya.
        if (!token) return; 

        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        
        // 🟢 PERBAIKAN FINAL: Ganti endpoint ke /user (sesuai klarifikasi)
        const endpoint = `${apiUrl}/user/me`; 
        
        console.log("DEBUG FULL ENDPOINT (Target User Detail):", endpoint);
        
        try {
            const response = await fetch(endpoint, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json' 
                }
            });

            if (response.status === 401) {
                // Token invalid/expired di tengah sesi
                logout();
                return;
            }

            if (!response.ok) throw new Error("Gagal mengambil profil.");

            const data = await response.json();
            
            // 🟢 UPDATE STATE: Pastikan semua data profil baru ditambahkan
            setUser((currentUser) => ({
                // Jaga agar data lain yang sudah ada di state tetap ada
                ...currentUser, 
                // Tumpuk dengan data terbaru dari API
                ...data.data, 
            }));

        } catch (error) {
            console.error("Refresh user error:", error);
            // Jika ada error fetch, paksa logout (jika perlu)
            // logout();
        }
    }, [token]); // Dependency array: Hanya refresh saat token berubah

    // --- 2. FUNGSI LOGOUT ---
    const logout = useCallback(() => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('authToken');
        // router.replace('/login'); // Redirect dilakukan di page.tsx
    }, []);

    // --- 3. FUNGSI LOGIN ---
    const login = (newToken: string) => {
        try {
            const decoded = jwtDecode<any>(newToken);
            
            const initialUser: User = { id: decoded.sub, email: decoded.email };
            
            setUser(initialUser);
            setToken(newToken);
            localStorage.setItem('authToken', newToken);
            
            // 🔴 KESALAHAN LAMA DIHAPUS: Hapus panggilan refreshUser() di sini
            // refreshUser(); // Ini menggunakan token yang lama (null)
        } catch (error) {
            console.error("Invalid token");
        }
    };

    // --- 4. LIFECYCLE HOOKS ---

    // 🟢 PERBAIKAN KRUSIAL A: useEffect baru untuk memicu refreshUser secara AMAN
    // Ini adalah SOLUSI untuk masalah Stale Closure. 
    // Setiap kali 'token' berubah (setelah login atau initial load), fungsi ini akan dipanggil
    // menggunakan fungsi 'refreshUser' yang ter-memoize dengan nilai 'token' yang BARU.
    useEffect(() => {
        if (token) {
            console.log("AUTH DEBUG: Token terdeteksi berubah. Memicu refreshUser.");
            refreshUser();
        }
    }, [token, refreshUser]); // refreshUser ditambahkan karena dia adalah dependency

    // 🟢 PERBAIKAN KRUSIAL B: useEffect untuk Initial Load (dari localStorage)
    useEffect(() => {
        const storedToken = localStorage.getItem('authToken');
        
        console.log("AUTH DEBUG: Token found in localStorage:", !!storedToken); 

        if (storedToken) {
            try {
                const decoded = jwtDecode<any>(storedToken); 
                
                // Pengecekan Kedaluwarsa (Expiration Check)
                const currentTime = Date.now() / 1000;
                if (decoded.exp && decoded.exp < currentTime) {
                    console.log("AUTH DEBUG: Token is expired. Logging out.");
                    logout();
                } else {
                    console.log("AUTH DEBUG: Token is VALID. Setting user:", decoded.email);
                    
                    const initialUser: User = { id: decoded.sub, email: decoded.email };
                    setUser(initialUser);
                    setToken(storedToken);
                    
                    // 🔴 KESALAHAN LAMA DIHAPUS: Hapus panggilan refreshUser() di sini
                    // refreshUser(); // Ini menggunakan token yang lama (null)
                    // Panggilan kini ditangani oleh useEffect di atas ([token])
                }

            } catch (error) {
                console.error("AUTH ERROR: Token decode failed.", error);
                logout();
            }
        }
        
        setIsAuthLoading(false);
        console.log("AUTH DEBUG: isAuthLoading set to FALSE.");
    }, [logout]); // logout sebagai dependency (dijamin stabil oleh useCallback)

    // ... (return context value tetap sama)

    return (
        <AuthContext.Provider value={{ user, token, logout, login, isAuthLoading, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};