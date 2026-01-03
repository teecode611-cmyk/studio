// @/components/koya-ai-tutor/tutor-view.tsx
'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import {
  startSocraticSession,
  continueSocraticSession,
  getHintAction,
  getSummaryAction,
} from '@/app/actions';

import { Header } from './header';
import { ProblemForm } from './problem-form';
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
  const [stepByStepProgress, setStepByStepProgress] = useState<string | undefined>(undefined);
  const [hints, setHints] = useState<string[]>([]);
  const [summary, setSummary] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [isHintLoading, setIsHintLoading] = useState(false);
  const [isRecapLoading, setIsRecapLoading] = useState(false);
  const [isRecapOpen, setIsRecapOpen] = useState(false);

  const { toast } = useToast();

  const handleError = (error: unknown, defaultMessage: string) => {
    const message = error instanceof Error ? error.message : defaultMessage;
    toast({
      variant: 'destructive',
      title: 'An error occurred',
      description: message,
    });
  };

  const handleStartSession = async (newProblem: string) => {
    setIsLoading(true);
    try {
      const response = await startSocraticSession(newProblem);
      setProblem(newProblem);
      setMessages([
        { role: 'user', content: newProblem },
        { role: 'assistant', content: response.question },
      ]);
      setStepByStepProgress(response.updatedStepByStepProgress);
      setSessionState('active');
    } catch (error) {
      handleError(error, 'Could not start the session.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (response: string) => {
    setIsLoading(true);
    setMessages((prev) => [...prev, { role: 'user', content: response }]);
    try {
      const result = await continueSocraticSession({
        problem,
        studentResponse: response,
        stepByStepProgress,
      });
      setMessages((prev) => [...prev, { role: 'assistant', content: result.question }]);
      setStepByStepProgress(result.updatedStepByStepProgress);
    } catch (error) {
      handleError(error, 'Could not get a response.');
      setMessages((prev) => prev.slice(0, -1)); // Remove user message on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetHint = async () => {
    setIsHintLoading(true);
    try {
      const result = await getHintAction({
        question: problem,
        studentAnswer: messages.filter(m => m.role === 'user').pop()?.content,
        previousHints: hints,
      });
      setMessages((prev) => [...prev, { role: 'hint', content: result.hint }]);
      setHints((prev) => [...prev, result.hint]);
    } catch (error) {
      handleError(error, 'Could not retrieve a hint.');
    } finally {
      setIsHintLoading(false);
    }
  };

  const handleEndSession = async () => {
    setIsRecapLoading(true);
    try {
      const dialogue = messages
        .map((m) => `${m.role === 'user' ? 'Student' : 'Tutor'}: ${m.content}`)
        .join('\n');
      const result = await getSummaryAction(dialogue);
      setSummary(result.summary);
      setIsRecapOpen(true);
    } catch (error) {
      handleError(error, 'Could not generate a session recap.');
    } finally {
      setIsRecapLoading(false);
    }
  };

  const resetSession = () => {
    setSessionState('idle');
    setMessages([]);
    setProblem('');
    setStepByStepProgress(undefined);
    setHints([]);
    setSummary('');
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
                  progress={stepByStepProgress}
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
      <RecapDialog isOpen={isRecapOpen} onOpenChange={resetSession} summary={summary} />
    </div>
  );
}
