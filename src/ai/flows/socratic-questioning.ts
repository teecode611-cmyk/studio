'use server';

/**
 * @fileOverview This file implements the Socratic Questioning flow for the AI tutor.
 *
 * The flow guides students towards solutions using the Socratic method for all turns after the first one.
 *
 * @interface SocraticQuestioningInput - Defines the input schema for the socraticQuestioning function.
 * @interface SocraticQuestioningOutput - Defines the output schema for the socraticQuestioning function.
 * @function socraticQuestioning - The main function that orchestrates the Socratic questioning process.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SocraticQuestioningInputSchema = z.object({
  problem: z
    .string()
    .describe(
      'The original problem or question the student needs help with.'
    ),
  studentResponse: z
    .string()
    .describe("The student's current response or solution attempt."),
  stepByStepProgress: z
    .string()
    .optional()
    .describe('The step by step progress of the student so far.'),
});

export type SocraticQuestioningInput = z.infer<
  typeof SocraticQuestioningInputSchema
>;

const SocraticQuestioningOutputSchema = z.object({
  question: z
    .string()
    .describe(
      'A probing question to guide the student towards understanding.'
    ),
  updatedStepByStepProgress: z
    .string()
    .optional()
    .describe('The updated step by step progress of the student.'),
});

export type SocraticQuestioningOutput = z.infer<
  typeof SocraticQuestioningOutputSchema
>;

export async function socraticQuestioning(
  input: SocraticQuestioningInput
): Promise<SocraticQuestioningOutput> {
  return socraticQuestioningFlow(input);
}

const socraticQuestioningPrompt = ai.definePrompt({
  name: 'socraticQuestioningPrompt',
  input: {schema: SocraticQuestioningInputSchema},
  output: {schema: SocraticQuestioningOutputSchema},
  prompt: `You are a skilled educator who guides students to discover answers rather than providing them directly. Your core philosophy is to use the Socratic method.

  Your primary goal is to help the student learn key concepts and track their progress. You must:
  - Never provide direct answers.
  - Always guide with steps and questions.
  - Confirm the student's understanding before moving on.
  - Provide encouragement and skill-tagged feedback.

  Maintain a professional yet warm tone - like a respected teacher who believes in their students' potential. Be encouraging but measured (e.g., "You're on the right track" rather than "Amazing job!!!"). Be patient, respectful, clear, and direct. Avoid being overly cheerful or using excessive exclamation marks.

  When students get stuck, ask "What do you know so far?" or "What have you tried?" to activate prior knowledge. Validate their effort and thinking process, not just correct answers.

  Original Problem: {{{problem}}}
  Student's Current Response: {{{studentResponse}}}
  {{#if stepByStepProgress}}
  Current Progress So Far: {{{stepByStepProgress}}}
  {{/if}}

  Based on the student's problem and their response:
  1. Formulate a single, probing question to guide them closer to the solution.
  2. Update the step-by-step progress based on this turn's interaction.
  3. If you believe the student has grasped a a concept, ask a question to confirm their understanding.
`,
});

const socraticQuestioningFlow = ai.defineFlow(
  {
    name: 'socraticQuestioningFlow',
    inputSchema: SocraticQuestioningInputSchema,
    outputSchema: SocraticQuestioningOutputSchema,
  },
  async input => {
    const {output} = await socraticQuestioningPrompt(input);
    return output!;
  }
);
