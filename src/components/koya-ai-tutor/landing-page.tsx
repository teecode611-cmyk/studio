'use client';

import { useState }from 'react';
import { Button } from '@/components/ui/button';
import { ProblemForm } from './problem-form';

const KoyaLogo = () => (
  <svg width="200" height="70" viewBox="0 0 200 70" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M42.5 68.5C30.5 68 20.5 64.5 12.5 58C-1.5 46 -3 28.5 10 14.5C18.5 5.5 30 1.5 42.5 1.5C55 1.5 65.5 6 73.5 14.5C87.5 28.5 86 46 72 58C64.5 64.5 54.5 68.5 42.5 68.5Z" fill="#F5F5DC"/>
    <path d="M31.2949 53.0587V20.8822H42.5222V36.9999L59.6999 20.8822H71.7142L53.2808 38.2587L72.5013 53.0587H60.487L47.5188 40.549L42.5222 45.4244V53.0587H31.2949Z" fill="#355E3B"/>
    <path d="M129.282 53.0587V20.8822H140.509V36.9999L157.687 20.8822H169.701L151.268 38.2587L170.488 53.0587H158.474L145.506 40.549L140.509 45.4244V53.0587H129.282Z" fill="#355E3B"/>
    <path d="M96.7915 54C86.8373 54 78.8915 46.866 78.8915 36.941C78.8915 27.016 86.8373 19.8821 96.7915 19.8821C106.746 19.8821 114.691 27.016 114.691 36.941C114.691 46.866 106.746 54 96.7915 54ZM96.7915 45.9175C102.115 45.9175 106.275 42.0239 106.275 36.941C106.275 31.8581 102.115 27.9645 96.7915 27.9645C91.468 27.9645 87.3082 31.8581 87.3082 36.941C87.3082 42.0239 91.468 45.9175 96.7915 45.9175Z" fill="#355E3B"/>
    <path d="M178.697 36.9412C178.697 42.0241 182.857 45.9177 188.18 45.9177C193.504 upbeat 45.9177 197.664 42.0241 197.664 36.9412C197.664 31.8583 193.504 27.9647 188.18 27.9647C182.857 27.9647 178.697 31.8583 178.697 36.9412Z" fill="#355E3B" transform="translate(-15, 0)"/>
    <path d="M43 25C47.5 13.5 54 10.5 61 11C54.5 15.5 50.5 21.5 43 25Z" fill="#D4AF37"/>
    <ellipse cx="97" cy="11.5" rx="5" ry="5.5" fill="#D4AF37"/>
  </svg>
);


const UploadIcon = () => (
  <svg width="60" height="60" viewBox="0 0 84 84" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2.5" y="2.5" width="79" height="79" rx="21.5" fill="#F5F5DC"/>
    <path d="M62 27H45.24C44.136 27 43.078 26.544 42.248 25.756L39.752 23.388C38.922 22.544 37.864 22 36.76 22H26C23.792 22 22 23.792 22 26V54C22 56.208 23.792 58 26 58H62C64.208 58 66 56.208 66 54V31C66 28.792 64.208 27 62 27Z" fill="#D4AF37"/>
    <circle cx="44" cy="42" r="8" fill="#355E3B"/>
  </svg>
);

const TypeIcon = () => (
  <svg width="60" height="60" viewBox="0 0 84 84" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2.5" y="2.5" width="79" height="79" rx="21.5" fill="#F5F5DC"/>
    <rect x="22" y="32" width="40" height="26" rx="6" fill="#D4AF37"/>
    <circle cx="29" cy="38" r="2" fill="#F5F5DC" />
    <circle cx="36" cy="38" r="2" fill="#F5F5DC" />
    <circle cx="43" cy="38" r="2" fill="#F5F5DC" />
    <circle cx="50" cy="38" r="2" fill="#F5F5DC" />
    <circle cx="32.5" cy="45.5" r="2.5" fill="#F5F5DC" />
    <circle cx="40.5" cy="45.5" r="2.5" fill="#F5FDC" />
    <circle cx="48.5" cy="45.5" r="2.5" fill="#F5F5DC" />
    <rect x="34" y="52" width="16" height="4" rx="2" fill="#F5F5DC" />
  </svg>
);

export function LandingPage() {
  const [showProblemForm, setShowProblemForm] = useState(false);
  const [formMode, setFormMode] = useState<'text' | 'upload'>('text');

  const handleStart = (mode: 'text' | 'upload') => {
    setFormMode(mode);
    setShowProblemForm(true);
  };
  
  const handleBack = () => {
    setShowProblemForm(false);
  };

  const handleSessionStart = (data: {problem: string, imageDataUri?: string}) => {
    console.log("Starting session with:", data);
    // Here you would transition to the tutor view
  }

  if (showProblemForm) {
    return <ProblemForm defaultMode={formMode} onBack={handleBack} onSubmit={handleSessionStart} isLoading={false} />;
  }

  return (
    <div className="flex h-screen flex-col bg-[#FDFCEC]">
      <header className="absolute top-0 flex w-full items-center justify-between p-6">
        <KoyaLogo />
        <Button variant="link" className="font-headline text-xl font-bold text-accent hover:text-accent/80">
          Log In
        </Button>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center space-y-8 text-center">
        <div className="space-y-2">
          <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground">
            Hi! I'm Koya AI Tutor
          </h1>
          <p className="text-2xl text-foreground/80">
            What can I help you understand today?
          </p>
        </div>

        <div className="flex flex-col items-center gap-6">
          <button
            onClick={() => handleStart('upload')}
            className="group flex h-[100px] w-[300px] items-center justify-center gap-4 rounded-2xl border-4 border-primary bg-primary/5 p-4 text-2xl font-bold text-primary shadow-lg transition-transform hover:scale-105 hover:bg-primary/10"
          >
            <UploadIcon />
            <span>Upload Photo</span>
          </button>
          <button
            onClick={() => handleStart('text')}
            className="group flex h-[100px] w-[300px] items-center justify-center gap-4 rounded-2xl border-4 border-primary bg-primary/5 p-4 text-2xl font-bold text-primary shadow-lg transition-transform hover:scale-105 hover:bg-primary/10"
          >
            <TypeIcon />
            <span>Type Question</span>
          </button>
        </div>
      </main>
      <footer className="py-4 text-center">
        <p className="font-headline text-lg text-accent">Learn with guidance - not answers</p>
      </footer>
    </div>
  );
}
