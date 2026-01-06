'use client';
import {
  Auth, // Import Auth type for type hinting
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  // Assume getAuth and app are initialized elsewhere
} from 'firebase/auth';
import { errorEmitter } from './error-emitter';
import { FirestorePermissionError } from './errors';

/** Initiate anonymous sign-in (non-blocking). */
export function initiateAnonymousSignIn(authInstance: Auth): void {
  // CRITICAL: Call signInAnonymously directly. Do NOT use 'await signInAnonymously(...)'.
  signInAnonymously(authInstance).catch(error => {
    // Although we don't have a specific path, we can still report a general auth error.
    // This part is more for consistency in error handling, though less common for anonymous sign-in.
    console.error("Anonymous sign-in failed:", error);
  });
  // Code continues immediately. Auth state change is handled by onAuthStateChanged listener.
}

/** Initiate email/password sign-up (non-blocking). */
export function initiateEmailSignUp(authInstance: Auth, email: string, password: string): Promise<void> {
  // CRITICAL: Call createUserWithEmailAndPassword directly.
  // We return the promise to allow the caller to know about completion/failure.
  return createUserWithEmailAndPassword(authInstance, email, password)
    .then(() => {
      // Success is handled by onAuthStateChanged.
    })
    .catch(error => {
      // Here, you could potentially emit a more generic auth error if you have a system for it.
      console.error("Sign-up failed:", error);
      // Re-throw the error so the calling component's .catch() can handle UI updates.
      throw error;
    });
}

/** Initiate email/password sign-in (non-blocking). */
export function initiateEmailSignIn(authInstance: Auth, email: string, password: string): Promise<void> {
  // CRITICAL: Call signInWithEmailAndPassword directly.
  // Return the promise for the same reasons as sign-up.
  return signInWithEmailAndPassword(authInstance, email, password)
    .then(() => {
      // Success is handled by onAuthStateChanged.
    })
    .catch(error => {
      console.error("Sign-in failed:", error);
      // Re-throw to allow UI handling.
      throw error;
    });
}
