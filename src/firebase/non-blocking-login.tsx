'use client';
import {
  Auth, // Import Auth type for type hinting
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { errorEmitter } from './error-emitter';

/** Initiate anonymous sign-in (non-blocking). */
export function initiateAnonymousSignIn(authInstance: Auth): void {
  signInAnonymously(authInstance).catch(error => {
    // Although less common for anonymous, still good to handle.
    console.error('Anonymous sign-in error:', error);
  });
}

/** Initiate email/password sign-up (non-blocking). */
export function initiateEmailSignUp(authInstance: Auth, email: string, password: string): void {
  createUserWithEmailAndPassword(authInstance, email, password)
    .catch(error => {
      // Firebase auth errors have a 'code' property.
      if (error instanceof FirebaseError && error.code === 'auth/email-already-in-use') {
        const customError = new Error('This email address is already in use. Please sign in or use a different email.');
        errorEmitter.emit('auth-error', customError);
      } else {
        const genericError = new Error('Could not create an account. Please try again.');
        errorEmitter.emit('auth-error', genericError);
      }
    });
}

/** Initiate email/password sign-in (non-blocking). */
export function initiateEmailSignIn(authInstance: Auth, email: string, password: string): void {
  signInWithEmailAndPassword(authInstance, email, password)
    .catch(error => {
       if (error instanceof FirebaseError) {
         let customError;
         switch(error.code) {
           case 'auth/user-not-found':
           case 'auth/wrong-password':
           case 'auth/invalid-credential':
             customError = new Error('Invalid email or password. Please try again.');
             break;
           default:
             customError = new Error('Could not sign in. Please try again.');
             break;
         }
         errorEmitter.emit('auth-error', customError);
       } else {
        const genericError = new Error('An unexpected error occurred during sign-in.');
        errorEmitter.emit('auth-error', genericError);
       }
    });
}
