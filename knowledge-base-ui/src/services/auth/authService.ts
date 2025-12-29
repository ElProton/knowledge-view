import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  User,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from './firebaseConfig';

const googleProvider = new GoogleAuthProvider();

export const authService = {
  signInWithGoogle: async (): Promise<User> => {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  },

  signOut: async (): Promise<void> => {
    await firebaseSignOut(auth);
  },

  getCurrentUser: (): User | null => {
    return auth.currentUser;
  },

  getIdToken: async (): Promise<string | null> => {
    const user = auth.currentUser;
    if (!user) return null;
    return user.getIdToken();
  },

  onAuthStateChange: (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback);
  },
};
