// src/components/LinkList.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LinkItem from "./LinkItem"; // Import komponen yang baru kita buat

// (Salin-tempel interface Link di sini atau import dari file lain)
import { Link } from "@/types";

interface LinkListProps {
  links: Link[];
  isLoading: boolean;
  onEdit: (link: Link) => void;
  onDelete: (linkId: number) => void;
}

export default function LinkList({ links, isLoading, onEdit, onDelete }: LinkListProps) {
  return (
    <Card className="bg-black/20 backdrop-blur-lg border border-white/10 shadow-lg">
      <CardHeader>
        <CardTitle>Links</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? ( <p className="text-muted-foreground">Memuat...</p> ) : 
         links.length > 0 ? (
          <ul className="space-y-3">
            {links.map((link) => (
              <LinkItem
                key={link.id}
                link={link}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </ul>
        ) : ( <p className="text-muted-foreground">Mulai dengan menambahkan link pertama Anda.</p> )}
      </CardContent>
    </Card>
  );
}