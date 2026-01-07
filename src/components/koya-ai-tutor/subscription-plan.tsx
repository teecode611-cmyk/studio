'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    price: '$0/month',
    features: ['2 questions/sessions per day'],
    isPopular: false,
  },
  {
    name: 'Basic',
    price: '$9.99/month',
    features: ['5 questions/sessions per day', 'Basic AI Tutor'],
    isPopular: true,
  },
  {
    name: 'Premium',
    price: '$19.99/month',
    features: ['8 questions/sessions per day', 'Advanced AI Tutor', 'Priority support'],
    isPopular: false,
  },
];

const MostPopularBadge = () => (
    <div className="absolute -top-4 -right-4 h-24 w-24">
        <svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Hanging Ribbons */}
            <path d="M38 48 L24 88 L35 80 L48 92 L61 80 L72 88 L58 48 Z" fill="hsl(var(--primary))"/>
            <path d="M38 48 L24 88 L26 87 L38 79 L48 90 L58 79 L70 87 L72 88 L58 48 Z" stroke="hsl(var(--accent))" strokeWidth="1.5" fill="none" />
            
            {/* Fluted Ribbon */}
            <circle cx="48" cy="48" r="28" fill="hsl(var(--accent))"/>
            <circle cx="48" cy="48" r="26" fill="hsl(var(--primary))"/>
            <circle cx="48" cy="48" r="23" fill="hsl(var(--accent))"/>
            
            {/* Center Circle */}
            <circle cx="48" cy="48" r="22" fill="hsl(var(--card))"/>
        </svg>
        <span className="absolute left-1/2 top-[40px] -translate-x-1/2 -translate-y-1/2 -rotate-12 transform text-xs font-bold text-primary">Most</span>
        <span className="absolute left-1/2 top-[52px] -translate-x-1/2 -translate-y-1/2 rotate-6 transform text-xs font-bold text-primary">Popular</span>
    </div>
);


interface SubscriptionPlanProps {
  onPlanSelected: (plan: string) => void;
}

export function SubscriptionPlan({ onPlanSelected }: SubscriptionPlanProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#FDFCEC] p-4">
      <div className="w-full max-w-4xl text-center">
        <h1 className="font-headline text-4xl font-bold text-foreground">Choose your plan</h1>

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={cn(
                'relative flex flex-col rounded-2xl border-2 p-4 shadow-lg',
                plan.isPopular ? 'border-accent bg-card' : 'border-border bg-card'
              )}
            >
              {plan.isPopular && <MostPopularBadge />}
              <CardHeader className="text-left">
                <CardTitle className="font-headline text-3xl font-bold text-primary">{plan.name}</CardTitle>
                <p className="text-2xl font-semibold text-muted-foreground">{plan.price}</p>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col justify-between text-left">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-primary" />
                      <span className="text-base text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  size="lg"
                  className={cn(
                    'mt-8 w-full text-lg',
                    plan.isPopular ? 'bg-accent text-accent-foreground hover:bg-accent/90' : 'bg-primary text-primary-foreground'
                  )}
                  onClick={() => onPlanSelected(plan.name)}
                >
                  Choose {plan.name}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        <Button variant="link" className="mt-8 text-muted-foreground" onClick={() => onPlanSelected('Free')}>Continue with Free plan</Button>
      </div>
    </div>
  );
}
