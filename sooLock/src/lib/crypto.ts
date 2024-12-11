import CryptoJS from 'crypto-js';

export class CryptoManager {
  static async deriveKey(masterPassword: string, salt?: string): Promise<{ key: string; salt: string }> {
    const usedSalt = salt || CryptoJS.lib.WordArray.random(128 / 8).toString();
    const key = CryptoJS.PBKDF2(masterPassword, usedSalt, {
      keySize: 256 / 32,
      iterations: 10000
    }).toString();
    
    return { key, salt: usedSalt };
  }

  static async encrypt(data: string, key: string): Promise<{ encrypted: string; nonce: string }> {
    try {
      const nonce = CryptoJS.lib.WordArray.random(128 / 8).toString();
      const encrypted = CryptoJS.AES.encrypt(data, key + nonce).toString();
      
      return {
        encrypted,
        nonce
      };
    } catch (error) {
      console.error('Encryption error:', error);
      throw new Error('Failed to encrypt data');
    }
  }

  static async decrypt(encrypted: string, nonce: string, key: string): Promise<string> {
    try {
      const bytes = CryptoJS.AES.decrypt(encrypted, key + nonce);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      
      if (!decrypted) {
        throw new Error('Decryption resulted in empty string');
      }
      
      return decrypted;
    } catch (error) {
      console.error('Decryption error:', error);
      throw new Error('Failed to decrypt data');
    }
  }
}