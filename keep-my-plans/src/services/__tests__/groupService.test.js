import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createGroup, joinGroupByCode } from '../groupService';

const mockAddDoc = vi.fn();
const mockGetDocs = vi.fn();
const mockUpdateDoc = vi.fn();
const mockArrayUnion = vi.fn((val) => val);
const mockServerTimestamp = vi.fn(() => 'timestamp');
const mockCollection = vi.fn();
const mockDoc = vi.fn();
const mockQuery = vi.fn();
const mockWhere = vi.fn();

vi.mock('firebase/firestore', () => ({
  collection: (...args) => mockCollection(...args),
  doc: (...args) => mockDoc(...args),
  addDoc: (...args) => mockAddDoc(...args),
  getDocs: (...args) => mockGetDocs(...args),
  updateDoc: (...args) => mockUpdateDoc(...args),
  query: (...args) => mockQuery(...args),
  where: (...args) => mockWhere(...args),
  arrayUnion: (...args) => mockArrayUnion(...args),
  serverTimestamp: (...args) => mockServerTimestamp(...args),
  getDoc: vi.fn(),
  onSnapshot: vi.fn(),
}));

vi.mock('../firebase', () => ({
  db: {},
}));

describe('groupService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('createGroup creates a new group and returns groupId and inviteCode', async () => {
    mockAddDoc.mockResolvedValue({ id: 'group123' });

    const result = await createGroup('Test Group', 'user1');

    expect(result.groupId).toBe('group123');
    expect(result.inviteCode).toBeTruthy();
    expect(result.inviteCode.length).toBe(6);
    expect(mockAddDoc).toHaveBeenCalledTimes(1);

    const addedData = mockAddDoc.mock.calls[0][1];
    expect(addedData.name).toBe('Test Group');
    expect(addedData.createdBy).toBe('user1');
    expect(addedData.members).toEqual(['user1']);
    expect(addedData.createdAt).toBe('timestamp');
  });

  it('joinGroupByCode successfully joins existing group', async () => {
    const mockDocSnapshot = {
      id: 'group123',
      data: () => ({ name: 'Test Group' })
    };

    mockGetDocs.mockResolvedValue({
      empty: false,
      docs: [mockDocSnapshot]
    });

    mockDoc.mockReturnValue('docRef123');
    mockUpdateDoc.mockResolvedValue();

    const result = await joinGroupByCode('CODE12', 'user2');

    expect(result.groupId).toBe('group123');
    expect(result.groupName).toBe('Test Group');

    expect(mockUpdateDoc).toHaveBeenCalledWith('docRef123', {
      members: 'user2' // Because mockArrayUnion just returns the value
    });
  });

  it('joinGroupByCode throws an error if inviteCode does not exist', async () => {
    mockGetDocs.mockResolvedValue({
      empty: true,
      docs: []
    });

    await expect(joinGroupByCode('INVALID', 'user2')).rejects.toThrow('GROUP_NOT_FOUND');
  });
});
