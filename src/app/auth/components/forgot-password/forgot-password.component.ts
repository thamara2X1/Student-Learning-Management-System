import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="forgot-password-container">
      <div class="forgot-password-card">
        <div class="header">
          <h1>Reset Password</h1>
          <p>Enter your email address and we'll send you a link to reset your password</p>
        </div>

        @if (success()) {
          <div class="alert alert-success">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <span>Password reset email sent! Check your inbox.</span>
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

        <form [formGroup]="forgotPasswordForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="email">Email Address</label>
            <input
              type="email"
              id="email"
              formControlName="email"
              placeholder="Enter your email"
              [class.invalid]="emailControl?.invalid && emailControl?.touched"
            />
            @if (emailControl?.invalid && emailControl?.touched) {
              <div class="error-message">
                @if (emailControl?.errors?.['required']) {
                  <span>Email is required</span>
                }
                @if (emailControl?.errors?.['email']) {
                  <span>Please enter a valid email</span>
                }
              </div>
            }
          </div>

          <button
            type="submit"
            class="btn btn-primary btn-block"
            [disabled]="loading() || success()"
          >
            @if (loading()) {
              <span class="spinner"></span>
              <span>Sending...</span>
            } @else {
              <span>Send Reset Link</span>
            }
          </button>
        </form>

        <div class="back-to-login">
          <a routerLink="/login">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back to Login
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .forgot-password-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 2rem;
    }

    .forgot-password-card {
      background: white;
      border-radius: 1rem;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      padding: 3rem;
      width: 100%;
      max-width: 450px;
    }

    .header {
      text-align: center;
      margin-bottom: 2rem;

      h1 {
        font-size: 2rem;
        font-weight: 700;
        color: #1a202c;
        margin-bottom: 0.5rem;
      }

      p {
        color: #718096;
        font-size: 0.95rem;
        line-height: 1.5;
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

    .form-group {
      margin-bottom: 1.5rem;

      label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
        color: #2d3748;
        font-size: 0.9rem;
      }

      input {
        width: 100%;
        padding: 0.75rem 1rem;
        border: 2px solid #e2e8f0;
        border-radius: 0.5rem;
        font-size: 1rem;
        transition: all 0.2s;
        box-sizing: border-box;

        &:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        &.invalid {
          border-color: #fc8181;
        }

        &::placeholder {
          color: #a0aec0;
        }
      }

      .error-message {
        color: #e53e3e;
        font-size: 0.85rem;
        margin-top: 0.5rem;
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
    }

    .spinner {
      width: 18px;
      height: 18px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    .back-to-login {
      text-align: center;
      margin-top: 2rem;

      a {
        color: #667eea;
        text-decoration: none;
        font-weight: 600;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        transition: color 0.2s;

        &:hover {
          color: #5a67d8;
        }
      }
    }

    @media (max-width: 640px) {
      .forgot-password-container {
        padding: 1rem;
      }

      .forgot-password-card {
        padding: 2rem 1.5rem;
      }

      .header h1 {
        font-size: 1.75rem;
      }
    }
  `]
})
export class ForgotPasswordComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  forgotPasswordForm: FormGroup;
  loading = signal(false);
  error = signal<string | null>(null);
  success = signal(false);

  constructor() {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  async onSubmit(): Promise<void> {
    if (this.forgotPasswordForm.invalid) {
      this.forgotPasswordForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set(null);
    this.success.set(false);

    try {
      const { email } = this.forgotPasswordForm.value;
      await this.authService.resetPassword(email);
      this.success.set(true);
      this.forgotPasswordForm.reset();
    } catch (err: any) {
      this.error.set(err.message || 'Failed to send reset email. Please try again.');
    } finally {
      this.loading.set(false);
    }
  }

  get emailControl() {
    return this.forgotPasswordForm.get('email');
  }
}