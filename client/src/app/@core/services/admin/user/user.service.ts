import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from "../../../../../environments/environement.prod";
import {User} from "../../../types/user";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiURL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getUsers(page: number = 0, size: number = 10): Observable<any> {
    return this.http.get<any>(`${this.apiURL}${environment.users.getAllUsers}?page=${page}&size=${size}`);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiURL}${environment.users.getUserById(id)}`);
  }

  getUserByUsername(username: string): Observable<User> {
    return this.http.get<User>(`${this.apiURL}${environment.users.getUserByUsername(username)}`);
  }

  updateUser(id: number, userData: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiURL}${environment.users.updateUser(id)}`, userData);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiURL}${environment.users.deleteUser(id)}`);
  }

  changePassword(id: number, currentPassword: string, newPassword: string): Observable<void> {
    return this.http.post<void>(`${this.apiURL}${environment.users.changePassword(id)}`, { currentPassword, newPassword });
  }
}
