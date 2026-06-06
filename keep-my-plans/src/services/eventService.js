import {
  collection,
  doc,
  addDoc,
  deleteDoc,
  updateDoc,
  query,
  orderBy,
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore';
import { db } from './firebase';
import { COLLECTIONS } from '../constants';

export const addEvent = async (groupId, eventData, userId) => {
  const eventsCol = collection(db, COLLECTIONS.GROUPS, groupId, COLLECTIONS.EVENTS);
  const data = {
    ...eventData,
    createdBy: userId,
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(eventsCol, data);
  return docRef.id;
};

export const deleteEvent = async (groupId, eventId) => {
  const eventRef = doc(db, COLLECTIONS.GROUPS, groupId, COLLECTIONS.EVENTS, eventId);
  await deleteDoc(eventRef);
};

export const updateEvent = async (groupId, eventId, updateData) => {
  const eventRef = doc(db, COLLECTIONS.GROUPS, groupId, COLLECTIONS.EVENTS, eventId);
  await updateDoc(eventRef, {
    ...updateData,
    updatedAt: serverTimestamp(),
  });
};

export const subscribeToEvents = (groupId, callback) => {
  // IMPORTANT: This query requires a composite index in Firestore.
  // Make sure to create a composite index for the 'events' subcollection
  // under the 'groups' collection, ordering by 'date' in ascending order.
  const eventsCol = collection(db, COLLECTIONS.GROUPS, groupId, COLLECTIONS.EVENTS);
  const q = query(eventsCol, orderBy('date', 'asc'));

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const events = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(events);
  });

  return unsubscribe;
};
