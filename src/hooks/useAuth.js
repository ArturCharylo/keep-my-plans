import { useState, useEffect, useRef } from 'react';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebase';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const loginAttempted = useRef(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // User is signed in
        localStorage.setItem('watchqueue_uid', currentUser.uid);
        setUser(currentUser);
        setLoading(false);
      } else {
        // User is signed out, attempt anonymous login
        if (!loginAttempted.current) {
          loginAttempted.current = true;
          try {
            await signInAnonymously(auth);
            // onAuthStateChanged will trigger again with the new user
          } catch (error) {
            console.error('Error during anonymous sign in:', error);
            setLoading(false);
          }
        } else {
          setLoading(false);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return { user, loading };
};
