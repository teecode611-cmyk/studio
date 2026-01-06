'use server';

/**
 * @fileOverview This file defines the initial AI flow for starting a new tutoring session.
 *
 * It is responsible for taking the user's initial problem (text or image) and generating
 * the first Socratic question to begin the learning process.
 *
 * - `startSession`: The main function to initiate the session.
 * - `StartSessionInput`: The input type, containing the problem.
 * - `StartSessionOutput`: The output type, containing the first question.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const StartSessionInputSchema = z.object({
  problem: z.string().optional().describe('The problem or question the student needs help with, if provided as text.'),
  imageDataUri: z.string().optional().describe("An optional photo of the problem, as a data URI."),
});

export type StartSessionInput = z.infer<typeof StartSessionInputSchema>;

const StartSessionOutputSchema = z.object({
  question: z.string().describe('The initial probing question to guide the student towards understanding.'),
  initialProgress: z.string().describe('The initial step-by-step progress, beginning with "1. Understand the problem."'),
});

export type StartSessionOutput = z.infer<typeof StartSessionOutputSchema>;

export async function startSession(input: StartSessionInput): Promise<StartSessionOutput> {
  return startSessionFlow(input);
}

const startSessionPrompt = ai.definePrompt({
  name: 'startSessionPrompt',
  input: {schema: StartSessionInputSchema},
  output: {schema: StartSessionOutputSchema},
  prompt: `You are a skilled educator using the Socratic method. A student has submitted a new problem. Your task is to ask the very first question to start the conversation.

  Your primary goal is to help the student learn key concepts. You must:
  - Never provide a direct answer.
  - Always start with a single, open-ended guiding question.
  - Maintain a professional yet warm tone.

  {{#if imageDataUri}}
  The user has uploaded an image of their problem. Analyze the image to understand the question.
  Image: {{media url=imageDataUri}}
  {{/if}}
  
  {{#if problem}}
  The user has also provided the following text description:
  Problem: {{{problem}}}
  {{/if}}

  Based on the provided problem, formulate one clear, encouraging question to start the dialogue (e.g., "This is an interesting problem. What have you tried so far?" or "Thanks for sharing. Where should we begin with this?").

  Also, provide the initial step for the progress tracker. It should be "1. Understand the problem."
`,
});

const startSessionFlow = ai.defineFlow(
  {
    name: 'startSessionFlow',
    inputSchema: StartSessionInputSchema,
    outputSchema: StartSessionOutputSchema,
  },
  async input => {
    const {output} = await startSessionPrompt(input);
    return output!;
  }
);
