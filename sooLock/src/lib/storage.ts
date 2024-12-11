import { openDB, IDBPDatabase } from 'idb';

interface PasswordEntry {
  id: string;
  title: string;
  username: string;
  password: string;
  website: string;
  lastModified: string;
}

export class StorageManager {
  private db: IDBPDatabase | null = null;
  private static readonly DB_NAME = 'soolockDB';
  private static readonly DB_VERSION = 1;

  async initialize(): Promise<void> {
    this.db = await openDB(StorageManager.DB_NAME, StorageManager.DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('passwords')) {
          db.createObjectStore('passwords', { keyPath: 'id' });
        }
      },
    });
  }

  async addPassword(entry: PasswordEntry): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    await this.db.put('passwords', entry);
  }

  async getPassword(id: string): Promise<PasswordEntry | undefined> {
    if (!this.db) throw new Error('Database not initialized');
    return await this.db.get('passwords', id);
  }

  async getAllPasswords(): Promise<PasswordEntry[]> {
    if (!this.db) throw new Error('Database not initialized');
    return await this.db.getAll('passwords');
  }

  async updatePassword(id: string, updates: Partial<PasswordEntry>): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    const entry = await this.getPassword(id);
    if (!entry) throw new Error('Password not found');
    await this.db.put('passwords', { ...entry, ...updates });
  }

  async deletePassword(id: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    await this.db.delete('passwords', id);
  }

  async searchPasswords(query: string): Promise<PasswordEntry[]> {
    if (!this.db) throw new Error('Database not initialized');
    const all = await this.getAllPasswords();
    return all.filter(entry => 
      entry.title.toLowerCase().includes(query.toLowerCase()) ||
      entry.username.toLowerCase().includes(query.toLowerCase()) ||
      entry.website.toLowerCase().includes(query.toLowerCase())
    );
  }
}