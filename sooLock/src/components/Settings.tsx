import React, { useState } from 'react';
import { Shield, Key, Wallet, AlertCircle } from 'lucide-react';
import EditPasswordModal from './EditPasswordModal';

interface SettingsProps {
  walletAddress: string;
  onLogout: () => void;
}

export default function Settings({ walletAddress, onLogout }: SettingsProps) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [autoLock, setAutoLock] = useState(true);
  const [requireSign, setRequireSign] = useState(true);

  const handleChangeMasterPassword = async () => {
    try {
      // @ts-ignore
      const provider = window.phantom?.solana;
      const message = new TextEncoder().encode('Change master password for Soolock');
      await provider.signMessage(message, 'utf8');
      // Implement password change logic
    } catch (error) {
      console.error('Failed to change master password:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-[#c4ff9e] mb-8">Settings</h1>

      <div className="space-y-6">
        <div className="bg-black border border-[#c4ff9e] rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Wallet className="h-6 w-6 text-[#c4ff9e] mr-3" />
            <h2 className="text-xl font-semibold text-[#c4ff9e]">Connected Wallet</h2>
          </div>
          <p className="text-[#c4ff9e]/70 mb-4">
            Currently connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
          </p>
          <button onClick={onLogout} className="btn-primary">
            Disconnect Wallet
          </button>
        </div>

        <div className="bg-black border border-[#c4ff9e] rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Key className="h-6 w-6 text-[#c4ff9e] mr-3" />
            <h2 className="text-xl font-semibold text-[#c4ff9e]">Master Password</h2>
          </div>
          <p className="text-[#c4ff9e]/70 mb-4">
            Change your master password to keep your vault secure.
          </p>
          <div className="flex items-center">
            <button onClick={handleChangeMasterPassword} className="btn-primary">
              Change Master Password
            </button>
            <div className="ml-4 flex items-center text-[#c4ff9e]/60">
              <AlertCircle className="h-5 w-5 mr-2" />
              Requires wallet signature
            </div>
          </div>
        </div>

        <div className="bg-black border border-[#c4ff9e] rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Shield className="h-6 w-6 text-[#c4ff9e] mr-3" />
            <h2 className="text-xl font-semibold text-[#c4ff9e]">Security Settings</h2>
          </div>
          <div className="space-y-4">
            <label className="flex items-center justify-between p-3 border border-[#c4ff9e]/20 rounded-lg hover:bg-[#c4ff9e]/5">
              <div>
                <span className="text-[#c4ff9e] font-medium">Auto-lock Vault</span>
                <p className="text-sm text-[#c4ff9e]/60">Lock vault after 15 minutes of inactivity</p>
              </div>
              <input
                type="checkbox"
                checked={autoLock}
                onChange={(e) => setAutoLock(e.target.checked)}
                className="form-checkbox h-5 w-5 text-[#c4ff9e]"
              />
            </label>

            <label className="flex items-center justify-between p-3 border border-[#c4ff9e]/20 rounded-lg hover:bg-[#c4ff9e]/5">
              <div>
                <span className="text-[#c4ff9e] font-medium">Require Wallet Signature</span>
                <p className="text-sm text-[#c4ff9e]/60">Sign all sensitive operations with wallet</p>
              </div>
              <input
                type="checkbox"
                checked={requireSign}
                onChange={(e) => setRequireSign(e.target.checked)}
                className="form-checkbox h-5 w-5 text-[#c4ff9e]"
              />
            </label>
          </div>
        </div>
      </div>

      <EditPasswordModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
      />
    </div>
  );
}