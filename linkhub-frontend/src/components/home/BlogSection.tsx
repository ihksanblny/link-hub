// src/components/home/BlogSection.tsx

import Link from "next/link";
import { ArrowUpRight, Play, Heart } from "lucide-react"; // Tambah Play dan Heart icons

interface BlogCardProps {
  name: string; // Nama Orang (baru)
  profession: string; // Profesi/Jabatan
  tagline: string; // Deskripsi singkat
  image: string; // URL gambar profil
  actionText: string; // Teks untuk tombol aksi (misal: "Lihat Profil")
}

// MODIFIKASI KOMPONEN BLOGCARD total
const BlogCard = ({ name, profession, tagline, image, actionText }: BlogCardProps) => (
  // Container Card Utama: Tinggi tetap, dengan shadow dan border glassmorphism
  <div 
    className="relative h-[400px] w-full rounded-2xl overflow-hidden 
               bg-white/5 border border-white/10 backdrop-blur-lg 
               shadow-xl hover:shadow-purple-500/30 transition-all duration-300 group"
  >
    {/* Gambar Utama yang Menutupi Hampir Seluruh Card */}
    <div 
      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
      style={{ backgroundImage: `url(${image})` }}
      aria-label={`Profil ${name}, ${profession}`}
    />
    
    {/* Overlay Gelap dengan Gradien untuk Teks dan Kontrol */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent flex flex-col justify-end p-6">
      <h3 className="text-2xl font-bold text-white mb-1">{name}</h3> {/* Nama Orang */}
      <p className="text-gray-300 text-sm mb-4 leading-snug">{profession}</p> {/* Profesi/Jabatan */}
      
      {/* Tombol Aksi Kiri (Mirip tombol Play) */}
      <div className="flex justify-between items-center mt-auto">
        <Link 
          href="#" 
          className="inline-flex items-center bg-black/60 px-4 py-2 rounded-full 
                     text-white text-sm font-semibold transition-colors hover:bg-black/80"
        >
          <Play className="h-4 w-4 mr-2" /> {actionText}
        </Link>

        {/* Tombol Aksi Kanan (Mirip tombol Like) */}
        <button 
          className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center 
                     text-white transition-colors hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-black"
        >
          <Heart className="h-5 w-5 fill-current" />
        </button>
      </div>
    </div>
  </div>
);

export default function BlogSection() {
  const blogPosts = [
    {
      name: "Sisca Wijaya",
      profession: "Content Creator",
      tagline: "Satukan Semua Platform di Satu Link Cepat dan Aman",
      image: "https://images.unsplash.com/photo-1758598305805-4b9d79ae89bf?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1932", // Ganti dengan gambar portrait
      actionText: "Lihat LinkHub",
    },
    {
      name: "Budi Setiawan",
      profession: "Graphic Designer",
      tagline: "Tampilkan Dribbble, Behance, dan Portofolio Anda",
      image: "https://images.unsplash.com/photo-1613909207039-6b173b755cc1?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1847", // Ganti dengan gambar portrait
      actionText: "Karya Terkini",
    },
    {
      name: "Rina Fitriani",
      profession: "Full-Stack Developer",
      tagline: "Jembatan Sempurna ke Semua Kode dan Proyek GitHub",
      image: "https://images.unsplash.com/photo-1630091003936-aea522c1e8c3?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1740", // Ganti dengan gambar portrait
      actionText: "Lihat GitHub",
    },
    {
      name: "Chef Anton",
      profession: "Food Blogger / Chef",
      tagline: "Promosikan Blog Resep, Kelas Masak, dan E-book Kuliner",
      image: "https://images.unsplash.com/photo-1512485800893-b08ec1ea59b1?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1740", // Ganti dengan gambar portrait
      actionText: "Lihat Resep",
    },
  ];

  return (
    <section 
      id="blogs" 
      className="w-full py-20 md:py-32 bg-gradient-to-br from-gray-950 via-gray-900 to-black relative" 
    > 
      <div className="container px-4 md:px-6 mx-auto max-w-7xl">
        
        <div className="text-center mb-16">
          <span className="text-sm font-semibold uppercase text-purple-600">
            Keseruan Bersama LinkHub
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mt-2">
            Lihat Bagaimana Para Profesional Menggunakannya
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {blogPosts.map((post, index) => (
            <BlogCard 
              key={index} 
              name={post.name} // Gunakan 'name'
              profession={post.profession} 
              tagline={post.tagline} // Gunakan 'tagline'
              image={post.image} 
              actionText={post.actionText} // Gunakan 'actionText'
            />
          ))}
        </div>
        
      </div>
    </section>
  );
}