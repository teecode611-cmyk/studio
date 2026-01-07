'use client';

import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

import { Header } from './header';
import { ChatPanel } from './chat-panel';
import { SidebarPanel } from './sidebar-panel';
import { RecapDialog } from './recap-dialog';
import { LandingPage } from './landing-page';
import { ProblemForm, type ProblemSubmitData } from './problem-form';
import { UploadOptionsPage } from './upload-options-page';

export type Message = {
  role: 'user' | 'assistant' | 'hint';
  content: string;
};

type ViewState = 'landing' | 'problem_form' | 'upload_options' | 'tutor_session';

export function TutorView() {
  const [viewState, setViewState] = useState<ViewState>('landing');
  const [problemFormMode, setProblemFormMode] = useState<'text' | 'upload'>('text');
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [problem, setProblem] = useState('');
  const [summary, setSummary] = useState('');
  const [progress, setProgress] = useState('');
  
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

  const handleStartProblem = (mode: 'text' | 'upload') => {
    setProblemFormMode(mode);
    setViewState('problem_form');
  }

  const handleStartUpload = () => {
    setViewState('upload_options');
  }

  const handleBackToHome = () => {
    setViewState('landing');
  }

  const handleStartSession = useCallback(async (data: ProblemSubmitData) => {
    setIsLoading(true);
    setMessages([]);
    setProblem(data.problem || 'Image based problem');
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    try {
      const firstMessage = data.imageDataUri ? `I've uploaded an image. Here's a description: ${data.problem}` : data.problem;
      setMessages([
        { role: 'user', content: firstMessage },
        { role: 'assistant', content: "This is an interesting problem. What have you tried so far?" }
      ]);
      setProgress("1. Understand the problem.\n2. Devise a plan.");
      setViewState('tutor_session');
    } catch (error) {
      handleError('Could not start session', error);
      setViewState('landing');
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
      setSummary("- You learned how to start a new session.\n- You practiced sending messages.");
      setIsRecapOpen(true);
    } catch (error) {
      handleError('Could not generate recap', error);
    } finally {
      setIsRecapLoading(false);
    }
  };

  const resetSession = () => {
    setMessages([]);
    setProblem('');
    setSummary('');
    setProgress('');
    setIsRecapOpen(false);
    setViewState('landing');
  };
  
  const renderContent = () => {
    switch (viewState) {
      case 'landing':
        return <LandingPage onStartProblem={handleStartProblem} onStartUpload={handleStartUpload} />;
      case 'problem_form':
        return <ProblemForm defaultMode={problemFormMode} onBack={handleBackToHome} onSubmit={handleStartSession} isLoading={isLoading} />;
      case 'upload_options':
        return <UploadOptionsPage onBack={handleBackToHome} onSelectUpload={() => handleStartProblem('upload')} />;
      case 'tutor_session':
        return (
          <>
            <Header onLogoClick={handleBackToHome} />
            <main className="flex-1">
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
                      progress={progress}
                      onGetHint={handleGetHint}
                      onEndSession={handleEndSession}
                      isHintLoading={isHintLoading}
                      isRecapLoading={isRecapLoading}
                    />
                  </div>
                </div>
              </div>
            </main>
            <RecapDialog isOpen={isRecapOpen} onOpenChange={resetSession} summary={summary} />
          </>
        )
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#FDFCEC]">
      {renderContent()}
    </div>
  );
}
