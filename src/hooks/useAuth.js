import { useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut
} from 'firebase/auth';
import { auth, googleProvider } from '../services/firebase';
import { saveUserProfile } from '../services/userService';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        localStorage.setItem('watchqueue_uid', currentUser.uid);
        setUser(currentUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await saveUserProfile(result.user);
      return result.user;
    } catch (error) {
      console.error('Error during Google sign in:', error);
      throw error;
    }
  };

  const registerWithEmail = async (email, password, displayName) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(result.user, { displayName });
      // Update local state early if needed, though onAuthStateChanged will catch it
      await saveUserProfile(result.user, displayName);
      return result.user;
    } catch (error) {
      console.error('Error during email registration:', error);
      throw error;
    }
  };

  const loginWithEmail = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      await saveUserProfile(result.user);
      return result.user;
    } catch (error) {
      console.error('Error during email login:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('watchqueue_uid');
      localStorage.removeItem('watchqueue_group');
    } catch (error) {
      console.error('Error during sign out:', error);
      throw error;
    }
  };

  return {
    user,
    loading,
    signInWithGoogle,
    registerWithEmail,
    loginWithEmail,
    logout
  };
};
