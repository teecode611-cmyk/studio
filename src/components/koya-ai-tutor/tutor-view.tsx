
'use client';

import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

import { Header } from './header';
import { ChatPanel } from './chat-panel';
import { SidebarPanel } from './sidebar-panel';
import { RecapDialog } from './recap-dialog';
import { ProblemForm, type ProblemSubmitData } from './problem-form';
import { AuthDialog, type AuthSubmitData } from './auth-dialog';
import { ProblemUploadForm } from './problem-upload-form';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { PanelLeft } from 'lucide-react';
import { SubscriptionPlan } from './subscription-plan';
import { PaymentPage } from './payment-page';
import { AccountPage } from './account-page';
import { HomePage } from './home-page';


export type Message = {
  role: 'user' | 'assistant' | 'hint';
  content: string;
};

type ViewState = 'home' | 'problem_form_text' | 'problem_form_upload' | 'tutor_session' | 'subscription_plan' | 'payment_page' | 'account';

export function TutorView() {
  const [viewState, setViewState] = useState<ViewState>('home');
  const [initialProblemValue, setInitialProblemValue] = useState('');
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [problem, setProblem] = useState('');
  const [summary, setSummary] = useState('');
  const [pastSummaries, setPastSummaries] = useState<string[]>([]);
  const [progress, setProgress] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [isHintLoading, setIsHintLoading] = useState(false);
  const [isRecapLoading, setIsRecapLoading] = useState(false);
  const [isRecapOpen, setIsRecapOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

  const [pendingProblemData, setPendingProblemData] = useState<ProblemSubmitData | null>(null);

  const { toast } = useToast();
  const isMobile = useIsMobile();

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
    setAuthLoading(false);
  }, [toast]);

  const handleStartProblemText = (initialValue?: string) => {
    setInitialProblemValue(initialValue || '');
    setViewState('problem_form_text');
  }

  const handleStartProblemUpload = () => {
    setViewState('problem_form_upload');
  }

  const handleBackToHome = () => {
    setViewState('home');
  }

  const handleGoToAccount = () => {
    setViewState('account');
  }

  const handleBackToPlans = () => {
    setViewState('subscription_plan');
  }

  const handleTriggerAuth = (data: ProblemSubmitData) => {
    // This is where authentication would be triggered.
    // For now, we will simulate a new user sign up flow or a returning user.
    // Let's assume for now every text entry is a new user for demo purposes.
    const isNewUser = true; // or based on actual auth state
    if (isNewUser) {
        setPendingProblemData(data);
        setViewState('subscription_plan'); // Go to plans for new user
    } else {
        handleStartSession(data);
    }
  };

  const handleAuthSubmit = async (data: AuthSubmitData) => {
    setAuthLoading(true);
    // Simulate auth call
    await new Promise(resolve => setTimeout(resolve, 1000));
    try {
        console.log('Auth successful for', data.email);
        setIsAuthOpen(false);

        if (data.type === 'signup') {
            setViewState('subscription_plan');
        } else if (pendingProblemData) {
            await handleStartSession(pendingProblemData);
        }
    } catch (error) {
        handleError('Authentication Failed', error);
    } finally {
        setAuthLoading(false);
    }
  }

  const handlePlanSelected = async (plan: string) => {
    console.log(`Plan selected: ${plan}`);
    setSelectedPlan(plan);
    if (plan === 'Free') {
      if (pendingProblemData) {
        await handleStartSession(pendingProblemData);
      } else {
        setViewState('home'); // Go back home if no pending problem
      }
    } else {
      setViewState('payment_page');
    }
  };

  const handleChangePlan = () => {
    setPendingProblemData(null);
    setViewState('subscription_plan');
  }

  const handlePaymentSubmit = async () => {
    setIsLoading(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    try {
      if (pendingProblemData) {
        await handleStartSession(pendingProblemData);
      } else {
        setViewState('home');
      }
    } catch (error) {
      handleError('Payment Failed', error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleStartSession = useCallback(async (data: ProblemSubmitData) => {
    setIsLoading(true);
    const userProblem = data.problem || 'Please analyze the attached image.';
    setProblem(userProblem);
    setMessages([]);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    try {
      const initialMessages: Message[] = [
        { role: 'user', content: userProblem },
        { role: 'assistant', content: "Thanks for sharing that. Let's dig in. What have you tried so far?" }
      ];
      setMessages(initialMessages);
      setProgress("1. Understand the problem.\n2. Devise a plan.");
      setViewState('tutor_session');
    } catch (error) {
      handleError('Could not start session', error);
      setViewState('home');
    } finally {
      setIsLoading(false);
      setPendingProblemData(null);
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
      const newSummary = "- You learned how to start a new session.\n- You practiced sending messages.";
      setSummary(newSummary);
      setPastSummaries(prev => [...prev, newSummary]);
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
    setViewState('home');
  };

  const renderSidebar = () => (
    <SidebarPanel
      progress={progress}
      onGetHint={handleGetHint}
      isHintLoading={isHintLoading}
      isRecapLoading={isRecapLoading}
    />
  );
  
  const renderContent = () => {
    switch (viewState) {
      case 'home':
        return <HomePage onStartProblem={handleStartProblemText} onStartUpload={handleStartProblemUpload} onGoToAccount={handleGoToAccount} />;
      case 'problem_form_text':
        return <ProblemForm onBack={handleBackToHome} onSubmit={handleTriggerAuth} isLoading={isLoading} initialValue={initialProblemValue} />;
      case 'problem_form_upload':
        return <ProblemUploadForm onBack={handleBackToHome} onSubmit={handleTriggerAuth} isLoading={isLoading} />;
      case 'subscription_plan':
        return <SubscriptionPlan onPlanSelected={handlePlanSelected} />;
      case 'payment_page':
        return <PaymentPage plan={selectedPlan} onBack={handleBackToPlans} onSubmit={handlePaymentSubmit} isLoading={isLoading} />;
      case 'account':
        return <AccountPage onBack={handleBackToHome} summaries={pastSummaries} onChangePlan={handleChangePlan} />;
      case 'tutor_session':
        return (
          <>
            <Header onLogoClick={handleBackToHome} onAccountClick={handleGoToAccount}/>
            <main className="flex-1">
              <div className="container mx-auto p-4 lg:p-6 h-[calc(100vh-4rem-1px)]">
                <div className="grid h-full lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 h-full">
                    <ChatPanel
                      messages={messages}
                      isLoading={isLoading}
                      onSendMessage={handleSendMessage}
                      problem={problem}
                      onEndSession={handleEndSession}
                      isRecapLoading={isRecapLoading}
                    />
                  </div>
                  <div className="hidden lg:block">
                    {renderSidebar()}
                  </div>
                </div>
              </div>
            </main>

            {isMobile && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="fixed bottom-4 right-4 z-20 rounded-full shadow-lg lg:hidden">
                    <PanelLeft className="h-5 w-5" />
                    <span className="sr-only">Toggle Sidebar</span>
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  {renderSidebar()}
                </SheetContent>
              </Sheet>
            )}

            <RecapDialog isOpen={isRecapOpen} onOpenChange={resetSession} summary={summary} />
          </>
        )
      default:
        return <HomePage onStartProblem={handleStartProblemText} onStartUpload={handleStartProblemUpload} onGoToAccount={handleGoToAccount} />;
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#FDFCEC]">
      {renderContent()}
      <AuthDialog 
        isOpen={isAuthOpen} 
        onOpenChange={setIsAuthOpen}
        onSubmit={handleAuthSubmit}
        isLoading={authLoading}
      />
    </div>
  );
}
