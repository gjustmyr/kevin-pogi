import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-forgot-password',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword {
  email = '';
  loading = signal(false);
  submitted = signal(false);
  errorMessage = signal('');

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  onSubmit() {
    if (!this.email.trim()) {
      this.errorMessage.set('Please enter your email address');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    this.http
      .post(`${environment.apiUrl}/password-reset/request`, { email: this.email })
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.submitted.set(true);
        },
        error: (error) => {
          this.loading.set(false);
          this.errorMessage.set(error.error?.message || 'An error occurred. Please try again.');
        },
      });
  }

  backToLogin() {
    this.router.navigate(['/login']);
  }
}
