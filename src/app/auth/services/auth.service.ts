import { Injectable, inject, signal } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  User as FirebaseUser,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  UserCredential
} from '@angular/fire/auth';
import {
  Firestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
  DocumentReference
} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, from, of, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { User, UserRole, LoginCredentials, RegisterData } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private router = inject(Router);

  // Signals for reactive state management
  public currentUser = signal<User | null>(null);
  public loading = signal<boolean>(true);
  public isAuthenticated = signal<boolean>(false);

  // BehaviorSubject for backward compatibility
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    this.initAuthListener();
  }

  /**
   * Initialize authentication state listener
   */
  private initAuthListener(): void {
    onAuthStateChanged(this.auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          const userData = await this.getUserData(firebaseUser.uid);
          this.setCurrentUser(userData);
        } catch (error) {
          console.error('Error loading user data:', error);
          this.setCurrentUser(null);
        }
      } else {
        this.setCurrentUser(null);
      }
      this.loading.set(false);
    });
  }

  /**
   * Set current user and update all state
   */
  private setCurrentUser(user: User | null): void {
    this.currentUser.set(user);
    this.currentUserSubject.next(user);
    this.isAuthenticated.set(!!user);
  }

  /**
   * Register new user
   */
  async register(data: RegisterData): Promise<User> {
    try {
      this.loading.set(true);
      
      // Create Firebase Auth user
      const userCredential: UserCredential = await createUserWithEmailAndPassword(
        this.auth,
        data.email,
        data.password
      );

      // Update display name
      await updateProfile(userCredential.user, {
        displayName: data.displayName
      });

      // Send email verification
      await sendEmailVerification(userCredential.user);

      // Create user document in Firestore
      const userData: User = {
        uid: userCredential.user.uid,
        email: data.email,
        displayName: data.displayName,
        photoURL: userCredential.user.photoURL || '',
        role: data.role,
        emailVerified: false,
        createdAt: new Date(),
        lastLogin: new Date()
      };

      await this.createUserDocument(userData);
      this.setCurrentUser(userData);
      
      return userData;
    } catch (error: any) {
      console.error('Registration error:', error);
      throw new Error(this.getErrorMessage(error.code));
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * Login user
   */
  async login(credentials: LoginCredentials): Promise<User> {
    try {
      this.loading.set(true);
      
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        credentials.email,
        credentials.password
      );

      // Update last login time
      await this.updateLastLogin(userCredential.user.uid);

      const userData = await this.getUserData(userCredential.user.uid);
      this.setCurrentUser(userData);
      
      return userData;
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(this.getErrorMessage(error.code));
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * Login with Google
   */
  async loginWithGoogle(): Promise<User> {
    try {
      this.loading.set(true);
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(this.auth, provider);

      // Check if user document exists
      const userDoc = await getDoc(doc(this.firestore, 'users', userCredential.user.uid));
      
      let userData: User;
      if (!userDoc.exists()) {
        // Create new user document with default student role
        userData = {
          uid: userCredential.user.uid,
          email: userCredential.user.email!,
          displayName: userCredential.user.displayName || 'User',
          photoURL: userCredential.user.photoURL || '',
          role: 'student', // Default role
          emailVerified: userCredential.user.emailVerified,
          createdAt: new Date(),
          lastLogin: new Date()
        };
        await this.createUserDocument(userData);
      } else {
        userData = userDoc.data() as User;
        await this.updateLastLogin(userData.uid);
      }

      this.setCurrentUser(userData);
      return userData;
    } catch (error: any) {
      console.error('Google login error:', error);
      throw new Error(this.getErrorMessage(error.code));
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      this.setCurrentUser(null);
      this.router.navigate(['/login']);
    } catch (error: any) {
      console.error('Logout error:', error);
      throw new Error('Failed to logout. Please try again.');
    }
  }

  /**
   * Send password reset email
   */
  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(this.auth, email);
    } catch (error: any) {
      console.error('Password reset error:', error);
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  /**
   * Send email verification
   */
  async sendVerificationEmail(): Promise<void> {
    const user = this.auth.currentUser;
    if (user && !user.emailVerified) {
      try {
        await sendEmailVerification(user);
      } catch (error: any) {
        console.error('Email verification error:', error);
        throw new Error('Failed to send verification email.');
      }
    }
  }

  /**
   * Create user document in Firestore
   */
  private async createUserDocument(user: User): Promise<void> {
    const userRef = doc(this.firestore, 'users', user.uid);
    await setDoc(userRef, {
      ...user,
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp()
    });
  }

  /**
   * Get user data from Firestore
   */
  async getUserData(uid: string): Promise<User> {
    const userDoc = await getDoc(doc(this.firestore, 'users', uid));
    if (!userDoc.exists()) {
      throw new Error('User data not found');
    }
    return userDoc.data() as User;
  }

  /**
   * Update last login timestamp
   */
  private async updateLastLogin(uid: string): Promise<void> {
    const userRef = doc(this.firestore, 'users', uid);
    await updateDoc(userRef, {
      lastLogin: serverTimestamp()
    });
  }

  /**
   * Update user profile
   */
  async updateUserProfile(uid: string, data: Partial<User>): Promise<void> {
    const userRef = doc(this.firestore, 'users', uid);
    await updateDoc(userRef, data);
    
    // Refresh current user
    const updatedUser = await this.getUserData(uid);
    this.setCurrentUser(updatedUser);
  }

  /**
   * Check if user has specific role
   */
  hasRole(role: UserRole): boolean {
    const user = this.currentUser();
    return user ? user.role === role : false;
  }

  /**
   * Check if user has any of the specified roles
   */
  hasAnyRole(roles: UserRole[]): boolean {
    const user = this.currentUser();
    return user ? roles.includes(user.role) : false;
  }

  /**
   * Get user role
   */
  getUserRole(): UserRole | null {
    const user = this.currentUser();
    return user ? user.role : null;
  }

  /**
   * Get friendly error messages
   */
  private getErrorMessage(errorCode: string): string {
    const errorMessages: { [key: string]: string } = {
      'auth/email-already-in-use': 'This email is already registered.',
      'auth/invalid-email': 'Invalid email address.',
      'auth/operation-not-allowed': 'Operation not allowed.',
      'auth/weak-password': 'Password is too weak. Use at least 6 characters.',
      'auth/user-disabled': 'This account has been disabled.',
      'auth/user-not-found': 'No account found with this email.',
      'auth/wrong-password': 'Incorrect password.',
      'auth/invalid-credential': 'Invalid email or password.',
      'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
      'auth/network-request-failed': 'Network error. Please check your connection.',
      'auth/popup-closed-by-user': 'Sign-in popup was closed before completion.',
      'auth/cancelled-popup-request': 'Sign-in was cancelled.'
    };

    return errorMessages[errorCode] || 'An error occurred. Please try again.';
  }

  /**
   * Check if current user is authenticated
   */
  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }

  /**
   * Get current Firebase user
   */
  getCurrentFirebaseUser(): FirebaseUser | null {
    return this.auth.currentUser;
  }
}