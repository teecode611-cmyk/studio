'use client';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';

const KoyaLogoHeader = () => (
  <svg
    width="50"
    height="50"
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="32" cy="32" r="32" fill="#355E3B" />
    <path
      d="M23.6 44V23.2H28.4V34.8L36.8 23.2H41.6L32.4 33.2L42 44H37.2L29.6 35.6L28.4 36.8V44H23.6Z"
      fill="#FDFCEC"
    />
    <path
      d="M32 18C33.1046 18 34 17.1046 34 16C34 14.8954 33.1046 14 32 14C30.8954 14 30 14.8954 30 16C30 17.1046 30.8954 18 32 18Z"
      fill="#D4AF37"
    />
  </svg>
);

interface HeaderProps {
  onLogoClick: () => void;
}

export function Header({ onLogoClick }: HeaderProps) {
  return (
    <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <button onClick={onLogoClick} className="flex items-center gap-3">
          <KoyaLogoHeader />
        </button>
        <Button variant="ghost" size="icon">
            <User className="h-6 w-6 text-accent" />
            <span className="sr-only">Account</span>
        </Button>
      </div>
    </header>
  );
}
