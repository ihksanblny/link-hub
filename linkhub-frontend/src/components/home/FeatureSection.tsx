// src/components/home/FeaturesSection.tsx
import FeatureHighlight from "./FeaturesHighlight";
import ProfileCard from "./ProfileCard";

export default function FeaturesSection() {
  return (
    <section className="w-full py-12 md:py-24">
      <div className="container px-4 md:px-6 space-y-24">

        {/* --- Fitur #1: Dashboard --- */}
        <FeatureHighlight
          tag="KELOLA"
          title="Dasbor Intuitif di Ujung Jari Anda"
          description="Atur semua link Anda dengan mudah. Tambah, edit, hapus, dan susun ulang link secara real-time tanpa perlu pengetahuan teknis."
          features={[
            "Manajemen link tanpa batas",
            "Update profil secara instan",
            "Antarmuka yang bersih dan modern",
          ]}
          visual={
            // Placeholder visual untuk dashboard
            <div className="bg-background p-6 rounded-lg h-80 flex flex-col gap-4">
              <div className="h-8 bg-card rounded-md"></div>
              <div className="h-16 bg-card rounded-md"></div>
              <div className="h-16 bg-card rounded-md"></div>
              <div className="h-16 bg-card rounded-md"></div>
            </div>
          }
        />

        {/* --- Fitur #2: Halaman Publik --- */}
        <FeatureHighlight
          tag="BAGIKAN"
          title="Halaman Profil yang Elegan & Cepat"
          description="Buat kesan pertama yang tak terlupakan. Halaman profil Anda dirancang untuk memukau audiens dan memuat secepat kilat di semua perangkat."
          features={[
            "Desain responsif untuk mobile dan desktop",
            "Performa tinggi untuk pengalaman terbaik",
            "Username yang dapat dikustomisasi",
          ]}
          visual={
            // Kita gunakan ulang ProfileCard sebagai visualnya!
            <div className="scale-90">
              <ProfileCard name="@anda" links={[
                  { title: "Portofolio Anda", color: "bg-primary/80" },
                  { title: "Sosial Media", color: "bg-primary/80" },
                  { title: "Proyek Lainnya", color: "bg-primary/80" },
              ]} />
            </div>
          }
          reverse={true} // <-- Posisi visual di sebelah kiri
        />

      </div>
    </section>
  );
}