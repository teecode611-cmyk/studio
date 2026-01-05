// @/components/koya-ai-tutor/auth-dialog.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';

const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});

type FormValues = z.infer<typeof authSchema>;

export interface AuthSubmitData extends FormValues {
    type: 'signin' | 'signup';
}

interface AuthDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: AuthSubmitData) => void;
  isLoading: boolean;
}

export function AuthDialog({ isOpen, onOpenChange, onSubmit, isLoading }: AuthDialogProps) {
  
  const AuthForm = ({ type }: { type: 'signin' | 'signup' }) => {
    const form = useForm<FormValues>({
      resolver: zodResolver(authSchema),
      defaultValues: { email: '', password: '' },
    });

    const handleFormSubmit: SubmitHandler<FormValues> = (data) => {
        onSubmit({...data, type});
    };

    const title = type === 'signup' ? 'Create an Account' : 'Sign In';
    const buttonText = type === 'signup' ? 'Create Account' : 'Sign In';

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="you@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="••••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : buttonText}
                </Button>
            </form>
        </Form>
    )
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl text-center">Get Started</DialogTitle>
          <DialogDescription className="text-center">
            Sign in or create an account to begin your personalized learning session.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Create Account</TabsTrigger>
          </TabsList>
          <TabsContent value="signin" className="pt-4">
            <AuthForm type='signin' />
          </TabsContent>
          <TabsContent value="signup" className="pt-4">
            <AuthForm type='signup' />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
