'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Camera, Keyboard, Mic, MessageSquare, User, Square, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAudioRecorder } from '@/hooks/use-audio-recorder';
import { KoyaCat } from './koya-cat';

interface HomePageProps {
  onStartProblem: (initialValue?: string) => void;
  onStartUpload: () => void;
  onGoToAccount: () => void;
}

export function HomePage({ onStartProblem, onStartUpload, onGoToAccount }: HomePageProps) {
  const [activeTab, setActiveTab] = useState<'ask' | 'profile' | null>(null);

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
      {/* Background Image */}
      <Image
        src="/background.png"
        alt="Abstract background"
        fill
        className="object-cover"
        priority
      />
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Main Content */}
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center p-4 text-center text-white">
        <KoyaCat className="h-48 w-48 animate-bob" />
        <h1 className="mt-8 text-5xl font-bold uppercase">
          GUIDANCE. NOT ANSWERS.
        </h1>
        <p className="mt-4 text-xl">
          What can I help you understand today?
        </p>
      </main>

      {/* Top Input Icons (conditionally rendered) */}
      {activeTab === 'ask' && (
        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20 flex gap-8 rounded-full bg-black/30 p-4 backdrop-blur-sm">
          <button onClick={() => onStartProblem()} className="flex flex-col items-center gap-2 text-white">
            <Keyboard size={32} />
            <span className="text-xs">Keyboard</span>
          </button>
          <button onClick={onStartUpload} className="flex flex-col items-center gap-2 text-white">
            <Camera size={32} />
            <span className="text-xs">Camera</span>
          </button>
          <VoiceButton onTranscriptReady={(text) => onStartProblem(text)} />
        </div>
      )}

      {/* Bottom Navigation */}
      <footer className="fixed bottom-4 left-1/2 -translate-x-1/2 z-20">
        <div className="mx-auto grid h-20 w-80 max-w-sm grid-cols-2 items-center gap-4 rounded-2xl bg-primary p-2 shadow-2xl">
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

function VoiceButton({ onTranscriptReady }: { onTranscriptReady: (text: string) => void }) {
  const { isRecording, isTranscribing, startRecording, stopRecording, transcript, error } = useAudioRecorder();

  useEffect(() => {
    if (transcript) {
      onTranscriptReady(transcript);
    }
  }, [transcript, onTranscriptReady]);

  if (isTranscribing) {
    return (
      <div className="flex flex-col items-center gap-2 text-white">
        <Loader2 size={32} className="animate-spin" />
        <span className="text-xs">Transcribing...</span>
      </div>
    );
  }

  if (isRecording) {
    return (
      <button onClick={stopRecording} className="flex flex-col items-center gap-2 text-red-500 animate-pulse">
        <Square size={32} fill="currentColor" />
        <span className="text-xs">Stop</span>
      </button>
    );
  }

  return (
    <button onClick={startRecording} className="flex flex-col items-center gap-2 text-white">
      <Mic size={32} />
      <span className="text-xs">Voice</span>
      {error && <span className="absolute -bottom-6 text-[10px] text-red-400 w-32">{error}</span>}
    </button>
  );
}
