'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

interface AccountPageProps {
  summaries: string[];
  onChangePlan: () => void;
  onBack: () => void;
}

export function AccountPage({ summaries, onChangePlan, onBack }: AccountPageProps) {
  return (
    <div className="flex min-h-screen flex-col items-center bg-[#FDFCEC] p-4">
       <Button
          variant="ghost"
          onClick={onBack}
          className="absolute top-6 left-6 text-lg"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Home
        </Button>
      <div className="w-full max-w-4xl pt-24">
        <h1 className="font-headline text-4xl font-bold text-foreground text-center">Your Account</h1>
        
        <Card className="mt-12">
            <CardHeader>
                <CardTitle className="font-headline text-3xl text-primary">Subscription</CardTitle>
                <CardDescription>Manage your subscription plan.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between">
                    <p>You are currently on the <span className="font-bold text-primary">Free</span> plan.</p>
                    <Button onClick={onChangePlan} className="bg-accent text-accent-foreground hover:bg-accent/90">Change Plan</Button>
                </div>
            </CardContent>
        </Card>

        <Card className="mt-8">
            <CardHeader>
                <CardTitle className="font-headline text-3xl text-primary">Session History</CardTitle>
                <CardDescription>Review summaries from your past learning sessions.</CardDescription>
            </CardHeader>
            <CardContent>
                {summaries.length > 0 ? (
                    <Accordion type="single" collapsible className="w-full">
                        {summaries.map((summary, index) => (
                            <AccordionItem key={index} value={`item-${index}`}>
                                <AccordionTrigger className="font-bold text-lg">Session #{summaries.length - index}</AccordionTrigger>
                                <AccordionContent>
                                    <ul className="list-disc pl-5 space-y-1 text-base">
                                      {summary.split('\n').map((line, i) => <li key={i}>{line.replace('- ', '')}</li>)}
                                    </ul>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                ): (
                    <p className="text-muted-foreground text-center py-8">You have no past sessions.</p>
                )}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
