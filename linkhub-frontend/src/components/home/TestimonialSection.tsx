// src/components/home/TestimonialSection.tsx

import { Quote } from "lucide-react";

export default function TestimonialSection() {
  const testimonials = [
    {
      quote: "Mengatur link media sosial jadi sangat cepat dan mudah. Dashboardnya intuitif dan zero-configuration!",
      name: "Sisca Wijaya",
      title: "Content Creator & Podcaster",
    },
    {
      quote: "Profil LinkHub saya dimuat jauh lebih cepat dibanding layanan link-in-bio lain. Performa adalah segalanya!",
      name: "Bambang Setyo",
      title: "Digital Marketing Specialist",
    },
    {
      quote: "Paling suka dengan keamanannya. Saya tahu link dan data saya terenkripsi dengan baik di Supabase.",
      name: "Rina Fitriani",
      title: "Freelance Developer",
    },
  ];

  return (
    <section id="testimonials" className="w-full py-20 md:py-32 bg-gray-950"> {/* Background gelap */}
      <div className="container px-4 md:px-6 mx-auto max-w-7xl">
        
        {/* Judul Bagian: Narasi LinkHub */}
        <div className="text-center mb-16">
          <span className="text-sm font-semibold uppercase text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-yellow-400">
            Bukti Penggunaan Nyata
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mt-2">
            LinkHub, Pilihan Para Kreator Cerdas
          </h2>
        </div>
        
        {/* Grid Testimonial */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, index) => (
            <div
              key={index}
              className="p-8 bg-gray-900 rounded-3xl border border-gray-800 transition-shadow duration-300 hover:shadow-lg hover:shadow-purple-500/10"
            >
              <Quote className="h-8 w-8 text-purple-400 mb-4 opacity-50" />
              <p className="text-lg text-gray-200 italic mb-6">
                "{t.quote}"
              </p>
              <div className="text-sm font-semibold text-white">
                {t.name}
                <p className="text-xs text-gray-500 font-normal mt-1">{t.title}</p>
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
}