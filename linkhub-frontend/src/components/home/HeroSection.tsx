// src/components/home/HeroSection.tsx
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative w-full py-24 md:py-32 lg:py-40 bg-gray-950 overflow-hidden"> 
      <div className="container px-4 md:px-6 z-10 relative">
        <div className="flex flex-col items-center justify-center text-center">
          
          {/* Headline Utama: Narasi LinkHub */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[80px] font-extrabold tracking-tighter max-w-5xl leading-tight text-white"> 
            Satu Link. Semua Konten.
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-yellow-400"> Kekuatan Penuh</span>
          </h1>

          {/* Sub-Headline: Narasi LinkHub */}
          <p className="mt-6 max-w-3xl text-lg md:text-xl text-gray-400">
            Tampilkan semua link Anda di satu halaman publik yang cepat, aman, dan siap SEO. 
            LinkHub adalah solusi Full-Stack untuk para kreator dan profesional.
          </p>
          
          {/* Tombol CTA */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link
              href="/register"
              className="inline-flex h-12 items-center justify-center rounded-full bg-gray-900 px-8 text-base font-semibold text-white shadow-lg transition-transform duration-200 hover:scale-[1.03] hover:bg-gray-700 border border-white/20"
            >
              Mulai Proyek Anda Sekarang
            </Link>
            <Link
              href="#services"
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/30 bg-transparent px-8 text-base font-semibold text-white shadow-sm transition-transform duration-200 hover:scale-[1.03] hover:bg-white/10"
            >
              Lihat Fitur Kami <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
      
      {/* Efek visual latar belakang (Opsional) */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="w-96 h-96 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 absolute top-0 left-0 animate-blob"></div>
        <div className="w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 absolute bottom-0 right-0 animate-blob animation-delay-4000"></div>
      </div>
    </section>
  );
}