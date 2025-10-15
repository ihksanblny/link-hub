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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children } : { children : ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const storedToken = localStorage.getItem('authToken');
        if (storedToken) {
            try {
                const decoded = jwtDecode<User & { sub: string }>(storedToken);
                setUser({ id: decoded.sub, email: decoded.email });
                setToken(storedToken);
            } catch (error) {
                //Token tidak valid hapus token
                localStorage.removeItem('authToken');
            }
        }
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
        <AuthContext.Provider value={{ user, token, login, logout }}>
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