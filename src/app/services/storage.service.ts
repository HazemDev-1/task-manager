import { Injectable } from '@angular/core';

/**
 * Wraps localStorage so the rest of the app never touches it directly.
 * Tests replace this class with an in-memory version (see task.service.spec.ts).
 */
@Injectable({ providedIn: 'root' })
export class StorageService {
  read<T>(key: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
      return fallback; // private mode, blocked storage, or corrupted JSON
    }
  }

  write<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage full or blocked: the app keeps working in memory */
    }
  }
}
