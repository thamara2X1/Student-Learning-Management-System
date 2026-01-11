import { Routes } from '@angular/router';
import { authGuard } from './auth/guards/auth.guard';
import { roleGuard } from './auth/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./auth/components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./auth/components/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./auth/components/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent)
  },
  {
    path: 'verify-email',
    loadComponent: () => import('./auth/components/verify-email/verify-email.component').then(m => m.VerifyEmailComponent)
  },
  {
    path: 'unauthorized',
    loadComponent: () => import('./auth/components/unauthorized/unauthorized.component').then(m => m.UnauthorizedComponent)
  },

  // Protected routes - Student Dashboard
  {
    path: 'student',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['student'] },
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/student-dashboard/student-dashboard.component').then(m => m.StudentDashboardComponent)
      }
    ]
  },

  // Protected routes - Teacher Dashboard
  {
    path: 'teacher',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['teacher'] },
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/teacher-dashboard/teacher-dashboard.component').then(m => m.TeacherDashboardComponent)
      }
    ]
  },

  // Protected routes - Admin Dashboard
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['admin'] },
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
      }
    ]
  },

  // Catch-all redirect
  {
    path: '**',
    redirectTo: '/login'
  }
];