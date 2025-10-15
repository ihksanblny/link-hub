// src/components/ui/ProfileLinkButton.tsx
import { ReactNode } from "react";

interface ProfileLinkButtonProps {
  href: string;
  children: ReactNode;
}

export default function ProfileLinkButton({ href, children }: ProfileLinkButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full bg-card hover:bg-gray-700 p-4 rounded-lg transition-transform transform hover:scale-105 duration-200 font-semibold text-center text-text"
    >
      {children}
    </a>
  );
}