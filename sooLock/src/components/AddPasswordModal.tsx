import React, { useState } from "react";
import { X } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { SolanaService } from "../lib/solana";

interface AddPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (
    title: string,
    username: string,
    password: string,
    website: string
  ) => Promise<void>;
}

export default function AddPasswordModal({
  isOpen,
  onClose,
  onAdd,
}: AddPasswordModalProps) {
  const { publicKey, signTransaction } = useWallet();
  const [title, setTitle] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [website, setWebsite] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (!publicKey || !signTransaction) {
        throw new Error("Wallet not connected");
      }

      // Validate wallet balance
      const hasBalance = await SolanaService.validateWallet(publicKey);
      if (!hasBalance) {
        throw new Error(
          "Insufficient SOL balance. You need at least 0.01 SOL."
        );
      }

      // Simplified transaction
      const success = await SolanaService.requestAndConfirmTransaction(
        { publicKey, signTransaction },
        "Add password"
      );

      if (!success) {
        throw new Error("Transaction failed. Please try again.");
      }

      await onAdd(title, username, password, website);
      onClose();
      setTitle("");
      setUsername("");
      setPassword("");
      setWebsite("");
    } catch (err) {
      console.error("Failed to add password:", err);
      setError(err instanceof Error ? err.message : "Failed to add password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-black border border-[#c4ff9e] rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#c4ff9e]">Add New Password</h2>
          <button
            onClick={onClose}
            className="text-[#c4ff9e] hover:text-[#c4ff9e]/80"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded text-red-500 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#c4ff9e] mb-1">
              Title
            </label>
            <input
              type="text"
              required
              className="input-primary"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#c4ff9e] mb-1">
              Username
            </label>
            <input
              type="text"
              required
              className="input-primary"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#c4ff9e] mb-1">
              Password
            </label>
            <input
              type="password"
              required
              className="input-primary"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#c4ff9e] mb-1">
              Website
            </label>
            <input
              type="url"
              required
              className="input-primary"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>

          <p className="text-sm text-[#c4ff9e]/60 mt-4">
            Note: This action requires a wallet signature and a 0.0001 SOL fee
          </p>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-[#c4ff9e] border border-[#c4ff9e] rounded-md hover:bg-[#c4ff9e]/10"
            >
              Cancel
            </button>
            <button type="submit" disabled={isLoading} className="btn-primary">
              {isLoading ? "Processing..." : "Add Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
