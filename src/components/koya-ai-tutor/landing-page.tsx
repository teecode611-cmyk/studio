'use client';

import { useState }from 'react';
import { Button } from '@/components/ui/button';
import { ProblemForm } from './problem-form';
import { useRouter } from 'next/navigation';
import { Keyboard } from 'lucide-react';

const KoyaLogo = () => (
    <svg width="128" height="45" viewBox="0 0 200 70" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M31.2949 53.0587V20.8822H42.5222V36.9999L59.6999 20.8822H71.7142L53.2808 38.2587L72.5013 53.0587H60.487L47.5188 40.549L42.5222 45.4244V53.0587H31.2949Z" fill="#355E3B"/>
    <path d="M129.282 53.0587V20.8822H140.509V36.9999L157.687 20.8822H169.701L151.268 38.2587L170.488 53.0587H158.474L145.506 40.549L140.509 45.4244V53.0587H129.282Z" fill="#355E3B"/>
    <path d="M96.7915 54C86.8373 54 78.8915 46.866 78.8915 36.941C78.8915 27.016 86.8373 19.8821 96.7915 19.8821C106.746 19.8821 114.691 27.016 114.691 36.941C114.691 46.866 106.746 54 96.7915 54ZM96.7915 45.9175C102.115 45.9175 106.275 42.0239 106.275 36.941C106.275 31.8581 102.115 27.9645 96.7915 27.9645C91.468 27.9645 87.3082 31.8581 87.3082 36.941C87.3082 42.0239 91.468 45.9175 96.7915 45.9175Z" fill="#355E3B"/>
    <ellipse cx="97" cy="11.5" rx="5" ry="5.5" fill="#D4AF37"/>
  </svg>
);


export function LandingPage() {
  const [showProblemForm, setShowProblemForm] = useState(false);
  const [formMode, setFormMode] = useState<'text' | 'upload'>('text');
  const router = useRouter();

  const handleStart = (mode: 'text' | 'upload') => {
    setFormMode(mode);
    setShowProblemForm(true);
  };
  
  const handleBack = () => {
    setShowProblemForm(false);
  };

  const handleSessionStart = (data: {problem: string, imageDataUri?: string}) => {
    console.log("Starting session with:", data);
    // This is where we would transition to the tutor view
    // For now, we just log the data
  }

  if (showProblemForm) {
    return <ProblemForm defaultMode={formMode} onBack={handleBack} onSubmit={handleSessionStart} isLoading={false} />;
  }

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-[#FDFCEC]">
      {/* Decorative Blobs */}
      <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-primary/10" />
      <div className="absolute -right-20 -bottom-32 h-72 w-72 rounded-full bg-accent/10" />
      <div className="absolute bottom-1/3 right-10 h-20 w-20 rounded-full bg-primary/5" />


      <main className="z-10 flex flex-1 flex-col p-4">
        {/* Top Section */}
        <div className="flex flex-1 flex-col items-center justify-center text-center">
            <KoyaLogo />
            <p className="mt-2 text-lg font-bold text-accent">
                Learn with guidance - not answers.
            </p>
            <div className="mt-4 space-y-1">
                <h1 className="font-headline text-2xl font-bold tracking-tight text-foreground">
                    Hi! I'm Koya AI Tutor
                </h1>
                <p className="text-muted-foreground text-lg">What can I help you understand today?</p>
            </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col items-center gap-3 pb-8">
            <Button
                size="lg"
                onClick={() => handleStart('text')}
                className="w-full max-w-sm text-lg"
            >
                <Keyboard className="h-5 w-5 text-accent" />
                Type Question
            </Button>
            <Button
                size="lg"
                variant="outline"
                onClick={() => handleStart('upload')}
                className="w-full max-w-sm text-lg"
            >
                Upload Photo
            </Button>
             <Button variant="ghost" className="mt-4 font-bold text-accent hover:text-accent/80">
                Log In
            </Button>
        </div>
      </main>
    </div>
  );
}
