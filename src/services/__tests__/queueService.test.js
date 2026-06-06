import { describe, it, expect, vi, beforeEach } from 'vitest';
import { addItem, setReaction } from '../queueService';

const mockAddDoc = vi.fn();
const mockSetDoc = vi.fn();
const mockServerTimestamp = vi.fn(() => 'timestamp');
const mockCollection = vi.fn();
const mockDoc = vi.fn();

vi.mock('firebase/firestore', () => ({
  collection: (...args) => mockCollection(...args),
  doc: (...args) => mockDoc(...args),
  addDoc: (...args) => mockAddDoc(...args),
  setDoc: (...args) => mockSetDoc(...args),
  serverTimestamp: (...args) => mockServerTimestamp(...args),
  writeBatch: vi.fn(),
  getDocs: vi.fn(),
  query: vi.fn(),
  orderBy: vi.fn(),
  onSnapshot: vi.fn(),
}));

vi.mock('../firebase', () => ({
  db: {},
}));

describe('queueService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('addItem creates a new item in the group subcollection', async () => {
    mockAddDoc.mockResolvedValue({ id: 'item123' });

    const itemData = { title: 'Test', type: 'film' };
    const result = await addItem('group1', itemData, 'user1');

    expect(result).toBe('item123');
    expect(mockAddDoc).toHaveBeenCalledTimes(1);

    const addedData = mockAddDoc.mock.calls[0][1];
    expect(addedData.title).toBe('Test');
    expect(addedData.addedBy).toBe('user1');
    expect(addedData.addedAt).toBe('timestamp');
  });

  it('setReaction sets user reaction and merges correctly', async () => {
    mockDoc.mockReturnValue('reactionDocRef');
    mockSetDoc.mockResolvedValue();

    const reactionData = { watched: true, rating: 5 };
    await setReaction('group1', 'item1', 'user1', reactionData);

    expect(mockSetDoc).toHaveBeenCalledTimes(1);
    expect(mockSetDoc).toHaveBeenCalledWith('reactionDocRef', {
      ...reactionData,
      updatedAt: 'timestamp'
    }, { merge: true });
  });
});
