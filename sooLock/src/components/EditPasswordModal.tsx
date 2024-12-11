import React, { useState } from 'react';
import { X } from 'lucide-react';

interface EditPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EditPasswordModal({ isOpen, onClose }: EditPasswordModalProps) {
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // @ts-ignore
      const provider = window.phantom?.solana;
      if (!provider?.isPhantom) {
        throw new Error('Phantom wallet is not installed');
      }

      // Sign the password update request
      const message = new TextEncoder().encode('Update password in Soolock');
      await provider.signMessage(message, 'utf8');

      // Implement password update logic here
      onClose();
      setNewPassword('');
    } catch (err) {
      console.error('Failed to update password:', err);
      alert('Failed to update password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-black border border-[#c4ff9e] rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#c4ff9e]">Edit Password</h2>
          <button onClick={onClose} className="text-[#c4ff9e] hover:text-[#c4ff9e]/80">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#c4ff9e] mb-1">
              New Password
            </label>
            <input
              type="password"
              required
              className="input-primary"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-[#c4ff9e] border border-[#c4ff9e] rounded-md hover:bg-[#c4ff9e]/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary"
            >
              {isLoading ? 'Signing...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}