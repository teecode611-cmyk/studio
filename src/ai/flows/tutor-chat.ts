'use server';
/**
 * @fileOverview This file implements the main Socratic chat flow for the AI tutor.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the schema for a single message in the conversation
const MessageSchema = z.object({
  role: z.enum(['user', 'assistant', 'hint']),
  content: z.string(),
});

const TutorChatInputSchema = z.object({
  problem: z.string().describe('The original problem the student is trying to solve.'),
  learningContext: z.string().describe('A summary of topics, key learnings, and summaries from the last 5 sessions.'),
  conversationHistory: z.array(MessageSchema).describe('The history of the current conversation.'),
  currentMessage: z.string().describe("The student's most recent message."),
});

export type TutorChatInput = z.infer<typeof TutorChatInputSchema>;

const TutorChatOutputSchema = z.object({
  response: z.string().describe("The AI tutor's Socratic question or response."),
});

export type TutorChatOutput = z.infer<typeof TutorChatOutputSchema>;

export async function tutorChat(input: TutorChatInput): Promise<TutorChatOutput> {
  return tutorChatFlow(input);
}

const tutorChatPrompt = ai.definePrompt({
  name: 'tutorChatPrompt',
  input: {schema: TutorChatInputSchema},
  output: {schema: TutorChatOutputSchema},
  prompt: `You are an expert Socratic tutor. Your goal is to guide a student to their own solution, never to provide the answer directly. You ask probing, open-ended questions that scaffold their learning.

  **Core Principles:**
  - **Socratic Method:** Always respond with a question that guides the student, based on their last message.
  - **No Direct Answers:** Never give the final answer or a direct formula.
  - **Encourage & Validate:** Acknowledge their effort and thinking process. Use phrases like "That's a good starting point. What happens next?" or "You're on the right track. Can you explain why you did that?"
  - **Use Past Knowledge:** You have access to the student's learning history. If relevant, refer to it to help them make connections (e.g., "Remember how we solved the ratio problem last week? A similar idea applies here.").
  - **Tone:** Patient, professional, encouraging, and clear.

  ---
  **Student's Original Problem:**
  {{{problem}}}

  ---
  **Past Learning Context (Topics, Key Learnings from previous sessions):**
  {{{learningContext}}}

  ---
  **Current Conversation History:**
  {{#each conversationHistory}}
  - **{{role}}:** {{{content}}}
  {{/each}}
  - **user:** {{{currentMessage}}}

  ---
  **Your Task:**
  Based on the student's current message, the conversation history, and their past learning context, formulate ONE Socratic question to guide them toward the next step in solving the problem.
`,
});

const tutorChatFlow = ai.defineFlow(
  {
    name: 'tutorChatFlow',
    inputSchema: TutorChatInputSchema,
    outputSchema: TutorChatOutputSchema,
  },
  async input => {
    const {output} = await tutorChatPrompt(input);
    return output!;
  }
);
