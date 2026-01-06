'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, UploadCloud, ArrowLeft } from 'lucide-react';
import Image from 'next/image';

const formSchema = z.object({
  problem: z.string(),
  image: z.instanceof(File).optional(),
}).refine(data => data.problem || data.image, {
  message: "Please either describe the problem or upload an image.",
  path: ["problem"],
});


type FormValues = z.infer<typeof formSchema>;

export interface ProblemSubmitData {
  problem: string;
  imageDataUri?: string;
}

interface ProblemFormProps {
  onSubmit: (data: ProblemSubmitData) => void;
  isLoading: boolean;
  onBack: () => void;
  defaultMode: 'text' | 'upload';
}

export function ProblemForm({ onSubmit, isLoading, onBack, defaultMode }: ProblemFormProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      problem: '',
    },
  });

  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });

  const handleFormSubmit: SubmitHandler<FormValues> = async (data) => {
    let imageDataUri: string | undefined = undefined;
    if (data.image) {
      imageDataUri = await toBase64(data.image);
    }
    onSubmit({ problem: data.problem, imageDataUri });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue('image', file);
      form.clearErrors("problem"); // Clear error when image is selected
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
      form.setValue('image', undefined);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center p-4 bg-[#FDFCEC]">
       <Button
          variant="ghost"
          onClick={onBack}
          className="absolute top-6 left-6 text-lg"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back
        </Button>
      <Card className="w-full max-w-2xl shadow-lg bg-card/80">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">What's the problem?</CardTitle>
          <CardDescription>
            Enter a problem or question you need help with. Your AI tutor will guide you to the solution without giving away the answer.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
              <Tabs defaultValue={defaultMode} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="text">Type Question</TabsTrigger>
                  <TabsTrigger value="upload">Upload Photo</TabsTrigger>
                </TabsList>
                <TabsContent value="text" className="pt-4">
                  <FormField
                    control={form.control}
                    name="problem"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg sr-only">Your Problem</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="For example: 'How do I prove that the sum of angles in a triangle is 180 degrees?'"
                            className="min-h-[150px] resize-none text-base"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
                <TabsContent value="upload" className="pt-4">
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <FormField
                      control={form.control}
                      name="image"
                      render={() => (
                        <FormItem>
                          <FormLabel className="text-lg sr-only">Upload an Image</FormLabel>
                          <FormControl>
                            <div className="relative flex justify-center items-center w-full h-full min-h-[150px] px-8 py-10 border-2 border-dashed rounded-md">
                              <div className="text-center">
                                {imagePreview ? (
                                  <Image
                                    src={imagePreview}
                                    alt="Problem preview"
                                    width={200}
                                    height={200}
                                    className="max-h-40 w-auto rounded-md object-contain"
                                  />
                                ) : (
                                  <>
                                    <UploadCloud className="w-12 h-12 mx-auto text-muted-foreground" />
                                    <p className="mt-4 text-sm text-muted-foreground">
                                      Drag and drop, or click to browse.
                                    </p>
                                  </>
                                )}
                              </div>
                              <Input
                                type="file"
                                accept="image/*"
                                className="absolute inset-0 z-10 w-full h-full opacity-0 cursor-pointer"
                                onChange={handleImageChange}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="problem"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='text-lg sr-only'>Optional: Add a description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Optionally, add more context about the problem in the image."
                              className="min-h-[150px] resize-none text-base"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>
              </Tabs>
              
              <Button type="submit" className="w-full text-lg py-6" disabled={isLoading}>
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
