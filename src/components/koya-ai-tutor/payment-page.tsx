'use client';

import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2, ArrowLeft, CreditCard } from 'lucide-react';

const paymentSchema = z.object({
  cardNumber: z.string().regex(/^\d{16}$/, 'Invalid card number'),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Invalid format (MM/YY)'),
  cvc: z.string().regex(/^\d{3,4}$/, 'Invalid CVC'),
  nameOnCard: z.string().min(1, 'Name is required'),
});

type FormValues = z.infer<typeof paymentSchema>;

interface PaymentPageProps {
  plan: string;
  onBack: () => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export function PaymentPage({ plan, onBack, onSubmit, isLoading }: PaymentPageProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      cardNumber: '',
      expiryDate: '',
      cvc: '',
      nameOnCard: '',
    },
  });

  const handleFormSubmit: SubmitHandler<FormValues> = async () => {
    onSubmit();
  };

  const planPrices: { [key: string]: string } = {
    Basic: '$9.99/month',
    Premium: '$19.99/month',
  };

  return (
    <div className="flex h-screen items-center justify-center p-4 bg-[#FDFCEC]">
      <Button variant="ghost" onClick={onBack} className="absolute top-6 left-6 text-lg">
        <ArrowLeft className="mr-2 h-5 w-5" />
        Back to Plans
      </Button>
      <Card className="w-full max-w-md shadow-lg bg-card/80">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Complete Your Purchase</CardTitle>
          <CardDescription>
            You are subscribing to the <span className="font-bold text-primary">{plan}</span> plan for{' '}
            <span className="font-bold text-primary">{planPrices[plan]}</span>.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="nameOnCard"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name on Card</FormLabel>
                    <FormControl>
                      <Input placeholder="John M. Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cardNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Card Number</FormLabel>
                    <FormControl>
                      <Input placeholder="•••• •••• •••• ••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name="expiryDate"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Expiry Date</FormLabel>
                      <FormControl>
                        <Input placeholder="MM/YY" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cvc"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>CVC</FormLabel>
                      <FormControl>
                        <Input placeholder="123" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" className="w-full text-lg py-6" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <CreditCard className="mr-2 h-5 w-5" />
                    Pay and Start Learning
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
