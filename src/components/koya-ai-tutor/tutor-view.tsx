'use client';

import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import {
  startSocraticSession,
  continueSocraticSession,
  getHintAction,
  getSummaryAction,
} from '@/app/actions';
import { useAuth, useUser } from '@/firebase';
import { initiateEmailSignIn, initiateEmailSignUp } from '@/firebase/non-blocking-login';
import { doc, onSnapshot, getFirestore } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase/index';

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
  const [sessionId, setSessionId] = useState<string | null>(null);
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

  // Real-time listener for session updates
  useEffect(() => {
    if (!user || !sessionId) return;

    const { firestore } = initializeFirebase();
    const sessionDocRef = doc(firestore, 'users', user.uid, 'sessions', sessionId);

    const unsubscribe = onSnapshot(sessionDocRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setMessages(data.messages || []);
        // You could also sync progress, hints, etc. here if they were stored in the doc
      }
    }, (error) => {
      console.error("Error listening to session updates:", error);
      handleError("Connection Error", "Could not sync with the session data.");
    });

    return () => unsubscribe();
  }, [user, sessionId, handleError]);

  const handleStartSession = useCallback(async (data: ProblemSubmitData) => {
    if (!user) {
      handleError("Authentication Error", "You must be logged in to start a session.");
      return;
    }

    setIsLoading(true);
    setPendingProblem(null);

    try {
      const response = await startSocraticSession({ ...data, userId: user.uid });
      
      const problemDescription = data.problem || 'the uploaded image';
      
      setProblem(problemDescription);
      setSessionId(response.sessionId);
      setStepByStepProgress(response.initialProgress);
      setSessionState('active');
    } catch (error) {
      handleError('Could not start session', error);
      setSessionState('idle');
    } finally {
      setIsLoading(false);
    }
  }, [user, handleError]);
  
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
    } catch (error) {
      handleError('Authentication Failed', error)
    } finally {
      setIsAuthLoading(false);
    }
  }, [auth, handleError]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser && pendingProblem) {
        setIsAuthDialogOpen(false);
        handleStartSession(pendingProblem);
      }
    });
    return () => unsubscribe();
  }, [auth, pendingProblem, handleStartSession]);

  const handleSendMessage = async (response: string) => {
    if (!user || !sessionId) return;
    setIsLoading(true);
    
    // Optimistically update UI
    const optimisticMessages: Message[] = [...messages, { role: 'user', content: response }];
    setMessages(optimisticMessages);

    try {
      await continueSocraticSession({
        userId: user.uid,
        sessionId,
        problem,
        studentResponse: response,
        conversationHistory: messages, // Send current history
      });
      // The onSnapshot listener will handle the update from the backend
    } catch (error) {
      handleError('Could not get response', error);
      setMessages(messages); // Revert on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetHint = async () => {
    if (!user || !sessionId) return;
    setIsHintLoading(true);
    try {
      await getHintAction({
        question: problem,
        studentAnswer: messages.findLast(m => m.role === 'user')?.content,
        previousHints: hints,
        userId: user.uid,
        sessionId,
      });
      // onSnapshot will update the UI
    } catch (error) {
      handleError('Could not get hint', error);
    } finally {
      setIsHintLoading(false);
    }
  };

  const handleEndSession = async () => {
    if (!user || !sessionId) return;
    setIsRecapLoading(true);
    try {
      const dialogue = messages
        .map((m) => `${m.role === 'user' ? 'Student' : 'Tutor'}: ${m.content}`)
        .join('\n');
      const result = await getSummaryAction({
        dialogue,
        userId: user.uid,
        sessionId,
      });
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
    setSessionId(null);
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
            setPendingProblem(null);
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
