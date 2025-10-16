// src/app/home/page.tsx

import Header from "@/components/home/Header"; 
import HeroSection from "@/components/home/HeroSection"; 
import BentoGridSection from "@/components/home/BentoGridSection"; 
import TestimonialSection from "@/components/home/TestimonialSection"; // Import
import FooterSection from "@/components/home/FooterSection"; // Import

export default function HomePage() {
  return (
    // Catatan: Pastikan <body> atau Layout Anda memiliki background-color default gelap (misal: bg-gray-950)
    <>
      <Header />
      <main className="min-h-screen"> 
        {/* Tambahkan padding di sini agar konten tidak tertutup header fixed */}
        <HeroSection />
        <BentoGridSection />
        <TestimonialSection /> {/* Panggil komponen */}
      </main>
      <FooterSection /> {/* Panggil komponen di luar main jika ingin footer menempel di bawah */}
    </>
  );
}