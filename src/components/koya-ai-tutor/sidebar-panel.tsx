// @/components/koya-ai-tutor/sidebar-panel.tsx
import { Button } from '@/components/ui/button';
import { StepTracker } from './step-tracker';
import { Lightbulb, BookCheck, Loader2 } from 'lucide-react';

interface SidebarPanelProps {
  progress?: string;
  onGetHint: () => void;
  onEndSession: () => void;
  isHintLoading: boolean;
  isRecapLoading: boolean;
}

export function SidebarPanel({
  progress,
  onGetHint,
  onEndSession,
  isHintLoading,
  isRecapLoading
}: SidebarPanelProps) {
  return (
    <div className="space-y-6">
      <StepTracker progress={progress} />
      <div className="space-y-3">
        <Button
          variant="outline"
          className="w-full justify-start gap-2"
          onClick={onGetHint}
          disabled={isHintLoading || isRecapLoading}
        >
          {isHintLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Lightbulb className="h-4 w-4 text-accent" />
          )}
          <span>{isHintLoading ? 'Getting Hint...' : 'Get a Hint'}</span>
        </Button>
        <Button 
          variant="secondary" 
          className="w-full justify-start gap-2" 
          onClick={onEndSession}
          disabled={isHintLoading || isRecapLoading}
        >
          {isRecapLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <BookCheck className="h-4 w-4" />
          )}
          <span>{isRecapLoading ? 'Generating Recap...' : 'End Session & Recap'}</span>
        </Button>
      </div>
    </div>
  );
}
