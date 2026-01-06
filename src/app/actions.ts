'use server';

import {
  getHint,
  GetHintInput,
  GetHintOutput
} from '@/ai/flows/progressive-hint-delivery';
import {
  summarizeSession,
  SessionSummaryInput,
  SessionSummaryOutput,
} from '@/ai/flows/session-summary';
import {
  startSession,
  StartSessionInput,
  StartSessionOutput,
} from '@/ai/flows/start-session';
import {
  tutorChat,
  TutorChatInput,
  TutorChatOutput
} from '@/ai/flows/tutor-chat';
import {
  addDocumentNonBlocking,
  updateDocumentNonBlocking
} from '@/firebase';
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  query,
  limit,
  orderBy,
  serverTimestamp,
  arrayUnion
} from 'firebase/firestore';
import {
  initializeFirebase
} from '@/firebase/index';
import {
  z
} from 'zod';
import type {
  Message
} from '@/components/koya-ai-tutor/tutor-view';

const startSessionSchema = z.object({
  userId: z.string(),
  problem: z.string().optional(),
  imageDataUri: z.string().optional(),
}).refine(data => data.problem || data.imageDataUri, {
  message: 'Please either provide a problem description or an image.',
  path: ['problem'],
});

export async function startSocraticSession(
  input: unknown
): Promise < StartSessionOutput & {
  sessionId: string
} > {
  const validatedInput = startSessionSchema.safeParse(input);
  if (!validatedInput.success) {
    throw new Error(validatedInput.error.errors[0].message);
  }

  const {
    userId,
    problem,
    imageDataUri
  } = validatedInput.data;
  const problemDescription = problem || 'the uploaded image';

  // 1. Get the initial AI response
  const aiResponse = await startSession({
    problem,
    imageDataUri
  });

  // 2. Create the session document in Firestore
  const {
    firestore
  } = initializeFirebase();
  const sessionCollectionRef = collection(firestore, 'users', userId, 'sessions');

  const userMessageContent = imageDataUri ?
    (problem ?
      `I've uploaded an image and here's my question: ${problem}` :
      'I have uploaded an image of my problem.') :
    problem !;

  const initialMessages: Message[] = [{
    role: 'user',
    content: userMessageContent
  }, {
    role: 'assistant',
    content: aiResponse.question
  }, ];

  const newSessionDoc = {
    userId,
    topic: problemDescription,
    timestamp: serverTimestamp(),
    completed: false,
    messages: initialMessages,
    keyLearnings: [],
    summary: '',
  };

  const docRef = await addDocumentNonBlocking(sessionCollectionRef, newSessionDoc);

  return {
    ...aiResponse,
    sessionId: docRef.id,
  };
}

const continueSessionSchema = z.object({
  userId: z.string(),
  sessionId: z.string(),
  problem: z.string(),
  studentResponse: z.string().min(1, 'Response cannot be empty.'),
  conversationHistory: z.array(z.object({
    role: z.enum(['user', 'assistant', 'hint']),
    content: z.string(),
  })),
});

export async function continueSocraticSession(
  input: unknown
): Promise < TutorChatOutput > {
  const validatedInput = continueSessionSchema.safeParse(input);
  if (!validatedInput.success) {
    throw new Error(validatedInput.error.errors[0].message);
  }

  const {
    userId,
    sessionId,
    problem,
    studentResponse,
    conversationHistory,
  } = validatedInput.data;

  // 1. Get learning context from previous sessions
  const {
    firestore
  } = initializeFirebase();
  const sessionsRef = collection(firestore, 'users', userId, 'sessions');
  const q = query(sessionsRef, orderBy('timestamp', 'desc'), limit(5));
  const querySnapshot = await getDocs(q);

  const learningContext = querySnapshot.docs
    .map(doc => {
      const data = doc.data();
      return `Topic: ${data.topic}\nSummary: ${data.summary}\nKeyLearnings: ${data.keyLearnings.join(', ')}`;
    })
    .join('\n\n---\n\n');

  // 2. Call the main tutor chat AI flow
  const aiInput: TutorChatInput = {
    problem,
    learningContext,
    conversationHistory,
    currentMessage: studentResponse,
  };
  const aiResult = await tutorChat(aiInput);

  // 3. Update the session document in Firestore with the new messages
  const sessionDocRef = doc(firestore, 'users', userId, 'sessions', sessionId);

  const userMessage: Message = {
    role: 'user',
    content: studentResponse
  };
  const assistantMessage: Message = {
    role: 'assistant',
    content: aiResult.response
  };

  updateDocumentNonBlocking(sessionDocRef, {
    messages: arrayUnion(userMessage, assistantMessage),
  });

  return aiResult;
}


const getHintSchema = z.object({
  question: z.string(),
  studentAnswer: z.string().optional(),
  previousHints: z.array(z.string()).optional(),
  userId: z.string(),
  sessionId: z.string(),
});

export async function getHintAction(
  input: unknown
): Promise < GetHintOutput > {
  const validatedInput = getHintSchema.safeParse(input);
  if (!validatedInput.success) {
    throw new Error(validatedInput.error.errors[0].message);
  }

  const {
    userId,
    sessionId,
    ...hintInput
  } = validatedInput.data;

  try {
    const response = await getHint(hintInput);

    // Save hint to conversation
    const {
      firestore
    } = initializeFirebase();
    const sessionDocRef = doc(firestore, 'users', userId, 'sessions', sessionId);
    const hintMessage: Message = {
      role: 'hint',
      content: response.hint
    };
    updateDocumentNonBlocking(sessionDocRef, {
      messages: arrayUnion(hintMessage),
    });

    return response;
  } catch (error) {
    console.error('Error in getHintAction:', error);
    throw new Error('Failed to get a hint. The AI model may be unavailable.');
  }
}

const getSummarySchema = z.object({
  dialogue: z.string().min(1, 'Dialogue is empty.'),
  userId: z.string(),
  sessionId: z.string(),
});

export async function getSummaryAction(
  input: unknown
): Promise < SessionSummaryOutput > {
  const validatedInput = getSummarySchema.safeParse(input);
  if (!validatedInput.success) {
    throw new Error(validatedInput.error.errors[0].message);
  }

  const {
    userId,
    sessionId,
    dialogue
  } = validatedInput.data;

  const summaryInput: SessionSummaryInput = {
    dialogue
  };

  try {
    const response = await summarizeSession(summaryInput);

    // Save summary and mark as complete
    const {
      firestore
    } = initializeFirebase();
    const sessionDocRef = doc(firestore, 'users', userId, 'sessions', sessionId);
    updateDocumentNonBlocking(sessionDocRef, {
      summary: response.summary,
      completed: true,
    });

    return response;
  } catch (error) {
    console.error('Error in getSummaryAction:', error);
    throw new Error('Failed to generate a summary. The AI model may be unavailable.');
  }
}
