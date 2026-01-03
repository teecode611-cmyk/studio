// @/components/socratic-ai/header.tsx
import { GraduationCap } from 'lucide-react';

export function Header() {
  return (
    <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <GraduationCap className="h-7 w-7 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-headline">
            SocraticAI
          </h1>
        </div>
      </div>
    </header>
  );
}
