import React, { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { SolanaService } from "../lib/solana";
import { PublicKey } from "@solana/web3.js";

interface UnlockScreenProps {
  onUnlock: (
    masterPassword: string,
    publicKey: string,
    isInitialSetup: boolean
  ) => Promise<void>;
  error: string | null;
}

export default function UnlockScreen({ onUnlock, error }: UnlockScreenProps) {
  const { publicKey } = useWallet();
  const [isInitialSetup] = useState(!localStorage.getItem("vault_initialized"));

  useEffect(() => {
    const handlePhantomConnection = (event: MessageEvent) => {
      if (event.data.type === "PHANTOM_CONNECTED") {
        handleConnection(event.data.publicKey);
      }
    };

    window.addEventListener("message", handlePhantomConnection);
    return () => window.removeEventListener("message", handlePhantomConnection);
  }, []);

  const handleConnection = async (walletPublicKey: string) => {
    try {
      const publicKeyInstance = new PublicKey(walletPublicKey);
      const isValid = await SolanaService.validateWallet(publicKeyInstance);
      if (!isValid) {
        throw new Error("Yetersiz SOL bakiyesi. En az 0.01 SOL gerekli.");
      }

      // Başarılı bağlantı sonrası işlemler
      await onUnlock("", walletPublicKey, isInitialSetup);
    } catch (err) {
      console.error("Bağlantı hatası:", err);
    }
  };

  const openConnectWindow = () => {
    const width = 400;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    window.open(
      "/connect.html",
      "Phantom Wallet Bağlantısı",
      `width=${width},height=${height},left=${left},top=${top}`
    );
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8 bg-black border border-[#c4ff9e] rounded-lg">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#c4ff9e] mb-2">Soolock</h1>
          <p className="text-[#c4ff9e]/70">
            {isInitialSetup ? "Vault'unuzu oluşturun" : "Tekrar hoş geldiniz"}
          </p>
        </div>

        <div className="flex justify-center">
          <button onClick={openConnectWindow} className="wallet-adapter-button">
            Cüzdanı Bağla
          </button>
        </div>

        {error && (
          <div className="text-red-500 text-sm text-center">{error}</div>
        )}
      </div>
    </div>
  );
}
