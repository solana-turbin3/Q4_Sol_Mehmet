import { CryptoManager } from './crypto';
import { StorageManager } from './storage';

export class PasswordVault {
  private storageManager: StorageManager;
  private masterKey: string | null = null;
  private userPublicKey: string | null = null;

  constructor() {
    this.storageManager = new StorageManager();
  }

  async initialize(masterPassword: string, publicKey: string): Promise<void> {
    await this.storageManager.initialize();
    this.userPublicKey = publicKey;
    
    let salt: string;
    const storedSalt = localStorage.getItem(`vault_salt_${publicKey}`);
    
    if (storedSalt) {
      salt = storedSalt;
    } else {
      const { key, salt: newSalt } = await CryptoManager.deriveKey(masterPassword);
      salt = newSalt;
      localStorage.setItem(`vault_salt_${publicKey}`, salt);
    }

    const { key } = await CryptoManager.deriveKey(masterPassword, salt);
    this.masterKey = key;
  }

  async addPassword(title: string, username: string, password: string, website: string): Promise<void> {
    if (!this.masterKey || !this.userPublicKey) throw new Error('Vault not initialized');

    const { encrypted, nonce } = await CryptoManager.encrypt(password, this.masterKey);
    
    await this.storageManager.addPassword({
      id: crypto.randomUUID(),
      title,
      username,
      encryptedPassword: encrypted,
      nonce,
      website,
      lastModified: new Date().toISOString()
    });
  }

  async getAllPasswords(): Promise<any[]> {
    return await this.storageManager.getAllPasswords();
  }

  async searchPasswords(query: string): Promise<any[]> {
    return await this.storageManager.searchPasswords(query);
  }

  isSessionActive(): boolean {
    return this.masterKey !== null;
  }

  endSession(): void {
    this.masterKey = null;
  }
}