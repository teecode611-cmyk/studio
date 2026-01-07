'use client';

import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, ArrowLeft } from 'lucide-react';

const formSchema = z.object({
  problem: z.string().min(1, "Please enter a problem or question."),
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
}

export function ProblemForm({ onSubmit, isLoading, onBack }: ProblemFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      problem: '',
    },
  });

  const handleFormSubmit: SubmitHandler<FormValues> = async (data) => {
    onSubmit({ problem: data.problem });
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
