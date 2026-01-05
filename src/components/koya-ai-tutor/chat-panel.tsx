// @/components/koya-ai-tutor/chat-panel.tsx
'use client';

import { useEffect, useRef } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { SendHorizontal, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { ChatMessage } from './chat-message';
import type { Message } from './tutor-view';

const formSchema = z.object({
  response: z.string().min(1),
});

type FormValues = z.infer<typeof formSchema>;

interface ChatPanelProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
  problem: string;
}

export function ChatPanel({ messages, isLoading, onSendMessage, problem }: ChatPanelProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { response: '' },
  });

  const handleFormSubmit: SubmitHandler<FormValues> = (data) => {
    onSendMessage(data.response);
    form.reset();
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle className="font-headline text-xl">
          Current Problem: <span className="font-normal font-body">{problem}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col p-0">
        <ScrollArea className="flex-1" ref={scrollAreaRef}>
          <div className="space-y-6 p-6">
            {messages.map((msg, index) => (
              <ChatMessage key={index} message={msg} />
            ))}
            {isLoading && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
              <div className="flex items-start gap-4 justify-start">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border bg-secondary text-primary">
                    <Loader2 className="h-5 w-5 animate-spin"/>
                  </div>
                  <div className="max-w-xl rounded-lg border bg-card p-4 rounded-tl-none">
                    <p className="text-base text-muted-foreground">Thinking...</p>
                  </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <div className="border-t p-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleFormSubmit)}
              className="flex items-center gap-2"
            >
              <FormField
                control={form.control}
                name="response"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input
                        placeholder="Type your response..."
                        autoComplete="off"
                        disabled={isLoading}
                        className="text-base"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit" size="icon" disabled={isLoading} aria-label="Send message">
                <SendHorizontal className="h-5 w-5" />
              </Button>
            </form>
          </Form>
        </div>
      </CardContent>
    </Card>
  );
}
