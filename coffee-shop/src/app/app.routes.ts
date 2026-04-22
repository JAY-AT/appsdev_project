import { Routes } from '@angular/router';
import { Landing } from './landing/landing';
import { Login } from './login/login';
import { UserDashboard } from './user-dashboard/user-dashboard';
import { AdminDashboard } from './admin-dashboard/admin-dashboard';

export const routes: Routes = [
  { path: '', component: Landing },
  { path: 'login', component: Login },
  { path: 'user-dashboard', component: UserDashboard },
  { path: 'admin-dashboard', component: AdminDashboard },
];
