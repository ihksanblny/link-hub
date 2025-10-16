// src/components/home/ProfileCard.tsx

// Definisikan 'props' yang akan diterima komponen ini
interface ProfileCardProps {
  name: string;
  links: {
    title: string;
    color: string;
  }[];
}

export default function ProfileCard({ name, links }: ProfileCardProps) {
  return (
    <div className="bg-card/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6 transition-transform hover:scale-105">
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-violet-500 mx-auto mb-4"></div>
        <h3 className="font-bold text-lg text-foreground">{name}</h3>
      </div>
      <div className="space-y-3 mt-6">
        {links.map((link, index) => (
          <div key={index} className={`p-3 rounded-lg font-semibold text-center text-white ${link.color}`}>
            {link.title}
          </div>
        ))}
      </div>
    </div>
  );
}