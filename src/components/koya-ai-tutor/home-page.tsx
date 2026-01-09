
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Camera, Keyboard, Mic, MessageSquare, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PlaceHolderImages } from '@/lib/placeholder-images';

interface HomePageProps {
  onStartProblem: () => void;
  onStartUpload: () => void;
  onGoToAccount: () => void;
}

export function HomePage({ onStartProblem, onStartUpload, onGoToAccount }: HomePageProps) {
  const [activeTab, setActiveTab] = useState<'ask' | 'profile' | null>(null);
  const heroImage = PlaceHolderImages.find(p => p.id === 'socratic-ai-hero-lightbulb');

  const handleAskClick = () => {
    // Toggle input methods visibility, don't navigate away
    setActiveTab(activeTab === 'ask' ? null : 'ask');
  };

  const handleProfileClick = () => {
    setActiveTab('profile');
    onGoToAccount();
  };

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden">
      {/* Hero Image and Gradient */}
      <div className="absolute inset-0">
        {heroImage && 
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover"
            data-ai-hint={heroImage.imageHint}
            priority
          />
        }
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      </div>

      {/* Main Content */}
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center p-4 text-center text-white">
        <h1 className="text-5xl font-bold">Guidance. Not Answers.</h1>
        <p className="mt-2 text-xl">What can I help you understand today?</p>
      </main>

      {/* Top Input Icons (conditionally rendered) */}
      {activeTab === 'ask' && (
        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20 flex gap-8 rounded-full bg-black/30 p-4 backdrop-blur-sm">
          <button onClick={onStartProblem} className="flex flex-col items-center gap-2 text-white">
            <Keyboard size={32} />
            <span className="text-xs">Keyboard</span>
          </button>
          <button onClick={onStartUpload} className="flex flex-col items-center gap-2 text-white">
            <Camera size={32} />
            <span className="text-xs">Camera</span>
          </button>
          <button className="flex flex-col items-center gap-2 text-white opacity-50 cursor-not-allowed">
            <Mic size={32} />
            <span className="text-xs">Voice</span>
          </button>
        </div>
      )}

      {/* Bottom Navigation */}
      <footer className="relative z-20 mt-auto">
        <div className="mx-auto grid h-20 max-w-sm grid-cols-2 items-center gap-4 bg-accent p-2">
          <button
            onClick={handleAskClick}
            className={cn(
              'flex h-full flex-col items-center justify-center gap-1 rounded-lg text-primary transition-colors',
              activeTab === 'ask' ? 'bg-primary/10' : ''
            )}
          >
            <MessageSquare size={24} />
            <span className="text-xs font-bold">Ask</span>
          </button>
          <button
            onClick={handleProfileClick}
            className={cn(
              'flex h-full flex-col items-center justify-center gap-1 rounded-lg text-primary transition-colors',
              activeTab === 'profile' ? 'bg-primary/10' : ''
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
