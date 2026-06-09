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
  arrayRemove,
  serverTimestamp,
  onSnapshot,
  writeBatch
} from 'firebase/firestore';
import { db } from './firebase';
import { COLLECTIONS } from '../constants';
import { INVITE_CODE_LENGTH } from '../constants';

const generateInviteCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < INVITE_CODE_LENGTH; i++) {
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

export const addMemberToGroup = async (groupId, userId) => {
  if (!groupId || !userId) {
    throw new Error('Missing groupId or userId');
  }

  try {
    const groupRef = doc(db, COLLECTIONS.GROUPS, groupId);
    await updateDoc(groupRef, {
      members: arrayUnion(userId)
    });
  } catch (error) {
    console.error('Error adding member to group:', error);
    throw error;
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

export const getUserGroups = (userId) => {
  const groupsCol = collection(db, COLLECTIONS.GROUPS);
  return query(groupsCol, where('members', 'array-contains', userId));
};

export const deleteGroup = async (groupId) => {
  const batch = writeBatch(db);
  const groupRef = doc(db, COLLECTIONS.GROUPS, groupId);

  // Delete items and their reactions
  const itemsCol = collection(db, COLLECTIONS.GROUPS, groupId, COLLECTIONS.ITEMS);
  const itemsSnap = await getDocs(itemsCol);

  for (const itemDoc of itemsSnap.docs) {
    const reactionsCol = collection(db, COLLECTIONS.GROUPS, groupId, COLLECTIONS.ITEMS, itemDoc.id, COLLECTIONS.REACTIONS);
    const reactionsSnap = await getDocs(reactionsCol);
    reactionsSnap.forEach((reactionDoc) => {
      batch.delete(reactionDoc.ref);
    });
    batch.delete(itemDoc.ref);
  }

  // Delete events
  const eventsCol = collection(db, COLLECTIONS.GROUPS, groupId, COLLECTIONS.EVENTS);
  const eventsSnap = await getDocs(eventsCol);
  eventsSnap.forEach((eventDoc) => {
    batch.delete(eventDoc.ref);
  });

  // Delete the group document
  batch.delete(groupRef);

  await batch.commit();
};

export const leaveGroup = async (groupId, userId) => {
  if (!groupId || !userId) {
    throw new Error('Missing groupId or userId');
  }

  const groupRef = doc(db, COLLECTIONS.GROUPS, groupId);

  await updateDoc(groupRef, {
    members: arrayRemove(userId)
  });

  const updatedGroupSnap = await getDoc(groupRef);
  if (updatedGroupSnap.exists()) {
    const updatedMembers = updatedGroupSnap.data().members || [];
    if (updatedMembers.length === 0) {
      await deleteGroup(groupId);
    }
  }
};
