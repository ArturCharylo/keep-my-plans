import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { COLLECTIONS } from '../constants';

export const saveUserProfile = async (user, additionalName = null) => {
  if (!user || !user.uid) return;

  const userRef = doc(db, COLLECTIONS.USERS, user.uid);

  const userData = {
    displayName: user.displayName || additionalName || 'Użytkownik',
    email: user.email,
    photoURL: user.photoURL || null,
    lastLogin: serverTimestamp(),
  };

  try {
    await setDoc(userRef, userData, { merge: true });
  } catch (error) {
    console.error('Error saving user profile:', error);
    throw error;
  }
};
