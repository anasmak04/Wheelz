import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  /**
   * Get item from localStorage
   */
  get<T>(key: string): T | null {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }

  /**
   * Set item to localStorage
   */
  set(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  /**
   * Remove item from localStorage
   */
  clear(key: string): void {
    localStorage.removeItem(key);
  }

  /**
   * Clear all localStorage
   */
  clearAll(): void {
    localStorage.clear();
  }
}
