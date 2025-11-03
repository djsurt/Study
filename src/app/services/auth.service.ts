import { HttpClient } from '@angular/common/http';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { Router } from '@angular/router';  // Fixed: was 'express'
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<any>(null);
  currentUser$ = this.currentUserSubject.asObservable();
  private platformId = inject(PLATFORM_ID);
  
  constructor(private http: HttpClient, private router: Router) {
    // Only access localStorage in the browser
    if (isPlatformBrowser(this.platformId)) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        this.currentUserSubject.next(JSON.parse(storedUser));
      }
    }
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>('http://localhost:8000/auth/login', {
      email,
      password
    }).pipe(
      tap(response => {
        // Only use localStorage in the browser
        if (isPlatformBrowser(this.platformId)) {
          // Store token in localStorage
          localStorage.setItem('access_token', response.access_token);
          // Store user info
          localStorage.setItem('user', JSON.stringify(response.user));
        }
        // Update the observable so components can react
        this.currentUserSubject.next(response.user);
      })
    );
  }

  logout(): void {
    // Only use localStorage in the browser
    if (isPlatformBrowser(this.platformId)) {
      // Clear all auth data from localStorage
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
    }
    // Clear the user observable
    this.currentUserSubject.next(null);
    // Redirect to login page
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('access_token');
    }
    return null;
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    
    if (!token) {
      return false;
    }
    
    // Check if token is expired
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp * 1000; // Convert to milliseconds
      return Date.now() < expiry;
    } catch (e) {
      return false;
    }
  }

  getCurrentUser(): any {
    if (isPlatformBrowser(this.platformId)) {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    }
    return null;
  }

}
