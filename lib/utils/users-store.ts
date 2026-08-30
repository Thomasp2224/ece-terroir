import { UserProfile } from '@/lib/types';
import { MOCK_USERS } from '@/lib/mock-data';

// In-memory singleton user store across API routes
const globalUsers: Map<string, UserProfile> = new Map();

// Initialize with default mock users
MOCK_USERS.forEach((u) => {
  globalUsers.set(u.email.toLowerCase(), u);
});

export function getStoredUser(email: string): UserProfile | undefined {
  return globalUsers.get(email.toLowerCase());
}

export function saveStoredUser(user: UserProfile): void {
  globalUsers.set(user.email.toLowerCase(), user);
}

export function getAllStoredUsers(): UserProfile[] {
  return Array.from(globalUsers.values());
}
