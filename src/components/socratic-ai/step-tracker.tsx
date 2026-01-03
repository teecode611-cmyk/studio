// @/components/socratic-ai/step-tracker.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface StepTrackerProps {
  progress?: string;
}

export function StepTracker({ progress }: StepTrackerProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-lg">
          Your Progress
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="pt-6">
        {progress ? (
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{progress}</p>
        ) : (
          <p className="text-sm text-muted-foreground">
            Your step-by-step progress will appear here as you work through the problem.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
