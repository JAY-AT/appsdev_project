import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Auth } from '../services/auth';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  loginType: 'user' | 'admin' = 'user';
  email: string = '';
  password: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(private router: Router, private authService: Auth) {}

  onSubmit() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.email, this.password, this.loginType).subscribe({
      next: (user: any) => {
        this.isLoading = false;
        if (this.loginType === 'user') {
          this.router.navigate(['/user-dashboard']);
        } else {
          this.router.navigate(['/admin-dashboard']);
        }
      },
      error: (error: any) => {
        this.isLoading = false;
        this.errorMessage = error.message || 'Login failed';
      }
    });
  }
}
