
'use client';

import { Button } from '@/components/ui/button';
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
                d="M47.25,32.26a15.25,15.25,0,0,1-30.5,0"
                fill="none"
                stroke="#FDFCEC"
                strokeWidth="5"
                strokeLinecap="round"
            />
            <path
                d="M32,17a15.25,15.25,0,0,1,0,30.5"
                fill="none"
                stroke="#FDFCEC"
                strokeWidth="5"
                strokeLinecap="round"
            />
            <circle cx="32" cy="32" r="7.5" fill="#D4AF37" />
        </svg>
    </div>
);

interface LandingPageProps {
  onStartProblem: () => void;
  onStartUpload: () => void;
  onTriggerAuth: () => void;
}


export function LandingPage({ onStartProblem, onStartUpload, onTriggerAuth }: LandingPageProps) {

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
                onClick={() => onStartProblem()}
                className="w-full max-w-sm text-lg"
            >
                <Keyboard className="h-5 w-5 text-accent" />
                Type Question
            </Button>
            <Button
                size="lg"
                variant="outline"
                onClick={onStartUpload}
                className="w-full max-w-sm text-lg"
            >
                <Camera className="h-5 w-5 text-accent" />
                Upload Photo
            </Button>
             <Button variant="ghost" className="mt-4 font-bold text-accent hover:text-accent/80" onClick={onTriggerAuth}>
                Log In
            </Button>
        </div>
      </main>
    </div>
  );
}
