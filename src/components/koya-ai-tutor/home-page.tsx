'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Camera, Keyboard, Mic, MessageSquare, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { KoyaCat } from './koya-cat';

interface HomePageProps {
  onStartProblem: () => void;
  onStartUpload: () => void;
  onStartVoice: () => void;
  onGoToAccount: () => void;
}

export function HomePage({ onStartProblem, onStartUpload, onStartVoice, onGoToAccount }: HomePageProps) {
  const [activeTab, setActiveTab] = useState<'ask' | 'profile' | null>(null);

  const handleAskClick = () => {
    setActiveTab(activeTab === 'ask' ? null : 'ask');
  };

  const handleProfileClick = () => {
    setActiveTab('profile');
    onGoToAccount();
  };

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-accent">
      {/* Decorative Bubbles */}
      <div className="absolute inset-0 z-0 opacity-50">
        <div className="absolute top-[10%] left-[5%] h-32 w-32 rounded-full bg-primary/30 animate-blob" />
        <div className="absolute top-[20%] right-[10%] h-24 w-24 rounded-full bg-primary/20 animate-blob [animation-delay:2000ms]" />
        <div className="absolute bottom-[15%] left-[20%] h-48 w-48 rounded-full bg-primary/40 animate-blob [animation-delay:4000ms]" />
        <div className="absolute bottom-[5%] right-[25%] h-16 w-16 rounded-full bg-primary/30 animate-blob [animation-delay:1000ms]" />
        <div className="absolute top-[50%] left-[40%] h-20 w-20 rounded-full bg-primary/20 animate-blob [animation-delay:3000ms]" />
      </div>

      {/* Wavy Line SVG */}
      <svg
        className="absolute top-0 right-0 z-10 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 800"
        preserveAspectRatio="xMidYMid slice"
      >
        <path
          d="M-200 800 C 400 400, 1000 1000, 1500 100"
          stroke="hsl(var(--primary))"
          strokeWidth="10"
          fill="none"
        />
      </svg>

      {/* Main Content */}
      <main className="relative z-20 flex flex-1 flex-col items-center p-4 text-center text-white">
        <div className="mt-[25vh] flex flex-col items-center">
          <KoyaCat />
          <div className="h-8" /> {/* Spacer */}
          <h1 className="text-5xl font-bold uppercase tracking-tight text-primary-foreground drop-shadow-lg">
            GUIDANCE. NOT ANSWERS.
          </h1>
          <p className="mt-4 text-xl font-medium text-primary-foreground/90 drop-shadow-md">
            What can I help you understand today?
          </p>
        </div>
      </main>

      {/* Top Input Icons (conditionally rendered) */}
      {activeTab === 'ask' && (
        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-30 flex gap-8 rounded-full bg-black/30 p-4 backdrop-blur-sm">
          <button onClick={onStartProblem} className="flex flex-col items-center gap-2 text-primary-foreground">
            <Keyboard size={32} />
            <span className="text-xs">Keyboard</span>
          </button>
          <button onClick={onStartUpload} className="flex flex-col items-center gap-2 text-primary-foreground">
            <Camera size={32} />
            <span className="text-xs">Camera</span>
          </button>
          <button onClick={onStartVoice} className="flex flex-col items-center gap-2 text-primary-foreground">
            <Mic size={32} />
            <span className="text-xs">Voice</span>
          </button>
        </div>
      )}

      {/* Bottom Navigation */}
      <footer className="fixed bottom-4 left-0 right-0 z-30 p-4">
        <div className="mx-auto grid h-20 max-w-sm grid-cols-2 items-center gap-4 rounded-2xl bg-primary p-2 shadow-2xl">
          <button
            onClick={handleAskClick}
            className={cn(
              'flex h-full flex-col items-center justify-center gap-1 rounded-xl text-accent transition-colors',
              activeTab === 'ask' ? 'bg-black/20' : ''
            )}
          >
            <MessageSquare size={24} />
            <span className="text-xs font-bold">Ask</span>
          </button>
          <button
            onClick={handleProfileClick}
            className={cn(
              'flex h-full flex-col items-center justify-center gap-1 rounded-xl text-accent transition-colors',
              activeTab === 'profile' ? 'bg-black/20' : ''
            )}
          >
            <User size={24} />
            <span className="text-xs font-bold">Profile</span>
          </button>
        </div>
      </footer>
    </div>
  );
}
