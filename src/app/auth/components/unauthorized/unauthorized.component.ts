import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="unauthorized-container">
      <div class="unauthorized-card">
        <div class="icon-wrapper">
          <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>

        <h1>Access Denied</h1>
        <p>You don't have permission to access this page.</p>
        <p class="sub-message">Please contact your administrator if you believe this is an error.</p>

        <div class="actions">
          <a routerLink="/" class="btn btn-primary">Go to Home</a>
          <a routerLink="/login" class="btn btn-secondary">Login with Different Account</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .unauthorized-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 2rem;
    }

    .unauthorized-card {
      background: white;
      border-radius: 1rem;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      padding: 3rem;
      width: 100%;
      max-width: 500px;
      text-align: center;
    }

    .icon-wrapper {
      margin-bottom: 2rem;

      svg {
        color: #fc8181;
      }
    }

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
      margin-bottom: 0.5rem;

      &.sub-message {
        font-size: 0.9rem;
        margin-bottom: 2rem;
      }
    }

    .actions {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .btn {
      padding: 0.875rem 1.5rem;
      border-radius: 0.5rem;
      font-weight: 600;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.2s;
      border: none;
      text-decoration: none;
      display: inline-block;

      &-primary {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
        }
      }

      &-secondary {
        background: white;
        color: #667eea;
        border: 2px solid #667eea;

        &:hover {
          background: #f7fafc;
        }
      }
    }

    @media (max-width: 640px) {
      .unauthorized-container {
        padding: 1rem;
      }

      .unauthorized-card {
        padding: 2rem 1.5rem;
      }

      h1 {
        font-size: 1.75rem;
      }

      .icon-wrapper svg {
        width: 64px;
        height: 64px;
      }
    }
  `]
})
export class UnauthorizedComponent {}