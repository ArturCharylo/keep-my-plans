import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
  arrayUnion,
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore';
import { db } from './firebase';
import { COLLECTIONS } from '../constants';

const generateInviteCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const createGroup = async (groupName, userId) => {
  const inviteCode = generateInviteCode();

  const groupData = {
    name: groupName,
    inviteCode: inviteCode,
    createdBy: userId,
    createdAt: serverTimestamp(),
    members: [userId],
  };

  const groupsCol = collection(db, COLLECTIONS.GROUPS);
  const docRef = await addDoc(groupsCol, groupData);

  return { groupId: docRef.id, inviteCode };
};

export const joinGroupByCode = async (inviteCode, userId) => {
  // IMPORTANT: This query requires an index in Firestore.
  // Make sure to create a single-field index on the 'inviteCode' field
  // for the 'groups' collection.
  const groupsCol = collection(db, COLLECTIONS.GROUPS);
  const q = query(groupsCol, where('inviteCode', '==', inviteCode));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    throw new Error('GROUP_NOT_FOUND');
  }

  const groupDoc = querySnapshot.docs[0];
  const groupRef = doc(db, COLLECTIONS.GROUPS, groupDoc.id);

  await updateDoc(groupRef, {
    members: arrayUnion(userId)
  });

  return { groupId: groupDoc.id, groupName: groupDoc.data().name };
};

export const getGroup = async (groupId) => {
  const groupRef = doc(db, COLLECTIONS.GROUPS, groupId);
  const groupSnap = await getDoc(groupRef);

  if (groupSnap.exists()) {
    return { id: groupSnap.id, ...groupSnap.data() };
  } else {
    return null;
  }
};

export const subscribeToGroup = (groupId, callback) => {
  const groupRef = doc(db, COLLECTIONS.GROUPS, groupId);

  const unsubscribe = onSnapshot(groupRef, (docSnap) => {
    if (docSnap.exists()) {
      callback({ id: docSnap.id, ...docSnap.data() });
    } else {
      callback(null);
    }
  });

  return unsubscribe;
};