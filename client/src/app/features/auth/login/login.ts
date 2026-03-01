import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Component, OnInit, signal } from '@angular/core';
import { Auth } from '../../../services/auth/auth';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  loginForm!: FormGroup;
  isPasswordVisible: boolean = false;
  isLoading = signal<boolean>(false);

  constructor(
    private fb: FormBuilder,
    private authService: Auth,
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading.set(true);

      const { email, password } = this.loginForm.value;

      this.authService.login({ email, password }).subscribe({
        next: (response) => {
          this.isLoading.set(false);
          Swal.fire({
            icon: 'success',
            title: 'Login Successful!',
            text: 'Redirecting to your dashboard...',
            timer: 1500,
            showConfirmButton: false,
          });
          // Navigation is handled in the auth service
        },
        error: (error) => {
          this.isLoading.set(false);
          const message = error.error?.message || 'Login failed. Please check your credentials.';
          Swal.fire({
            icon: 'error',
            title: 'Login Failed',
            text: message,
            confirmButtonColor: '#16a34a',
          });
          console.error('Login error:', error);
        },
      });
    }
  }

  get loginData() {
    return this.loginForm.controls;
  }
}
