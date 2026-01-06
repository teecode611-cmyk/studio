'use client';
import { Button } from '@/components/ui/button';

const KoyaLogoHeader = () => (
  <svg width="150" height="50" viewBox="0 0 200 70" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M31.2949 53.0587V20.8822H42.5222V36.9999L59.6999 20.8822H71.7142L53.2808 38.2587L72.5013 53.0587H60.487L47.5188 40.549L42.5222 45.4244V53.0587H31.2949Z" fill="#355E3B"/>
    <path d="M129.282 53.0587V20.8822H140.509V36.9999L157.687 20.8822H169.701L151.268 38.2587L170.488 53.0587H158.474L145.506 40.549L140.509 45.4244V53.0587H129.282Z" fill="#355E3B"/>
    <path d="M96.7915 54C86.8373 54 78.8915 46.866 78.8915 36.941C78.8915 27.016 86.8373 19.8821 96.7915 19.8821C106.746 19.8821 114.691 27.016 114.691 36.941C114.691 46.866 106.746 54 96.7915 54ZM96.7915 45.9175C102.115 45.9175 106.275 42.0239 106.275 36.941C106.275 31.8581 102.115 27.9645 96.7915 27.9645C91.468 27.9645 87.3082 31.8581 87.3082 36.941C87.3082 42.0239 91.468 45.9175 96.7915 45.9175Z" fill="#355E3B"/>
    <ellipse cx="97" cy="11.5" rx="5" ry="5.5" fill="#D4AF37"/>
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
        <Button variant="link" className="font-headline text-lg font-bold text-accent hover:text-accent/80">
          Log In
        </Button>
      </div>
    </header>
  );
}
