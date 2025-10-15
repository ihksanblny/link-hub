// src/components/LinkList.tsx
import LinkItem from "./LinkItem"; // Import komponen yang baru kita buat

// (Salin-tempel interface Link di sini atau import dari file lain)
interface Link {
  id: number;
  title: string | null;
  url: string;
  created_at: string;
}

interface LinkListProps {
  links: Link[];
  isLoading: boolean;
  onEdit: (link: Link) => void;
  onDelete: (linkId: number) => void;
}

export default function LinkList({ links, isLoading, onEdit, onDelete }: LinkListProps) {
  return (
    <div className="bg-card p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4 text-text">Link Anda</h2>
      {isLoading ? (
        <p className="text-text-secondary">Memuat data link...</p>
      ) : links.length > 0 ? (
        <ul className="space-y-4">
          {links.map((link) => (
            <LinkItem
              key={link.id}
              link={link}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </ul>
      ) : (
        <p className="text-text-secondary">Anda belum memiliki link. Silakan buat satu!</p>
      )}
    </div>
  );
}