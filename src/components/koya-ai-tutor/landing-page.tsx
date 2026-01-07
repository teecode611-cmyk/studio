'use client';

import { Button } from '@/components/ui/button';
import { Keyboard, Camera } from 'lucide-react';

const KoyaLogo = () => (
    <div className="flex flex-col items-center">
        <svg
            width="80"
            height="80"
            viewBox="0 0 80 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <circle cx="40" cy="40" r="40" fill="#355E3B" />
            <path
            d="M27 52.5V27.5H32.75V41.75L42.75 27.5H48.5L37.75 40L49 52.5H43.25L34.25 42.5L32.75 44V52.5H27Z"
            fill="#FDFCEC"
            />
            <path
            d="M40 21.25C41.3807 21.25 42.5 20.1307 42.5 18.75C42.5 17.3693 41.3807 16.25 40 16.25C38.6193 16.25 37.5 17.3693 37.5 18.75C37.5 20.1307 38.6193 21.25 40 21.25Z"
            fill="#D4AF37"
            />
        </svg>
    </div>
);

interface LandingPageProps {
  onStartProblem: (mode: 'text' | 'upload') => void;
  onStartUpload: () => void;
}


export function LandingPage({ onStartProblem, onStartUpload }: LandingPageProps) {

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
                onClick={() => onStartProblem('text')}
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
             <Button variant="ghost" className="mt-4 font-bold text-accent hover:text-accent/80">
                Log In
            </Button>
        </div>
      </main>
    </div>
  );
}
