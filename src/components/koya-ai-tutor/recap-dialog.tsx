// @/components/koya-ai-tutor/recap-dialog.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface RecapDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  summary: string;
}

export function RecapDialog({ isOpen, onOpenChange, summary }: RecapDialogProps) {
  const skills = summary.split('\n').map(skill => skill.replace('- ', '').trim());

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-[#FDFCEC] border-0 shadow-none">
        <DialogHeader className="text-center space-y-4">
          <DialogTitle className="font-headline text-4xl font-bold text-primary">Session Summary</DialogTitle>
          <DialogDescription className="text-muted-foreground text-lg">
            Here's a recap of the skills you learned this session:
          </DialogDescription>
        </DialogHeader>
        <div className="my-4">
            <div className="rounded-2xl border-2 border-primary p-6">
                <h3 className="font-headline text-xl font-bold text-primary mb-4">Skills Learned</h3>
                <ul className="space-y-2">
                    {skills.map((skill, index) => (
                        <li key={index} className="flex items-start">
                            <span className="text-primary mr-3 mt-1">•</span>
                            <span className="text-foreground text-base">{skill}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
        <DialogFooter>
          <Button size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg" onClick={() => onOpenChange(false)}>Let's Learn Some More</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
