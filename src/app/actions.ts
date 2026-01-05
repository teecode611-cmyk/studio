'use server';

import {
  socraticQuestioning,
  SocraticQuestioningOutput,
} from '@/ai/flows/socratic-questioning';
import { getHint, GetHintInput, GetHintOutput } from '@/ai/flows/progressive-hint-delivery';
import { summarizeSession, SessionSummaryInput, SessionSummaryOutput } from '@/ai/flows/session-summary';
import { startSession, StartSessionInput, StartSessionOutput } from '@/ai/flows/start-session';
import { z } from 'zod';

const startSessionSchema = z.object({
  problem: z.string().optional(),
  imageDataUri: z.string().optional(),
}).refine(data => data.problem || data.imageDataUri, {
  message: 'Please either provide a problem description or an image.',
  path: ['problem'],
});

export async function startSocraticSession(
  input: z.infer<typeof startSessionSchema>
): Promise<StartSessionOutput> {
  const validatedInput = startSessionSchema.safeParse(input);
  if (!validatedInput.success) {
    throw new Error(validatedInput.error.errors[0].message);
  }

  const sessionInput: StartSessionInput = {
    problem: validatedInput.data.problem,
    imageDataUri: validatedInput.data.imageDataUri,
  };

  try {
    const response = await startSession(sessionInput);
    return response;
  } catch (error) {
    console.error('Error in startSocraticSession:', error);
    throw new Error('Failed to start a new session. Please try again.');
  }
}

const continueSessionSchema = z.object({
  problem: z.string(),
  studentResponse: z.string().min(1, 'Response is too short.'),
  stepByStepProgress: z.string().optional(),
});

export async function continueSocraticSession(
  input: z.infer<typeof continueSessionSchema>
): Promise<SocraticQuestioningOutput> {
  const validatedInput = continueSessionSchema.safeParse(input);
  if (!validatedInput.success) {
    throw new Error(validatedInput.error.errors[0].message);
  }

  try {
    const response = await socraticQuestioning(validatedInput.data);
    return response;
  } catch (error) {
    console.error('Error in continueSocraticSession:', error);
    throw new Error('Failed to get a response. Please try again.');
  }
}

const getHintSchema = z.object({
  question: z.string(),
  studentAnswer: z.string().optional(),
  previousHints: z.array(z.string()).optional(),
});

export async function getHintAction(
  input: z.infer<typeof getHintSchema>
): Promise<GetHintOutput> {
  const validatedInput = getHintSchema.safeParse(input);
  if (!validatedInput.success) {
    throw new Error(validatedInput.error.errors[0].message);
  }
  
  const hintInput: GetHintInput = {
      ...validatedInput.data
  };

  try {
    const response = await getHint(hintInput);
    return response;
  } catch (error) {
    console.error('Error in getHintAction:', error);
    throw new Error('Failed to get a hint. Please try again.');
  }
}

const getSummarySchema = z.object({
  dialogue: z.string().min(1, 'Dialogue is empty.'),
});

export async function getSummaryAction(
  dialogue: string
): Promise<SessionSummaryOutput> {
  const validatedInput = getSummarySchema.safeParse({ dialogue });
  if (!validatedInput.success) {
    throw new Error(validatedInput.error.errors[0].message);
  }

  const summaryInput: SessionSummaryInput = {
    dialogue: validatedInput.data.dialogue,
  };

  try {
    const response = await summarizeSession(summaryInput);
    return response;
  } catch (error) {
    console.error('Error in getSummaryAction:', error);
    throw new Error('Failed to generate a summary. Please try again.');
  }
}
