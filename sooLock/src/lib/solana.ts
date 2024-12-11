import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";

export class SolanaService {
  private static connection = new Connection(
    "https://api.devnet.solana.com",
    "confirmed"
  );
  private static FEE_LAMPORTS = 0.0001 * LAMPORTS_PER_SOL; // 0.0001 SOL fee
  private static FEE_RECIPIENT = new PublicKey(
    "B99ZeAHD4ZxGfSwbQRqbpQPpAigzwDCyx4ShHTcYCAtS"
  );

  static async requestAndConfirmTransaction(
    wallet: any,
    message: string
  ): Promise<boolean> {
    try {
      if (!wallet.publicKey) throw new Error("Wallet not connected");

      // Create simple transfer transaction
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: wallet.publicKey,
          toPubkey: this.FEE_RECIPIENT,
          lamports: this.FEE_LAMPORTS,
        })
      );

      // Get latest blockhash
      const { blockhash } = await this.connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = wallet.publicKey;

      try {
        // Sign and send transaction
        const signed = await wallet.signTransaction(transaction);
        const signature = await this.connection.sendRawTransaction(
          signed.serialize()
        );

        // Wait for confirmation
        await this.connection.confirmTransaction(signature);
        return true;
      } catch (error) {
        console.error("Transaction failed:", error);
        return false;
      }
    } catch (error) {
      console.error("Solana service error:", error);
      return false;
    }
  }

  static async getBalance(publicKey: PublicKey): Promise<number> {
    try {
      const balance = await this.connection.getBalance(publicKey);
      return balance / LAMPORTS_PER_SOL;
    } catch (error) {
      console.error("Failed to get balance:", error);
      return 0;
    }
  }

  static async validateWallet(publicKey: PublicKey): Promise<boolean> {
    try {
      const balance = await this.getBalance(publicKey);
      return balance >= 0.01; // Minimum required balance
    } catch (error) {
      console.error("Failed to validate wallet:", error);
      return false;
    }
  }
}
