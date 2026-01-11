import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-container">
      <header class="dashboard-header">
        <div class="header-content">
          <h1>Student Dashboard</h1>
          <div class="user-info">
            <div class="user-details">
              <span class="welcome-text">Welcome back,</span>
              <span class="user-name">{{ authService.currentUser()?.displayName }}!</span>
            </div>
            <button (click)="logout()" class="btn-logout">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              Logout
            </button>
          </div>
        </div>
      </header>

      <div class="dashboard-content">
        <div class="welcome-section">
          <div class="welcome-card main-card">
            <h2>🎓 Welcome to Your Learning Portal</h2>
            <p>Your personalized learning dashboard is ready. Here's what you can look forward to:</p>
            
            <div class="features-grid">
              <div class="feature-item">
                <div class="feature-icon">📚</div>
                <h3>My Courses</h3>
                <p>Access all your enrolled courses in one place</p>
              </div>
              <div class="feature-item">
                <div class="feature-icon">📝</div>
                <h3>Assignments</h3>
                <p>View and submit assignments with deadlines</p>
              </div>
              <div class="feature-item">
                <div class="feature-icon">📊</div>
                <h3>Progress Tracking</h3>
                <p>Monitor your learning progress and grades</p>
              </div>
              <div class="feature-item">
                <div class="feature-icon">🔔</div>
                <h3>Notifications</h3>
                <p>Stay updated with course announcements</p>
              </div>
            </div>
          </div>

          <div class="info-card">
            <h3>📋 Account Information</h3>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Name:</span>
                <span class="info-value">{{ authService.currentUser()?.displayName }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Email:</span>
                <span class="info-value">{{ authService.currentUser()?.email }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Role:</span>
                <span class="role-badge student">{{ authService.currentUser()?.role }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Email Verified:</span>
                <span [class]="authService.currentUser()?.emailVerified ? 'status-verified' : 'status-unverified'">
                  {{ authService.currentUser()?.emailVerified ? '✓ Verified' : '✗ Not Verified' }}
                </span>
              </div>
            </div>
          </div>

          <div class="status-card">
            <h3>🚀 Coming Soon</h3>
            <ul class="coming-soon-list">
              <li>📚 Course catalog and enrollment</li>
              <li>📝 Assignment submission portal</li>
              <li>💬 Discussion forums</li>
              <li>📊 Grade reports and analytics</li>
              <li>📅 Academic calendar</li>
              <li>🎯 Learning goals tracker</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      min-height: 100vh;
      background: #f7fafc;
    }

    .dashboard-header {
      background: white;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .header-content {
      max-width: 1400px;
      margin: 0 auto;
      padding: 1.5rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    h1 {
      font-size: 1.75rem;
      color: #1a202c;
      margin: 0;
      font-weight: 700;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 2rem;
    }

    .user-details {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0.25rem;
    }

    .welcome-text {
      color: #718096;
      font-size: 0.875rem;
    }

    .user-name {
      color: #2d3748;
      font-weight: 600;
      font-size: 1rem;
    }

    .btn-logout {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.625rem 1.25rem;
      background: #e53e3e;
      color: white;
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
      font-weight: 600;
      font-size: 0.95rem;
      transition: all 0.2s;

      &:hover {
        background: #c53030;
        transform: translateY(-1px);
        box-shadow: 0 4px 8px rgba(229, 62, 62, 0.3);
      }
    }

    .dashboard-content {
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem;
    }

    .welcome-section {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 2rem;

      @media (max-width: 1024px) {
        grid-template-columns: 1fr;
      }
    }

    .main-card {
      grid-column: 1 / -1;
    }

    .welcome-card, .info-card, .status-card {
      background: white;
      padding: 2rem;
      border-radius: 1rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .welcome-card {
      h2 {
        color: #1a202c;
        margin-bottom: 1rem;
        font-size: 1.5rem;
      }

      p {
        color: #4a5568;
        line-height: 1.6;
        margin-bottom: 2rem;
      }
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
    }

    .feature-item {
      padding: 1.5rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 0.75rem;
      color: white;
      transition: transform 0.2s;

      &:hover {
        transform: translateY(-4px);
      }

      .feature-icon {
        font-size: 2.5rem;
        margin-bottom: 0.75rem;
      }

      h3 {
        margin: 0 0 0.5rem 0;
        font-size: 1.125rem;
      }

      p {
        margin: 0;
        font-size: 0.875rem;
        opacity: 0.9;
      }
    }

    .info-card {
      h3 {
        color: #1a202c;
        margin-bottom: 1.5rem;
        font-size: 1.25rem;
      }
    }

    .info-grid {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .info-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 1rem;
      border-bottom: 1px solid #e2e8f0;

      &:last-child {
        border-bottom: none;
        padding-bottom: 0;
      }
    }

    .info-label {
      color: #718096;
      font-weight: 500;
      font-size: 0.875rem;
    }

    .info-value {
      color: #2d3748;
      font-weight: 600;
      font-size: 0.875rem;
    }

    .role-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 1rem;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;

      &.student {
        background: #bee3f8;
        color: #2c5282;
      }
    }

    .status-verified {
      color: #2f855a;
      font-weight: 600;
    }

    .status-unverified {
      color: #e53e3e;
      font-weight: 600;
    }

    .status-card {
      h3 {
        color: #1a202c;
        margin-bottom: 1.5rem;
        font-size: 1.25rem;
      }
    }

    .coming-soon-list {
      list-style: none;
      padding: 0;
      margin: 0;

      li {
        padding: 0.75rem 0;
        color: #4a5568;
        border-bottom: 1px solid #e2e8f0;

        &:last-child {
          border-bottom: none;
        }
      }
    }

    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }

      .user-info {
        width: 100%;
        justify-content: space-between;
      }

      .dashboard-content {
        padding: 1rem;
      }

      .features-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class StudentDashboardComponent {
  authService = inject(AuthService);

  async logout() {
    await this.authService.logout();
  }
}