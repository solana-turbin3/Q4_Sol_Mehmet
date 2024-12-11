import { useState, useEffect } from 'react';
import { StorageManager } from '../lib/storage';

interface Password {
  id: string;
  title: string;
  username: string;
  password: string;
  website: string;
  lastModified: string;
}

export function usePasswordVault() {
  const [storageManager] = useState(() => new StorageManager());
  const [isInitialized, setIsInitialized] = useState(false);
  const [passwords, setPasswords] = useState<Password[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  useEffect(() => {
    const initializeStorage = async () => {
      try {
        await storageManager.initialize();
        const publicKey = sessionStorage.getItem('wallet_public_key');
        if (publicKey && localStorage.getItem(`vault_initialized_${publicKey}`)) {
          setIsInitialized(true);
          setWalletAddress(publicKey);
          await loadPasswords();
        }
      } catch (err) {
        console.error('Failed to initialize storage:', err);
        setError('Failed to initialize storage');
      }
    };

    initializeStorage();
  }, []);

  const loadPasswords = async () => {
    try {
      const allPasswords = await storageManager.getAllPasswords();
      setPasswords(allPasswords);
    } catch (err) {
      console.error('Failed to load passwords:', err);
      setError('Failed to load passwords');
    }
  };

  const unlockVault = async (masterPassword: string, publicKey: string, isInitialSetup: boolean) => {
    try {
      if (isInitialSetup) {
        localStorage.setItem(`vault_initialized_${publicKey}`, 'true');
      }
      
      sessionStorage.setItem('wallet_public_key', publicKey);
      setIsInitialized(true);
      setWalletAddress(publicKey);
      await loadPasswords();
    } catch (err) {
      setError(isInitialSetup ? 'Failed to create vault' : 'Invalid master password');
      throw err;
    }
  };

  const addPassword = async (title: string, username: string, password: string, website: string) => {
    try {
      const newPassword = {
        id: crypto.randomUUID(),
        title,
        username,
        password,
        website,
        lastModified: new Date().toISOString()
      };
      
      await storageManager.addPassword(newPassword);
      await loadPasswords();
    } catch (err) {
      console.error('Failed to add password:', err);
      setError('Failed to add password');
      throw err;
    }
  };

  const updatePassword = async (id: string, updates: Partial<Password>) => {
    try {
      await storageManager.updatePassword(id, updates);
      await loadPasswords();
    } catch (err) {
      console.error('Failed to update password:', err);
      setError('Failed to update password');
      throw err;
    }
  };

  const deletePassword = async (id: string) => {
    try {
      await storageManager.deletePassword(id);
      await loadPasswords();
    } catch (err) {
      console.error('Failed to delete password:', err);
      setError('Failed to delete password');
      throw err;
    }
  };

  const searchPasswords = async (query: string) => {
    try {
      const results = await storageManager.searchPasswords(query);
      setPasswords(results);
    } catch (err) {
      console.error('Failed to search passwords:', err);
      setError('Failed to search passwords');
      throw err;
    }
  };

  const logout = () => {
    sessionStorage.removeItem('wallet_public_key');
    setIsInitialized(false);
    setWalletAddress(null);
    setPasswords([]);
  };

  return {
    isInitialized,
    passwords,
    error,
    unlockVault,
    addPassword,
    updatePassword,
    deletePassword,
    searchPasswords,
    logout,
    walletAddress
  };
}