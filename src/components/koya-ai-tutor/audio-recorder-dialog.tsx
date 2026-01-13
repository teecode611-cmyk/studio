
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { WebmToWavConverter } from 'webm-to-wav-converter';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Mic, Square, Loader2, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AudioRecorderDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (audioDataUri: string) => void;
  isSubmitting: boolean;
}

export function AudioRecorderDialog({
  isOpen,
  onOpenChange,
  onSubmit,
  isSubmitting,
}: AudioRecorderDialogProps) {
  const { toast } = useToast();
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const waveformRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [hasPermission, setHasPermission] = useState(true);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setHasPermission(true);
      
      if (waveformRef.current) {
         if (!wavesurferRef.current) {
            wavesurferRef.current = WaveSurfer.create({
                container: waveformRef.current,
                waveColor: 'hsl(var(--primary))',
                progressColor: 'hsl(var(--accent))',
                barWidth: 3,
                barGap: 2,
                barRadius: 2,
                height: 100,
            });
         }
         wavesurferRef.current.load('');
      }

      mediaRecorderRef.current = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setRecordedBlob(blob);
        if (wavesurferRef.current) {
            wavesurferRef.current.load(URL.createObjectURL(blob));
        }
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordedBlob(null);

    } catch (error) {
      console.error('Error accessing microphone:', error);
      setHasPermission(false);
      toast({
        variant: 'destructive',
        title: 'Microphone Access Denied',
        description: 'Please enable microphone permissions in your browser settings.',
      });
      onOpenChange(false);
    }
  }, [toast, onOpenChange]);

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleRecordAgain = () => {
    setRecordedBlob(null);
    if(wavesurferRef.current) {
        wavesurferRef.current.empty();
    }
    startRecording();
  };

  const handleSubmit = async () => {
    if (!recordedBlob) return;
    try {
        const wavBlob = await new WebmToWavConverter().convert(recordedBlob);
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64data = reader.result as string;
            onSubmit(base64data);
        };
        reader.readAsDataURL(wavBlob);
    } catch (error) {
        handleError(error);
    }
  };

  const handleError = (error: unknown) => {
    console.error('Error processing audio:', error);
    toast({
        variant: 'destructive',
        title: 'Audio Processing Error',
        description: 'Could not process the recorded audio. Please try again.',
    });
  }

  useEffect(() => {
    if (isOpen) {
        // Reset state when dialog opens
        setRecordedBlob(null);
        setIsRecording(false);
        startRecording();
    } else {
        // Cleanup on close
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
        }
        if (wavesurferRef.current) {
            wavesurferRef.current.destroy();
            wavesurferRef.current = null;
        }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Record your Question</DialogTitle>
          <DialogDescription>
            Press the record button to start. When you're done, press stop and then submit.
          </DialogDescription>
        </DialogHeader>

        <div className="my-4">
            <div ref={waveformRef} className="w-full h-[100px]" />
        </div>

        <DialogFooter className='gap-2'>
          {!isRecording && recordedBlob ? (
            <>
              <Button variant="outline" onClick={handleRecordAgain} disabled={isSubmitting}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Record Again
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Submit
              </Button>
            </>
          ) : (
            <Button
              size="lg"
              className='w-full'
              onClick={isRecording ? stopRecording : startRecording}
              disabled={!hasPermission || isSubmitting}
            >
              {isRecording ? (
                <>
                  <Square className="mr-2 h-4 w-4" />
                  Stop Recording
                </>
              ) : (
                <>
                  <Mic className="mr-2 h-4 w-4" />
                  Start Recording
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

