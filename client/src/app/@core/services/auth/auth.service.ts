import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import {environment} from "../../../../environments/environement.prod";
import {User} from "../../types/user";
import {LoginRequest} from "../../types/login-request";
import {RegisterRequest} from "../../types/register-request";
import {AuthResponse} from "../../types/auth-response";
import {StorageService} from "../storage/storage.service";
import { jwtDecode } from 'jwt-decode';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/api/auth`;
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser$: Observable<User | null>;

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {
    this.currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          this.setSession(response);
          this.currentUserSubject.next({
            id: response.id,
            username: response.username,
            email: response.email,
            role: response.role
          });
        })
      );
  }

  register(user: RegisterRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  logout(): void {
    this.storageService.clear('auth-token');
    this.storageService.clear('user');
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token || this.isTokenExpired(token)) {
      this.logout();
      return false;
    }
    return true;
  }


  getToken(): string | null {
    return this.storageService.get('auth-token');
  }

  private setSession(response: AuthResponse): void {
    if (this.isTokenExpired(response.token)) {
      console.error('Token is expired. Login again.');
      return;
    }

    this.storageService.set('auth-token', response.token);
    this.storageService.set('user', {
      id: response.id,
      username: response.username,
      email: response.email,
      role: response.role
    });
  }


  private getUserFromStorage(): User | null {
    return this.storageService.get<User>('user');
  }

  getTokenExpirationDate(token: string): Date | null {
    try {
      const decoded: any = jwtDecode(token);
      if (decoded.exp === undefined) return null;

      const date = new Date(0);
      date.setUTCSeconds(decoded.exp);
      return date;
    } catch (error) {
      return null;
    }
  }

  isTokenExpired(token?: string | null): boolean {
    if (!token) token = this.getToken();
    if (!token) return true;

    const date = this.getTokenExpirationDate(token);
    if (!date) return true;
    return !(date.valueOf() > new Date().valueOf());
  }

  hasRole(role: string): boolean {
    return this.currentUserValue?.role === role;
  }

  checkEmailAvailability(email: string): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiUrl}/check-email`, { email });
  }

  checkUsernameAvailability(username: string): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiUrl}/check-username`, { username });
  }
}
