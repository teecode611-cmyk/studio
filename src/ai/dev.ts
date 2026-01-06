import { config } from 'dotenv';
config();

import '@/ai/flows/session-summary.ts';
import '@/ai/flows/socratic-questioning.ts';
import '@/ai/flows/progressive-hint-delivery.ts';
import '@/ai/flows/start-session.ts';
import '@/ai/flows/tutor-chat.ts';
