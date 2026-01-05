'use server';
/**
 * @fileOverview Summarizes the key learnings from a tutoring session.
 *
 * - summarizeSession - A function that summarizes the session.
 * - SessionSummaryInput - The input type for the summarizeSession function.
 * - SessionSummaryOutput - The return type for the summarizeSession function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SessionSummaryInputSchema = z.object({
  dialogue: z
    .string()
    .describe(
      'The complete dialogue between the student and the AI tutor during the session.'
    ),
});
export type SessionSummaryInput = z.infer<typeof SessionSummaryInputSchema>;

const SessionSummaryOutputSchema = z.object({
  summary: z
    .string()
    .describe('A concise summary of the key skills learned during the session, formatted as a bulleted list.'),
});
export type SessionSummaryOutput = z.infer<typeof SessionSummaryOutputSchema>;

export async function summarizeSession(input: SessionSummaryInput): Promise<SessionSummaryOutput> {
  return summarizeSessionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'sessionSummaryPrompt',
  input: {schema: SessionSummaryInputSchema},
  output: {schema: SessionSummaryOutputSchema},
  prompt: `You are an AI tutor who has just completed a session with a student.
Your task is to summarize the "Skills Learned" from the session. The summary should be a bulleted list of the key concepts and skills the student practiced or learned.
Focus on the "how-to" aspects and the core principles they engaged with.

Session Dialogue:
{{dialogue}}`,
});

const summarizeSessionFlow = ai.defineFlow(
  {
    name: 'summarizeSessionFlow',
    inputSchema: SessionSummaryInputSchema,
    outputSchema: SessionSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
