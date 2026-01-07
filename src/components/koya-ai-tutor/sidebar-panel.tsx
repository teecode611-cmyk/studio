// @/components/koya-ai-tutor/sidebar-panel.tsx
import { Button } from '@/components/ui/button';
import { StepTracker } from './step-tracker';
import { Lightbulb, Loader2 } from 'lucide-react';

interface SidebarPanelProps {
  progress?: string;
  onGetHint: () => void;
  isHintLoading: boolean;
  isRecapLoading: boolean;
}

export function SidebarPanel({
  progress,
  onGetHint,
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
      </div>
    </div>
  );
}
