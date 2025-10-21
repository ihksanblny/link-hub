'use client';

import { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { jwtDecode } from "jwt-decode";

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

export function AuthProvider({ children } : { children : ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isAuthLoading, setIsAuthLoading] = useState(true);

    // ----------------------------------------------------------------------
    // 2. LOGIC REFRESH USER (Digunakan untuk memuat full_name/avatar_url)
    // ----------------------------------------------------------------------
    const refreshUser = async () => {
        if (!token) return;
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        
        try {
            const response = await fetch(`${apiUrl}/user/me`, { 
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();

            if (response.ok && data.data) {
                // Gunakan spread operator untuk menggabungkan data token yang sudah ada
                // dengan data profil yang baru di-fetch (full_name, username, avatar_url)
                setUser(prevUser => {
                    // Cek jika prevUser null (harusnya tidak terjadi saat refresh)
                    if (!prevUser) return null; 
                    
                    return { 
                        ...prevUser, 
                        // Gabungkan data profil baru:
                        full_name: data.data.full_name,
                        username: data.data.username,
                        avatar_url: data.data.avatar_url,
                        // ... fields lain dari data.data
                    };
                });
            }
        } catch (error) {
            console.error("Gagal merefresh data user:", error);
        }
    };


    // ----------------------------------------------------------------------
    // 3. LOGIC UTAMA: MEMUAT TOKEN DARI LOCALSTORAGE
    // ----------------------------------------------------------------------
    useEffect(() => {
        const storedToken = localStorage.getItem('authToken');
        
        console.log("AUTH DEBUG: Token found in localStorage:", !!storedToken); 

        if (storedToken) {
            try {
                const decoded = jwtDecode<any>(storedToken); 
                
                // Pengecekan Kedaluwarsa (Expiration Check)
                const currentTime = Date.now() / 1000;
                if (decoded.exp && decoded.exp < currentTime) {
                    console.error("AUTH DEBUG: Token EXPIRED! Clearing localStorage.");
                    localStorage.removeItem('authToken');
                } else {
                    console.log("AUTH DEBUG: Token is VALID. Setting user:", decoded.email);
                    
                    // Inisialisasi User HANYA dengan data dari token (id, email)
                    const initialUser: User = { id: decoded.sub, email: decoded.email };
                    setUser(initialUser);
                    setToken(storedToken);
                    
                    // PENTING: Panggil refreshUser untuk memuat data profil lainnya
                    // Kita memanggilnya di sini karena token sudah kita set.
                    // Gunakan setTimeout kecil untuk menghindari race condition saat inisialisasi pertama.
                    setTimeout(() => refreshUser(), 100); 
                }

            } catch (error) {
                console.error("AUTH DEBUG: Token decode FAILED. Clearing localStorage.", error);
                localStorage.removeItem('authToken');
            }
        }
        
        // Finalisasi loading state
        setTimeout(() => {
            setIsAuthLoading(false);
            console.log("AUTH DEBUG: isAuthLoading set to FALSE.");
        }, 150); // Tambahkan sedikit delay untuk memastikan semua logic di atas berjalan
    }, []);


    // ----------------------------------------------------------------------
    // 4. LOGIC LOGIN DAN LOGOUT
    // ----------------------------------------------------------------------
    const login = (newToken : string) => {
        try {
            const decoded = jwtDecode<any>(newToken);
            
            const initialUser: User = { id: decoded.sub, email: decoded.email };
            setUser(initialUser);
            setToken(newToken);
            localStorage.setItem('authToken', newToken);
            
            // Panggil refreshUser setelah login untuk memuat full_name/username/avatar_url
            setTimeout(() => refreshUser(), 100);

        } catch (error) {
            console.error("Invalid token");
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('authToken');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isAuthLoading, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error ('useAuth must be used within an AuthProvider');
    }
    return context;
}