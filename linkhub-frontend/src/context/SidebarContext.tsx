// src/context/SidebarContext.tsx
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

// 1. Definisikan tipe untuk Context
interface SidebarContextType {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

// 2. Buat Context dengan nilai default
const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

// 3. Buat Provider untuk membungkus layout
export function SidebarProvider({ children }: { children: ReactNode }) {
  // Atur state default sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Default: terbuka

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  return (
    <SidebarContext.Provider value={{ isSidebarOpen, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
}

// 4. Buat Hook kustom untuk memudahkan penggunaan
export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}