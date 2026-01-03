// @/components/socratic-ai/recap-dialog.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface RecapDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  summary: string;
}

export function RecapDialog({ isOpen, onOpenChange, summary }: RecapDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">Session Recap</DialogTitle>
          <DialogDescription>
            Here is a summary of what you've learned in this session.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[50vh] pr-4">
          <div className="prose prose-sm max-w-none whitespace-pre-wrap rounded-md border bg-muted/50 p-4">
            {summary}
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Start a New Session</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
