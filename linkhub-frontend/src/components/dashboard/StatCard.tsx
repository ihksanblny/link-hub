// src/components/dashboard/StatCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";

interface StatCardProps { 
    title: string; 
    value: string; 
    icon: ReactNode;
    // Tambahkan prop opsional untuk delta (perubahan)
    delta?: string;
}

export default function StatCard({ title, value, icon, delta }: StatCardProps) {
  // Logic untuk warna delta
  const isPositive = delta ? delta.startsWith('+') : true;
  const deltaColor = isPositive ? 'text-green-400' : 'text-red-400';
  const accentColor = title.includes('Views') ? 'text-purple-400' : title.includes('Clicks') ? 'text-blue-400' : 'text-green-400';

  return (
    // Styling Glassmorphism/Dark modern: bg transparan, border halus, hover
    <Card className="bg-white/5 backdrop-blur-md border border-white/10 transition-all duration-300 hover:border-purple-500/50 hover:shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        {/* Title dan Icon dengan warna aksen */}
        <CardTitle className="text-sm font-medium text-gray-400">{title}</CardTitle>
        <div className={`p-2 rounded-full ${accentColor}/20 ${accentColor}`}>
            {/* Memastikan ikon menggunakan warna aksen */}
            {/* Karena icon adalah ReactNode, kita tidak bisa langsung mengubah warnanya di sini, 
                tapi kita bisa bungkus div untuk menunjukkan aksen. */}
            {icon}
        </div>
      </CardHeader>
      <CardContent>
        {/* Nilai utama (Angka besar dan tebal) */}
        <div className="text-4xl font-extrabold text-white mb-2">{value}</div>
        
        {/* Delta / Perubahan (opsional) */}
        {delta && (
            <div className="flex justify-between items-center">
                <p className={`text-sm font-semibold ${deltaColor}`}>{delta}</p>
                <span className="text-xs text-gray-500">Periode Lalu</span>
            </div>
        )}
      </CardContent>
    </Card>
  );
}