import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface User {
  id: string;
  email: string;
  type: 'user' | 'admin';
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    // Check localStorage on init
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  login(email: string, password: string, type: 'user' | 'admin'): Observable<User> {
    // Mock login - in real app, call API
    const mockUsers: User[] = [
      { id: '1', email: 'user@example.com', type: 'user', name: 'John Doe' },
      { id: '2', email: 'admin@example.com', type: 'admin', name: 'Admin User' },
    ];

    const user = mockUsers.find(u => u.email === email && u.type === type);
    if (user && password === 'password') { // Mock password check
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.currentUserSubject.next(user);
      return of(user).pipe(delay(1000)); // Simulate API delay
    } else {
      throw new Error('Invalid credentials');
    }
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getUserType(): 'user' | 'admin' | null {
    return this.currentUserSubject.value?.type || null;
  }
}
