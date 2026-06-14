export type UserAvatar = 'dumbbell' | 'bottle';

export type StoredUser = {
  id: number;
  username: string;
  password_hash: string;
  role: 'admin' | 'editor' | 'trainer';
  photo_url: UserAvatar;
  full_name: string;
  weight: number | null;
  height: number | null;
  created_at: string;
  updated_at: string;
};

export type PublicUser = Omit<StoredUser, 'password_hash'>;

const USERS_KEY = 'zenithfit_users';
const CURRENT_USER_KEY = 'zenithfit_current_user';

function hashPassword(password: string) {
  if (typeof window === 'undefined') return password;
  return btoa(unescape(encodeURIComponent(`zenithfit:${password}`)));
}

function toPublicUser(user: StoredUser): PublicUser {
  const { password_hash: _passwordHash, ...publicUser } = user;
  return publicUser;
}

export function getStoredUsers(): StoredUser[] {
  if (typeof window === 'undefined') return [];

  const rawUsers = window.localStorage.getItem(USERS_KEY);
  if (!rawUsers) return [];

  try {
    return JSON.parse(rawUsers) as StoredUser[];
  } catch {
    window.localStorage.removeItem(USERS_KEY);
    return [];
  }
}

function saveStoredUsers(users: StoredUser[]) {
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function saveCurrentUser(user: PublicUser | null) {
  if (!user) {
    window.localStorage.removeItem(CURRENT_USER_KEY);
    return;
  }

  window.localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

export function getCurrentUser(): PublicUser | null {
  if (typeof window === 'undefined') return null;

  const rawUser = window.localStorage.getItem(CURRENT_USER_KEY);
  if (!rawUser) return null;

  try {
    return JSON.parse(rawUser) as PublicUser;
  } catch {
    window.localStorage.removeItem(CURRENT_USER_KEY);
    return null;
  }
}

export function registerStoredUser(username: string, password: string): PublicUser {
  const users = getStoredUsers();
  const normalizedUsername = username.trim();
  const now = new Date().toISOString();

  if (users.some((user) => user.username.toLowerCase() === normalizedUsername.toLowerCase())) {
    throw new Error('Користувач із таким логіном уже існує.');
  }

  const newUser: StoredUser = {
    id: users.length ? Math.max(...users.map((user) => user.id)) + 1 : 1,
    username: normalizedUsername,
    password_hash: hashPassword(password),
    role: 'editor',
    photo_url: Math.random() > 0.5 ? 'dumbbell' : 'bottle',
    full_name: '',
    weight: null,
    height: null,
    created_at: now,
    updated_at: now,
  };

  saveStoredUsers([...users, newUser]);
  const publicUser = toPublicUser(newUser);
  saveCurrentUser(publicUser);
  return publicUser;
}

export function loginStoredUser(username: string, password: string): PublicUser {
  const normalizedUsername = username.trim();
  const passwordHash = hashPassword(password);
  const user = getStoredUsers().find(
    (storedUser) => storedUser.username.toLowerCase() === normalizedUsername.toLowerCase() && storedUser.password_hash === passwordHash
  );

  if (!user) {
    throw new Error('Невірний логін або пароль.');
  }

  const publicUser = toPublicUser(user);
  saveCurrentUser(publicUser);
  return publicUser;
}

export function updateStoredUser(userId: number, updates: Partial<Pick<StoredUser, 'photo_url' | 'full_name' | 'weight' | 'height'>>): PublicUser {
  const users = getStoredUsers();
  const userIndex = users.findIndex((user) => user.id === userId);

  if (userIndex === -1) {
    throw new Error('Користувача не знайдено.');
  }

  const updatedUser: StoredUser = {
    ...users[userIndex],
    ...updates,
    updated_at: new Date().toISOString(),
  };

  users[userIndex] = updatedUser;
  saveStoredUsers(users);
  const publicUser = toPublicUser(updatedUser);
  saveCurrentUser(publicUser);
  return publicUser;
}

export function logoutStoredUser() {
  saveCurrentUser(null);
}
