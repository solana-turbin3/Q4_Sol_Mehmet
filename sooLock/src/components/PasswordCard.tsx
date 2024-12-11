import React, { useState } from 'react';
import { Copy, Eye, EyeOff, Fingerprint } from 'lucide-react';

interface PasswordCardProps {
  id: string;
  title: string;
  username: string;
  password: string;
  website: string;
  lastModified: string;
}

export default function PasswordCard({
  id,
  title,
  username,
  password,
  website,
  lastModified,
}: PasswordCardProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState('');
  const [isBiometricInProgress, setIsBiometricInProgress] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const requestBiometricAuth = async () => {
    try {
      setIsBiometricInProgress(true);
      setVerificationMessage('Requesting fingerprint access...');

      const publicKeyCredential = await navigator.credentials.create({
        publicKey: {
          challenge: new Uint8Array(32),
          rp: {
            name: 'Soolock Password Manager',
            id: window.location.hostname
          },
          user: {
            id: new Uint8Array(16),
            name: 'user@example.com',
            displayName: 'User'
          },
          pubKeyCredParams: [{
            type: 'public-key',
            alg: -7
          }],
          authenticatorSelection: {
            authenticatorAttachment: 'platform',
            userVerification: 'required'
          },
          timeout: 60000,
          attestation: 'direct'
        }
      });

      if (publicKeyCredential) {
        setVerificationMessage('✓ Fingerprint verified');
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Biometric auth error:', error);
      setVerificationMessage('✗ Fingerprint verification failed');
      return false;
    } finally {
      setIsBiometricInProgress(false);
    }
  };

  const togglePassword = async () => {
    if (showPassword) {
      setShowPassword(false);
      setVerificationMessage('');
      return;
    }

    const success = await requestBiometricAuth();
    if (success) {
      setShowPassword(true);
    }
  };

  const copyToClipboard = async (text: string) => {
    if (!isAuthenticated) {
      const success = await requestBiometricAuth();
      if (!success) {
        setVerificationMessage('Please verify fingerprint first');
        return;
      }
    }

    try {
      await navigator.clipboard.writeText(text);
      const originalMessage = verificationMessage;
      setVerificationMessage('✓ Copied to clipboard');
      setTimeout(() => setVerificationMessage(originalMessage), 1500);
    } catch (error) {
      console.error('Failed to copy:', error);
      setVerificationMessage('✗ Failed to copy to clipboard');
    }
  };

  return (
    <div className="bg-black rounded-lg border border-[#c4ff9e] p-4 card-hover">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-[#c4ff9e]">{title}</h3>
          <p className="text-sm text-[#c4ff9e]/60">{website}</p>
        </div>
        {verificationMessage && (
          <div className="flex items-center text-xs text-[#c4ff9e]/80">
            {isBiometricInProgress && (
              <Fingerprint className="h-4 w-4 mr-1 animate-pulse" />
            )}
            <span>{verificationMessage}</span>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm text-[#c4ff9e]/60">Username</p>
            <div className="flex items-center">
              <p className="text-sm font-medium text-[#c4ff9e]">{username}</p>
              <button
                onClick={() => copyToClipboard(username)}
                className="ml-2 text-[#c4ff9e]/60 hover:text-[#c4ff9e] transition-colors duration-200"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm text-[#c4ff9e]/60">Password</p>
            <div className="flex items-center">
              <p className="text-sm font-medium text-[#c4ff9e]">
                {showPassword ? password : '••••••••'}
              </p>
              <button
                onClick={() => copyToClipboard(password)}
                className="ml-2 text-[#c4ff9e]/60 hover:text-[#c4ff9e] transition-colors duration-200"
                disabled={!isAuthenticated}
              >
                <Copy className="h-4 w-4" />
              </button>
              <button
                onClick={togglePassword}
                className="ml-2 text-[#c4ff9e]/60 hover:text-[#c4ff9e] transition-colors duration-200"
                disabled={isBiometricInProgress}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
              <Fingerprint 
                className={`h-4 w-4 ml-2 ${
                  isBiometricInProgress ? 'text-[#c4ff9e] animate-pulse' : 
                  isAuthenticated ? 'text-[#c4ff9e]' : 'text-[#c4ff9e]/60'
                }`} 
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-[#c4ff9e]/20">
        <p className="text-xs text-[#c4ff9e]/40">
          Last modified: {lastModified}
        </p>
      </div>
    </div>
  );
}