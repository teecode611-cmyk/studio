'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Loader2, ArrowLeft, Camera, RefreshCw } from 'lucide-react';
import type { ProblemSubmitData } from './problem-form';

const formSchema = z.object({
  problem: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ProblemUploadFormProps {
  onSubmit: (data: ProblemSubmitData) => void;
  isLoading: boolean;
  onBack: () => void;
}

export function ProblemUploadForm({ onSubmit, isLoading, onBack }: ProblemUploadFormProps) {
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      problem: '',
    },
  });

  const getCameraPermission = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setHasCameraPermission(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setHasCameraPermission(false);
      toast({
        variant: 'destructive',
        title: 'Camera Access Denied',
        description: 'Please enable camera permissions in your browser settings to use this feature.',
      });
    }
  }, [toast]);

  useEffect(() => {
    if (!capturedImage) {
      getCameraPermission();
    }
    
    return () => {
        // Stop camera stream when component unmounts or view changes
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
    }
  }, [capturedImage, getCameraPermission]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const dataUri = canvas.toDataURL('image/png');
        setCapturedImage(dataUri);
      }
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    form.reset();
  };

  const handleFormSubmit: SubmitHandler<FormValues> = async (data) => {
    if (!capturedImage) {
      toast({
        variant: 'destructive',
        title: 'No Image Captured',
        description: 'Please take a photo before submitting.',
      });
      return;
    }
    onSubmit({ problem: data.problem || 'Please analyze the attached image.', imageDataUri: capturedImage });
  };

  return (
    <div className="flex h-screen items-center justify-center p-4 bg-[#FDFCEC]">
      <Button variant="ghost" onClick={onBack} className="absolute top-6 left-6 text-lg">
        <ArrowLeft className="mr-2 h-5 w-5" />
        Back
      </Button>
      <Card className="w-full max-w-2xl shadow-lg bg-card/80">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Upload a Problem</CardTitle>
          <CardDescription>
            Take a picture of the problem. You can add an optional question.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 aspect-video w-full overflow-hidden rounded-md border-2 border-accent bg-input">
            {hasCameraPermission === null && (
              <div className="flex h-full w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            )}

            {hasCameraPermission === false && (
              <div className="flex h-full w-full items-center justify-center p-4">
                 <Alert variant="destructive">
                    <AlertTitle>Camera Access Required</AlertTitle>
                    <AlertDescription>
                        Please allow camera access to use this feature. You may need to refresh the page and grant permission.
                    </AlertDescription>
                </Alert>
              </div>
            )}
            
            {capturedImage ? (
                <img src={capturedImage} alt="Captured problem" className="h-full w-full object-contain" />
            ): (
                <video ref={videoRef} className="h-full w-full object-cover" autoPlay playsInline muted />
            )}
            <canvas ref={canvasRef} className="hidden" />
          </div>

           <div className="mb-6 flex justify-center gap-4">
                {capturedImage ? (
                    <Button variant="outline" onClick={handleRetake} className="w-full max-w-xs text-lg">
                        <RefreshCw className="mr-2 h-5 w-5" />
                        Retake Photo
                    </Button>
                ) : (
                    <Button onClick={handleCapture} disabled={!hasCameraPermission} className="w-full max-w-xs text-lg">
                        <Camera className="mr-2 h-5 w-5" />
                        Take Photo
                    </Button>
                )}
            </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="problem"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Optional: Ask a specific question</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="For example: 'Why does this step work?' or 'What concept is this related to?'"
                        className="min-h-[100px] resize-none text-base"
                        disabled={!capturedImage}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full text-lg py-6" disabled={isLoading || !capturedImage}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Starting Session...
                  </>
                ) : (
                  'Start Learning Session'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

