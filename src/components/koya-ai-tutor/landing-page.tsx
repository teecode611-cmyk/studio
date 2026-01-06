'use client';

import { useState }from 'react';
import { Button } from '@/components/ui/button';
import { ProblemForm } from './problem-form';
import { useRouter } from 'next/navigation';
import { Keyboard, Camera } from 'lucide-react';

const KoyaLogo = () => (
    <div className="flex flex-col items-center">
        <svg
            width="80"
            height="80"
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
    </div>
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
             <p className="mt-4 text-lg font-bold text-accent">
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
                <Camera className="h-5 w-5 text-accent" />
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
