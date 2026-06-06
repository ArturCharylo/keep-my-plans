import {
  collection,
  doc,
  addDoc,
  getDocs,
  query,
  orderBy,
  setDoc,
  serverTimestamp,
  onSnapshot,
  writeBatch
} from 'firebase/firestore';
import { db } from './firebase';
import { COLLECTIONS } from '../constants';

export const addItem = async (groupId, itemData, userId) => {
  const itemsCol = collection(db, COLLECTIONS.GROUPS, groupId, COLLECTIONS.ITEMS);
  const data = {
    ...itemData,
    addedBy: userId,
    addedAt: serverTimestamp(),
  };

  const docRef = await addDoc(itemsCol, data);
  return docRef.id;
};

export const deleteItem = async (groupId, itemId) => {
  const batch = writeBatch(db);
  const reactionsCol = collection(db, COLLECTIONS.GROUPS, groupId, COLLECTIONS.ITEMS, itemId, COLLECTIONS.REACTIONS);

  const reactionsSnap = await getDocs(reactionsCol);

  reactionsSnap.forEach((reactionDoc) => {
    batch.delete(reactionDoc.ref);
  });

  const itemRef = doc(db, COLLECTIONS.GROUPS, groupId, COLLECTIONS.ITEMS, itemId);
  batch.delete(itemRef);

  await batch.commit();
};

export const subscribeToItems = (groupId, callback) => {
  // IMPORTANT: This query requires a composite index in Firestore.
  // Make sure to create a composite index for the 'items' subcollection
  // under the 'groups' collection, ordering by 'addedAt' in descending order.
  const itemsCol = collection(db, COLLECTIONS.GROUPS, groupId, COLLECTIONS.ITEMS);
  const q = query(itemsCol, orderBy('addedAt', 'desc'));

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(items);
  });

  return unsubscribe;
};

export const setReaction = async (groupId, itemId, user, reactionData) => {
  try {
    const reactionRef = doc(db, COLLECTIONS.GROUPS, groupId, COLLECTIONS.ITEMS, itemId, COLLECTIONS.REACTIONS, user.uid);

    await setDoc(reactionRef, {
      ...reactionData,
      userName: user.displayName || 'Użytkownik',
      userAvatar: user.photoURL || null,
      updatedAt: serverTimestamp(),
    }, { merge: true });

  } catch (error) {
    console.error('Error setting reaction: ', error);
    throw error; // Re-throw to be handled by caller
  }
};

export const getReactions = async (groupId, itemId) => {
  const reactionsCol = collection(db, COLLECTIONS.GROUPS, groupId, COLLECTIONS.ITEMS, itemId, COLLECTIONS.REACTIONS);
  const snapshot = await getDocs(reactionsCol);

  const reactions = {};
  snapshot.forEach(doc => {
    reactions[doc.id] = doc.data();
  });

  return reactions;
};

export const subscribeToReactions = (groupId, itemId, callback) => {
  const reactionsCol = collection(db, COLLECTIONS.GROUPS, groupId, COLLECTIONS.ITEMS, itemId, COLLECTIONS.REACTIONS);

  const unsubscribe = onSnapshot(reactionsCol, (snapshot) => {
    const reactions = {};
    snapshot.forEach(doc => {
      reactions[doc.id] = doc.data();
    });
    callback(reactions);
  });

  return unsubscribe;
};
