'use client';

import { useEffect, useRef } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { SendHorizontal, Loader2, Bot } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { ChatMessage } from './chat-message';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
    <div className="flex h-full flex-col rounded-2xl border bg-card/80 p-4">
      <ScrollArea className="flex-1 -m-4" ref={scrollAreaRef}>
        <div className="space-y-6 p-4">
          {messages.map((msg, index) => (
            <ChatMessage key={index} message={msg} />
          ))}
          {isLoading && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
            <div className="flex items-end gap-3 justify-start">
              <Avatar className="h-9 w-9 border-2">
                <AvatarFallback className='bg-primary text-primary-foreground'>
                  <Bot className="h-6 w-6" />
                </AvatarFallback>
              </Avatar>
              <div className="max-w-md rounded-2xl p-4 whitespace-pre-wrap shadow-sm rounded-bl-none bg-primary text-primary-foreground">
                  <div className='flex gap-2 items-center'>
                    <Loader2 className="h-5 w-5 animate-spin"/>
                    <p className="text-base text-muted-foreground">Thinking...</p>
                  </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="mt-4">
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
                      placeholder="Send a message..."
                      autoComplete="off"
                      disabled={isLoading}
                      className="text-base rounded-full px-6 h-12"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit" size="icon" disabled={isLoading} aria-label="Send message" className='rounded-full h-10 w-10 bg-accent hover:bg-accent/90'>
              <SendHorizontal className="h-5 w-5 text-accent-foreground" />
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
