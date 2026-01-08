export type UserRole = 'student' | 'teacher' | 'admin';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  emailVerified: boolean;
  createdAt: Date;
  lastLogin: Date;
  profile?: UserProfile;
}

export interface UserProfile {
  bio?: string;
  phone?: string;
  address?: string;
  dateOfBirth?: Date;
  department?: string;
  enrollmentYear?: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  displayName: string;
  role: UserRole;
}