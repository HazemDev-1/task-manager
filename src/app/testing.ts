import { Injectable } from '@angular/core';
import { StorageService } from './services/storage.service';

/** In-memory replacement for localStorage, so tests never share or leak data. */
@Injectable()
export class MemoryStorage extends StorageService {
  readonly data = new Map<string, unknown>();

  override read<T>(key: string, fallback: T): T {
    return (this.data.get(key) as T) ?? fallback;
  }

  override write<T>(key: string, value: T): void {
    this.data.set(key, value);
  }
}

export const memoryStorageProvider = { provide: StorageService, useClass: MemoryStorage };
