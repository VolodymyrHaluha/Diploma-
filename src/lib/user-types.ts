export type UserAvatar = 'dumbbell' | 'bottle';

export type UserRole = 'admin' | 'editor' | 'trainer';

export type StoredUser = {
  id: number;
  username: string;
  password_hash: string;
  role: UserRole;
  photo_url: UserAvatar;
  full_name: string;
  weight: number | null;
  height: number | null;
  created_at: string;
  updated_at: string;
};

export type PublicUser = Omit<StoredUser, 'password_hash'>;
