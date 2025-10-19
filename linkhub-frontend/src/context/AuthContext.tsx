'use client';

import { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { jwtDecode } from "jwt-decode";

//Definisikan tipe data untuk user dan context
interface User {
    id : string;
    email : string;
}

interface AuthContextType {
    user : User | null;
    token : string | null;
    login : (token : string) => void;
    logout : () => void;
    isAuthLoading : boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children } : { children : ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isAuthLoading, setIsAuthLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem('authToken');
        
        // DEBUGGING: Cek apakah token ada
        console.log("AUTH DEBUG: Token found in localStorage:", !!storedToken); 

        if (storedToken) {
            try {
                // Gunakan 'any' untuk mengakses claim standar seperti 'exp' (expiration)
                const decoded = jwtDecode<any>(storedToken); 
                
                // Pengecekan Kedaluwarsa (Expiration Check)
                const currentTime = Date.now() / 1000;
                if (decoded.exp && decoded.exp < currentTime) {
                    console.error("AUTH DEBUG: Token EXPIRED! Clearing localStorage.");
                    localStorage.removeItem('authToken');
                    // Tidak perlu set user/token karena akan di-clear
                } else {
                    // Token VALID
                    console.log("AUTH DEBUG: Token is VALID. Setting user:", decoded.email);
                    setUser({ id: decoded.sub, email: decoded.email });
                    setToken(storedToken);
                }

            } catch (error) {
                // Token rusak/tidak valid (misalnya, formatnya salah)
                console.error("AUTH DEBUG: Token decode FAILED (corrupt or malformed). Clearing localStorage.", error);
                localStorage.removeItem('authToken');
            }
        }
        
        // PENTING: Pindahkan ini ke dalam setTimeout untuk memastikan semua log di atas selesai, 
        // meskipun biasanya tidak perlu, ini terkadang menyelesaikan masalah race condition di Next.js
        setTimeout(() => {
             setIsAuthLoading(false);
             console.log("AUTH DEBUG: isAuthLoading set to FALSE.");
        }, 50); // Tambahkan delay sangat singkat
    }, []);

    const login = (newToken : string) => {
        try {
            const decoded = jwtDecode<User & { sub : string }>(newToken);
            setUser({ id : decoded.sub, email : decoded.email });
            setToken(newToken);
            localStorage.setItem('authToken', newToken);
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
        <AuthContext.Provider value={{ user, token, login, logout, isAuthLoading }}>
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