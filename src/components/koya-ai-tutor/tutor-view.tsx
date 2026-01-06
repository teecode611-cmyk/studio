'use client';

import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import {
  startSocraticSession,
  continueSocraticSession,
  getHintAction,
  getSummaryAction,
} from '@/app/actions';
import type { StartSessionOutput } from '@/ai/flows/start-session';
import { useAuth, useUser } from '@/firebase';
import { initiateEmailSignIn, initiateEmailSignUp } from '@/firebase/non-blocking-login';
import { errorEmitter } from '@/firebase/error-emitter';

import { Header } from './header';
import { ProblemForm, type ProblemSubmitData } from './problem-form';
import { ChatPanel } from './chat-panel';
import { SidebarPanel } from './sidebar-panel';
import { RecapDialog } from './recap-dialog';
import { AuthDialog, type AuthSubmitData } from './auth-dialog';
import { onAuthStateChanged } from 'firebase/auth';

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

  // Auth-related state
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [pendingProblem, setPendingProblem] = useState<ProblemSubmitData | null>(null);

  const { toast } = useToast();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();

  const handleError = useCallback((title: string, error: unknown) => {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred.';
    toast({
      variant: 'destructive',
      title,
      description: message,
    });
    // Reset all loading states
    setIsLoading(false);
    setIsAuthLoading(false);
    setIsHintLoading(false);
    setIsRecapLoading(false);
  }, [toast]);

  const handleStartSession = useCallback(async (data: ProblemSubmitData) => {
    setIsLoading(true);
    setPendingProblem(null); // Clear pending problem

    try {
      const response: StartSessionOutput = await startSocraticSession(data);
      
      const userMessageText = data.imageDataUri 
        ? data.problem 
          ? `I've uploaded an image and here's my question: ${data.problem}`
          : 'I have uploaded an image of my problem.' 
        : data.problem!;

      const problemDescription = data.problem || 'the uploaded image';
      
      setProblem(problemDescription);
      setMessages([
        { role: 'user', content: userMessageText },
        { role: 'assistant', content: response.question },
      ]);
      setStepByStepProgress(response.initialProgress);
      setSessionState('active');
    } catch (error) {
      handleError('Could not start session', error);
      setSessionState('idle');
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);
  
  // This is the entry point from the problem form
  const triggerAuthOrStartSession = useCallback((data: ProblemSubmitData) => {
    if (user) {
      handleStartSession(data);
    } else {
      setPendingProblem(data);
      setIsAuthDialogOpen(true);
    }
  }, [user, handleStartSession]);
  
  const handleAuthSubmit = useCallback(async (data: AuthSubmitData) => {
    setIsAuthLoading(true);
    try {
      if (data.type === 'signup') {
        await initiateEmailSignUp(auth, data.email, data.password);
      } else {
        await initiateEmailSignIn(auth, data.email, data.password);
      }
      // onAuthStateChanged will handle the rest
    } catch (error) {
      handleError('Authentication Failed', error)
    } finally {
      setIsAuthLoading(false);
    }
  }, [auth, handleError]);

  // Effect to listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser && pendingProblem) {
        // User has logged in and there is a pending session to start
        setIsAuthDialogOpen(false);
        handleStartSession(pendingProblem);
      }
    });
    return () => unsubscribe();
  }, [auth, pendingProblem, handleStartSession]);

  const handleSendMessage = async (response: string) => {
    setIsLoading(true);
    const newMessages: Message[] = [...messages, { role: 'user', content: response }];
    setMessages(newMessages);

    try {
      const result = await continueSocraticSession({
        problem,
        studentResponse: response,
        stepByStepProgress,
      });
      setMessages((prev) => [...prev, { role: 'assistant', content: result.question }]);
      if (result.updatedStepByStepProgress) {
        setStepByStepProgress(result.updatedStepByStepProgress);
      }
    } catch (error) {
      handleError('Could not get response', error);
      setMessages(messages); // Revert messages on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetHint = async () => {
    setIsHintLoading(true);
    try {
      const result = await getHintAction({
        question: problem,
        studentAnswer: messages.findLast(m => m.role === 'user')?.content,
        previousHints: hints,
      });
      setMessages((prev) => [...prev, { role: 'hint', content: result.hint }]);
      setHints((prev) => [...prev, result.hint]);
    } catch (error) {
      handleError('Could not get hint', error);
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
      handleError('Could not generate recap', error);
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
    setPendingProblem(null);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {sessionState === 'idle' ? (
          <ProblemForm onSubmit={triggerAuthOrStartSession} isLoading={isLoading || isUserLoading || isAuthLoading} />
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
      <AuthDialog 
        isOpen={isAuthDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsAuthDialogOpen(false);
            setIsAuthLoading(false);
            setPendingProblem(null); // Clear pending data if dialog is closed
          } else {
            setIsAuthDialogOpen(true);
          }
        }}
        onSubmit={handleAuthSubmit}
        isLoading={isAuthLoading}
      />
    </div>
  );
}
