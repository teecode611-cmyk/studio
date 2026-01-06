'use client';

import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

import { Header } from './header';
import { ProblemForm, type ProblemSubmitData } from './problem-form';
import { ChatPanel } from './chat-panel';
import { SidebarPanel } from './sidebar-panel';
import { RecapDialog } from './recap-dialog';

export type Message = {
  role: 'user' | 'assistant' | 'hint';
  content: string;
};

type SessionState = 'idle' | 'active';

export function TutorView() {
  const [sessionState, setSessionState] = useState<SessionState>('idle');
  const [messages, setMessages] = useState<Message[]>([]);
  const [problem, setProblem] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [isHintLoading, setIsHintLoading] = useState(false);
  const [isRecapLoading, setIsRecapLoading] = useState(false);
  const [isRecapOpen, setIsRecapOpen] = useState(false);

  const { toast } = useToast();

  const handleError = useCallback((title: string, error: unknown) => {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred.';
    toast({
      variant: 'destructive',
      title,
      description: message,
    });
    // Reset all loading states
    setIsLoading(false);
    setIsHintLoading(false);
    setIsRecapLoading(false);
  }, [toast]);


  const handleStartSession = useCallback(async (data: ProblemSubmitData) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    try {
      const problemDescription = data.problem || 'the uploaded image';
      setProblem(problemDescription);
      setMessages([
        { role: 'user', content: data.problem || "I've uploaded an image." },
        { role: 'assistant', content: "This is an interesting problem. What have you tried so far?" }
      ]);
      setSessionState('active');
    } catch (error) {
      handleError('Could not start session', error);
      setSessionState('idle');
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);
  
  const handleSendMessage = async (response: string) => {
    setIsLoading(true);
    
    const optimisticMessages: Message[] = [...messages, { role: 'user', content: response }];
    setMessages(optimisticMessages);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
        setMessages([...optimisticMessages, { role: 'assistant', content: "That's a great next step. What would you do after that?"}])
    } catch (error) {
      handleError('Could not get response', error);
      setMessages(messages); // Revert on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetHint = async () => {
    setIsHintLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 700));
    try {
      setMessages([...messages, { role: 'hint', content: 'Try thinking about the relationship between the different parts of the problem.' }]);
    } catch (error) {
      handleError('Could not get hint', error);
    } finally {
      setIsHintLoading(false);
    }
  };

  const handleEndSession = async () => {
    setIsRecapLoading(true);
     // Simulate API call
     await new Promise(resolve => setTimeout(resolve, 1000));
    try {
      setIsRecapOpen(true);
    } catch (error) {
      handleError('Could not generate recap', error);
    } finally {
      setIsRecapLoading(false);
    }
  };

  const resetSession = () => {
    setSessionState('idle');
    setMessages([]);
    setProblem('');
    setIsRecapOpen(false);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {sessionState === 'idle' ? (
          <ProblemForm onSubmit={handleStartSession} isLoading={isLoading} />
        ) : (
          <div className="container mx-auto p-4 lg:p-6 h-[calc(100vh-4rem-1px)]">
            <div className="grid h-full lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 h-full">
                <ChatPanel
                  messages={messages}
                  isLoading={isLoading}
                  onSendMessage={handleSendMessage}
                  problem={problem}
                />
              </div>
              <div className="hidden lg:block">
                <SidebarPanel
                  progress={"1. Understand the problem.\n2. Devise a plan."}
                  onGetHint={handleGetHint}
                  onEndSession={handleEndSession}
                  isHintLoading={isHintLoading}
                  isRecapLoading={isRecapLoading}
                />
              </div>
            </div>
          </div>
        )}
      </main>
      <RecapDialog isOpen={isRecapOpen} onOpenChange={resetSession} summary={"- You learned how to start a new session.\n- You practiced sending messages."} />
    </div>
  );
}
