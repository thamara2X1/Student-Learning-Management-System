import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="verify-email-container">
      <div class="verify-email-card">
        <div class="icon-wrapper">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
          </svg>
        </div>

        <div class="header">
          <h1>Verify Your Email</h1>
          <p>We've sent a verification link to <strong>{{ userEmail() }}</strong></p>
        </div>

        @if (success()) {
          <div class="alert alert-success">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <span>Verification email sent successfully!</span>
          </div>
        }

        @if (error()) {
          <div class="alert alert-error">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span>{{ error() }}</span>
          </div>
        }

        <div class="instructions">
          <h3>What's next?</h3>
          <ol>
            <li>Check your email inbox (and spam folder)</li>
            <li>Click the verification link in the email</li>
            <li>Return here and sign in to your account</li>
          </ol>
        </div>

        <button
          type="button"
          class="btn btn-secondary btn-block"
          (click)="resendVerification()"
          [disabled]="loading() || cooldown()"
        >
          @if (loading()) {
            <span class="spinner"></span>
            <span>Sending...</span>
          } @else if (cooldown()) {
            <span>Resend in {{ countdown() }}s</span>
          } @else {
            <span>Resend Verification Email</span>
          }
        </button>

        <button
          type="button"
          class="btn btn-primary btn-block"
          routerLink="/login"
        >
          Go to Login
        </button>

        <div class="logout-link">
          <a (click)="logout()" style="cursor: pointer;">
            Sign out and use different account
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .verify-email-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 2rem;
    }

    .verify-email-card {
      background: white;
      border-radius: 1rem;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      padding: 3rem;
      width: 100%;
      max-width: 500px;
    }

    .icon-wrapper {
      text-align: center;
      margin-bottom: 2rem;

      svg {
        color: #667eea;
      }
    }

    .header {
      text-align: center;
      margin-bottom: 2rem;

      h1 {
        font-size: 2rem;
        font-weight: 700;
        color: #1a202c;
        margin-bottom: 1rem;
      }

      p {
        color: #718096;
        font-size: 1rem;
        line-height: 1.5;

        strong {
          color: #2d3748;
          font-weight: 600;
        }
      }
    }

    .alert {
      padding: 1rem;
      border-radius: 0.5rem;
      margin-bottom: 1.5rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 0.9rem;

      svg {
        flex-shrink: 0;
      }

      &-error {
        background-color: #fee;
        color: #c53030;
        border: 1px solid #fc8181;
      }

      &-success {
        background-color: #f0fff4;
        color: #2f855a;
        border: 1px solid #9ae6b4;
      }
    }

    .instructions {
      background: #f7fafc;
      border-radius: 0.5rem;
      padding: 1.5rem;
      margin-bottom: 2rem;

      h3 {
        font-size: 1.1rem;
        font-weight: 600;
        color: #2d3748;
        margin-bottom: 1rem;
      }

      ol {
        margin: 0;
        padding-left: 1.5rem;
        color: #4a5568;

        li {
          margin-bottom: 0.75rem;
          line-height: 1.5;

          &:last-child {
            margin-bottom: 0;
          }
        }
      }
    }

    .btn {
      padding: 0.875rem 1.5rem;
      border-radius: 0.5rem;
      font-weight: 600;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.2s;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      margin-bottom: 1rem;

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      &-block {
        width: 100%;
      }

      &-primary {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;

        &:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
        }

        &:active:not(:disabled) {
          transform: translateY(0);
        }
      }

      &-secondary {
        background: white;
        color: #667eea;
        border: 2px solid #667eea;

        &:hover:not(:disabled) {
          background: #f7fafc;
        }
      }
    }

    .spinner {
      width: 18px;
      height: 18px;
      border: 2px solid rgba(102, 126, 234, 0.3);
      border-top-color: #667eea;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    .logout-link {
      text-align: center;
      margin-top: 1rem;

      a {
        color: #718096;
        text-decoration: none;
        font-size: 0.9rem;
        transition: color 0.2s;

        &:hover {
          color: #4a5568;
          text-decoration: underline;
        }
      }
    }

    @media (max-width: 640px) {
      .verify-email-container {
        padding: 1rem;
      }

      .verify-email-card {
        padding: 2rem 1.5rem;
      }

      .header h1 {
        font-size: 1.75rem;
      }

      .icon-wrapper svg {
        width: 48px;
        height: 48px;
      }
    }
  `]
})
export class VerifyEmailComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private router = inject(Router);

  userEmail = signal<string>('');
  loading = signal(false);
  error = signal<string | null>(null);
  success = signal(false);
  cooldown = signal(false);
  countdown = signal(0);
  
  private countdownInterval: any;

  ngOnInit(): void {
    const user = this.authService.getCurrentFirebaseUser();
    if (user) {
      this.userEmail.set(user.email || '');
      
      // If already verified, redirect
      if (user.emailVerified) {
        const userData = this.authService.currentUser();
        if (userData) {
          this.router.navigate([`/${userData.role}/dashboard`]);
        }
      }
    } else {
      // No user logged in, redirect to login
      this.router.navigate(['/login']);
    }
  }

  async resendVerification(): Promise<void> {
    if (this.cooldown()) return;

    this.loading.set(true);
    this.error.set(null);
    this.success.set(false);

    try {
      await this.authService.sendVerificationEmail();
      this.success.set(true);
      this.startCooldown();
    } catch (err: any) {
      this.error.set(err.message || 'Failed to send verification email.');
    } finally {
      this.loading.set(false);
    }
  }

  startCooldown(): void {
    this.cooldown.set(true);
    this.countdown.set(60);

    this.countdownInterval = setInterval(() => {
      const current = this.countdown();
      if (current <= 1) {
        this.cooldown.set(false);
        clearInterval(this.countdownInterval);
      } else {
        this.countdown.set(current - 1);
      }
    }, 1000);
  }

  async logout(): Promise<void> {
    await this.authService.logout();
  }

  ngOnDestroy(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }
}