// src/components/LinkItem.tsx
'use client';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { GripVertical, Pencil, Trash2, BarChart2 } from "lucide-react";
import type { Link } from "@/types";

interface LinkItemProps { link: Link; onEdit: (link: Link) => void; onDelete: (linkId: number) => void; }

export default function LinkItem({ link, onEdit, onDelete }: LinkItemProps) {
  const views = Math.floor(Math.random() * 2000) + 500; // Placeholder
  return (
    <li className="bg-black/20 backdrop-blur-lg border border-white/10 p-3 rounded-lg flex items-center gap-4 transition-all duration-300 hover:bg-white/10">
      <GripVertical className="text-muted-foreground cursor-grab flex-shrink-0" />
      <div className="w-16 h-10 bg-card rounded-md flex-shrink-0"></div>
      <div className="flex-grow overflow-hidden">
        <p className="font-bold text-foreground truncate">{link.title || 'Tanpa Judul'}</p>
        <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-primary text-sm truncate">{link.url}</a>
      </div>
      <div className="hidden md:flex items-center gap-2 text-muted-foreground flex-shrink-0">
        <BarChart2 className="h-4 w-4" />
        <span className="font-medium">{views}</span>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <Switch defaultChecked={true} />
        <Button variant="ghost" size="icon" onClick={() => onEdit(link)}>
          <Pencil className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => onDelete(link.id)}>
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </div>
    </li>
  );
}