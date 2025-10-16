// src/components/home/BentoGridSection.tsx

import { Link, Lock, Zap, BarChart } from "lucide-react"; 

interface BentoCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
  isGradient?: boolean;
}

const BentoCard = ({ title, description, icon, className = "", isGradient = false }: BentoCardProps) => (
  <div 
    className={`p-6 rounded-3xl transition-all duration-300 transform border border-white/10 ${className} ${
      isGradient 
        ? 'bg-gradient-to-br from-black to-gray-900 shadow-xl hover:shadow-2xl'
        : 'bg-gray-950 hover:bg-gray-900'
    }`}
  >
    <div className={`p-3 rounded-xl mb-4 ${isGradient ? 'bg-white/10' : 'bg-gray-800'}`}>
      {icon}
    </div>
    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
    <p className="text-gray-400 text-sm">{description}</p>
  </div>
);

export default function BentoGridSection() {
  return (
    <section id="services" className="w-full py-20 md:py-32 bg-gray-950"> {/* Background gelap */}
      <div className="container px-4 md:px-6 mx-auto max-w-7xl">
        
        {/* Judul Bagian: Narasi LinkHub */}
        <div className="text-center mb-16">
          <span className="text-sm font-semibold uppercase text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            Fitur Kunci LinkHub
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mt-2">
            Link-in-Bio dengan Keunggulan Full-Stack
          </h2>
        </div>
        
        {/* Grid Utama */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Kartu 1: Dashboard All-Rounder */}
          <BentoCard
            title="Dashboard All-Rounder"
            description="Dibuat dengan Next.js dan Supabase, Anda mendapatkan dashboard admin Full-Stack untuk mengelola link tanpa perlu koding."
            icon={<Link className="w-6 h-6 text-green-400" />}
            className="lg:col-span-2 row-span-1" 
          />

          {/* Kartu 2: Profil Super Cepat */}
          <BentoCard
            title="Profil Super Cepat"
            description="Berkat Server-Side Rendering (SSR) Next.js, profil publik Anda dimuat instan, memberikan pengalaman terbaik, dan sangat disukai oleh mesin pencari."
            icon={<Zap className="w-6 h-6 text-yellow-400" />}
            className="row-span-2 flex flex-col justify-between" 
            isGradient 
          />

          {/* Kartu 3: Keamanan Data Link */}
          <BentoCard
            title="Keamanan Terjamin (RLS)"
            description="Setiap link Anda dilindungi di database. Kami menggunakan Row Level Security (RLS) Supabase, memastikan hanya Anda yang bisa melihat dan mengedit link Anda."
            icon={<Lock className="w-6 h-6 text-red-400" />}
          />
          
          {/* Kartu 4: Siap Kustomisasi & Integrasi */}
          <BentoCard
            title="Siap Kustomisasi & Integrasi"
            description="Struktur API yang rapi memungkinkan Anda untuk mengkustomisasi tema, atau menambahkan integrasi pihak ketiga (misalnya, analitik klik) dengan mudah."
            icon={<BarChart className="w-6 h-6 text-blue-400" />}
          />
          
        </div>
        
      </div>
    </section>
  );
}