import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { LoginCredentials, LoginResponse, User } from '../../shared/interface/auth.interface';
import { environment } from '../../environments/environment';
import { secureSetItem, secureGetItem, secureRemoveItem } from '../../shared/utils/storage.util';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'current_user';

  currentUser = signal<User | null>(this.getUserFromStorage());
  isAuthenticated = signal<boolean>(this.hasToken());

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  login(credentials: LoginCredentials): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, credentials).pipe(
      tap((response) => {
        this.setToken(response.token);
        this.setUser(response.user);
        this.currentUser.set(response.user);
        this.isAuthenticated.set(true);
        this.router.navigate([response.redirectPath]);
      }),
      catchError((error) => {
        console.error('Login error:', error);
        return throwError(() => error);
      }),
    );
  }

  logout(): void {
    secureRemoveItem(this.TOKEN_KEY);
    secureRemoveItem(this.USER_KEY);
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }

  getProfile(): Observable<{ user: User }> {
    return this.http.get<{ user: User }>(`${environment.apiUrl}/auth/profile`).pipe(
      tap((response) => {
        this.setUser(response.user);
        this.currentUser.set(response.user);
      }),
      catchError((error) => {
        if (error.status === 401) {
          this.logout();
        }
        return throwError(() => error);
      }),
    );
  }

  getToken(): string | null {
    return secureGetItem(this.TOKEN_KEY);
  }

  private setToken(token: string): void {
    secureSetItem(this.TOKEN_KEY, token);
  }

  private setUser(user: User): void {
    secureSetItem(this.USER_KEY, JSON.stringify(user));
  }

  private getUserFromStorage(): User | null {
    const userJson = secureGetItem(this.USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  }

  private hasToken(): boolean {
    return !!secureGetItem(this.TOKEN_KEY);
  }

  hasRole(role: string): boolean {
    const user = this.currentUser();
    return user ? user.role === role : false;
  }

  /**
   * Get the dashboard path for the current user based on their role
   */
  getDashboardPath(): string {
    const user = this.currentUser();
    if (!user || !user.role) {
      return '/login';
    }

    switch (user.role) {
      case 'superadmin':
        return '/superadmin/dashboard';
      case 'admin':
        return '/admin/dashboard';
      case 'dean':
        return '/dean/dashboard';
      case 'faculty':
        return '/faculty/dashboard';
      case 'organization':
        return '/organization/dashboard';
      default:
        return '/login';
    }
  }
}
