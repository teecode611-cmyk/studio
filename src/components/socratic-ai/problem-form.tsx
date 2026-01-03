// @/components/socratic-ai/problem-form.tsx
'use client';

import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  problem: z.string().min(20, {
    message: 'Please describe your problem in at least 20 characters.',
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface ProblemFormProps {
  onSubmit: (problem: string) => void;
  isLoading: boolean;
}

export function ProblemForm({ onSubmit, isLoading }: ProblemFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      problem: '',
    },
  });

  const handleFormSubmit: SubmitHandler<FormValues> = (data) => {
    onSubmit(data.problem);
  };

  return (
    <div className="flex h-[calc(100vh-4rem-1px)] items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Welcome to SocraticAI</CardTitle>
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
                    <FormLabel className="text-lg">Your Problem</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="For example: 'How do I prove that the sum of angles in a triangle is 180 degrees?'"
                        className="min-h-[120px] resize-none text-base"
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
