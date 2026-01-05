'use client';

import { useState, useEffect, useCallback } from 'react';
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

export type Message = {
  role: 'user' | 'assistant' | 'hint';
  content: string;
};

type SessionState = 'idle' | 'active';

export function TutorView() {
  const [sessionState, setSessionState] = useState<SessionState>('idle');
  const [messages, setMessages] = useState<Message[]>([]);
  const [problem, setProblem] = useState('');
  const [problemData, setProblemData] = useState<ProblemSubmitData | null>(null);
  const [stepByStepProgress, setStepByStepProgress] = useState<string | undefined>(undefined);
  const [hints, setHints] = useState<string[]>([]);
  const [summary, setSummary] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [isHintLoading, setIsHintLoading] = useState(false);
  const [isRecapLoading, setIsRecapLoading] = useState(false);
  const [isRecapOpen, setIsRecapOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const { toast } = useToast();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();

  const handleError = useCallback((error: unknown, defaultMessage: string) => {
    const message = error instanceof Error ? error.message : defaultMessage;
    toast({
      variant: 'destructive',
      title: 'An error occurred',
      description: message,
    });
  }, [toast]);

  const handleStartSession = useCallback(async (data: ProblemSubmitData) => {
    setIsLoading(true);
    try {
      const response: StartSessionOutput = await startSocraticSession(data);
      setProblem(data.problem || 'the uploaded image');
      setMessages([
        { role: 'user', content: data.problem || 'I uploaded an image of my problem.' },
        { role: 'assistant', content: response.question },
      ]);
      setStepByStepProgress(response.updatedStepByStepProgress);
      setSessionState('active');
    } catch (error) {
      handleError(error, 'Could not start the session.');
      // If starting fails, go back to idle so user can try again
      setSessionState('idle');
    } finally {
      setIsLoading(false);
      setProblemData(null); // Clear pending problem data
    }
  }, [handleError]);

  useEffect(() => {
    const handleAuthError = (error: Error) => {
      handleError(error, 'Authentication failed.');
      setIsAuthLoading(false); // Reset loading state on auth error
    };
    
    errorEmitter.on('auth-error', handleAuthError);

    return () => {
      errorEmitter.off('auth-error', handleAuthError);
    };
  }, [handleError]);
  
  // This effect runs once the user has successfully logged in.
  useEffect(() => {
    // If we have a user, and we have pending problem data, and we are not in an active session
    if (user && problemData && sessionState === 'idle') {
      setIsAuthOpen(false); // Close the auth modal
      setIsAuthLoading(false); // Stop auth loading
      handleStartSession(problemData); // Start the session with the stored data
    }
  }, [user, problemData, handleStartSession, sessionState]);


  const triggerAuthOrStartSession = (data: ProblemSubmitData) => {
    if (!user) {
      setProblemData(data); // Store problem data to use after login
      setIsAuthOpen(true);
    } else {
      handleStartSession(data);
    }
  };
  
  const handleAuthSubmit = (data: AuthSubmitData) => {
    setIsAuthLoading(true);
    if (data.type === 'signup') {
      initiateEmailSignUp(auth, data.email, data.password);
    } else {
      initiateEmailSignIn(auth, data.email, data.password);
    }
    // The useEffect hook will handle the rest once the user state changes
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
      if (result.updatedStepByStepProgress) {
        setStepByStepProgress(result.updatedStepByStepProgress);
      }
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
      const result = await getSummaryAction( dialogue );
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
        isOpen={isAuthOpen}
        onOpenChange={(open) => {
          if (!open) {
            // If the user closes the dialog, reset auth-related state
            setIsAuthOpen(false);
            setIsAuthLoading(false);
            setProblemData(null);
          } else {
            setIsAuthOpen(true);
          }
        }}
        onSubmit={handleAuthSubmit}
        isLoading={isAuthLoading}
      />
    </div>
  );
}
