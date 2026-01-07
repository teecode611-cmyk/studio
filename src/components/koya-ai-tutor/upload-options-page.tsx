'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, Camera, Image } from 'lucide-react';

interface UploadOptionsPageProps {
    onBack: () => void;
    onSelectUpload: () => void;
}

export function UploadOptionsPage({ onBack, onSelectUpload }: UploadOptionsPageProps) {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-[#FDFCEC] p-4">
      <Button
        variant="ghost"
        onClick={onBack}
        className="absolute top-6 left-6 text-lg"
      >
        <ArrowLeft className="mr-2 h-5 w-5" />
        Back
      </Button>

      <div className="w-full max-w-sm text-center">
        <h1 className="font-headline text-3xl font-bold text-foreground">
          Koya AI Tutor
        </h1>
        <h2 className="mt-1 font-headline text-2xl text-foreground">
          What can I help you understand today?
        </h2>

        <div className="mt-8 space-y-4">
          <Button
            onClick={onSelectUpload}
            className="h-auto w-full flex-col gap-3 rounded-2xl bg-primary py-8 text-primary-foreground shadow-lg hover:bg-primary/90"
          >
            <Camera className="h-12 w-12 text-accent" />
            <span className="text-xl font-bold">Take Photo</span>
          </Button>

          <Button
            onClick={() => {}} // Placeholder for gallery selection
            className="h-auto w-full flex-col gap-3 rounded-2xl bg-primary py-8 text-primary-foreground shadow-lg hover:bg-primary/90"
          >
            <Image className="h-12 w-12 text-accent" />
            <span className="text-xl font-bold">Select from Gallery</span>
          </Button>
        </div>

        <Button
            size="lg"
            variant="secondary"
            className="mt-8 w-full text-lg"
            onClick={onSelectUpload}
        >
            Start Learning Session
        </Button>
      </div>
    </div>
  );
}
