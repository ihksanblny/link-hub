// src/components/home/FeatureHighlight.tsx
import { ReactNode } from "react";
import { CheckCircle2 } from "lucide-react";

interface FeatureHighlightProps {
  tag: string;
  title: string;
  description: string;
  features: string[];
  visual: ReactNode; // Kita akan berikan visualnya sebagai 'prop'
  reverse?: boolean; // Untuk mengatur posisi gambar (kiri/kanan)
}

export default function FeatureHighlight({
  tag,
  title,
  description,
  features,
  visual,
  reverse = false,
}: FeatureHighlightProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-12 md:gap-16">
      {/* Kolom Teks */}
      <div className={`space-y-4 ${reverse ? 'md:order-last' : ''}`}>
        <span className="text-primary font-bold">{tag}</span>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{title}</h2>
        <p className="text-muted-foreground text-lg">{description}</p>
        <ul className="space-y-2 pt-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              <span className="text-muted-foreground">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Kolom Visual */}
      <div className="relative">
        {/* Efek glow di belakang visual */}
        <div className="absolute -inset-4 bg-primary/10 rounded-3xl blur-2xl"></div>
        <div className="relative rounded-2xl border border-border/20 bg-card/50 p-4 backdrop-blur-sm">
          {visual}
        </div>
      </div>
    </div>
  );
}