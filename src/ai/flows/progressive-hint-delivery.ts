'use server';

/**
 * @fileOverview This file defines a Genkit flow for delivering progressively more specific hints to a student.
 *
 * It includes:
 * - `getHint`: A function to retrieve a hint based on the student's input and previous hints.
 * - `GetHintInput`: The input type for the `getHint` function, including the question and previous hints.
 * - `GetHintOutput`: The output type for the `getHint` function, containing the new hint.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetHintInputSchema = z.object({
  question: z.string().describe('The question the student is trying to answer.'),
  studentAnswer: z.string().optional().describe('The student answer to the question.'),
  previousHints: z.array(z.string()).optional().describe('The hints that have already been provided to the student.'),
});
export type GetHintInput = z.infer<typeof GetHintInputSchema>;

const GetHintOutputSchema = z.object({
  hint: z.string().describe('The progressively more specific hint for the student.'),
});
export type GetHintOutput = z.infer<typeof GetHintOutputSchema>;

export async function getHint(input: GetHintInput): Promise<GetHintOutput> {
  return getHintFlow(input);
}

const hintPrompt = ai.definePrompt({
  name: 'hintPrompt',
  input: {schema: GetHintInputSchema},
  output: {schema: GetHintOutputSchema},
  prompt: `You are an AI tutor who provides progressively more specific hints to students.

  The student is working on the following question:
  {{question}}

  {% if studentAnswer %}The student's answer is:
  {{studentAnswer}}{% endif %}

  {% if previousHints.length > 0 %}Previous hints given:
  {{#each previousHints}}- {{this}}\n
  {% endeach %}
  {% endif %}

  Provide a hint that is more specific than the previous hints, but does not give away the answer.
  The hint should guide the student towards understanding the concepts required to answer the question, using the Socratic method.

  The hint should be encouraging but measured (e.g., "You're on the right track" rather than "Amazing job!!!")
  Patient and respectful
  Clear and direct
  Professional but approachable

  When students get stuck, ask "What do you know so far?" or "What have you tried?" to activate prior knowledge
  Validate effort and thinking process, not just correct answers
  Avoid being overly cheerful or using excessive exclamation marks
`,
});

const getHintFlow = ai.defineFlow(
  {
    name: 'getHintFlow',
    inputSchema: GetHintInputSchema,
    outputSchema: GetHintOutputSchema,
  },
  async input => {
    const {output} = await hintPrompt(input);
    return output!;
  }
);
