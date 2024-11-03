import {
  Commitment,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
} from "@solana/web3.js";
import wallet from "../wba-wallet.json";
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";

// We're going to import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

// Mint address
const mint = new PublicKey("4oA3o4z2PPVz86Qcy7cRF9uXMp2ozxdvU48dBrpBBo1M");

// Recipient address
const to = new PublicKey("7QmYAWjGh21ydotHx5ZWUiZqhLyqmuoR8RoY41E75mnP");

(async () => {
  try {
    const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      keypair,
      mint,
      keypair.publicKey
    );
    const toTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      keypair,
      mint,
      to
    );
    const tx = await transfer(
      connection,
      keypair,
      fromTokenAccount.address,
      toTokenAccount.address,
      keypair,
      1e6
    );
  } catch (e) {
    console.error(`Oops, something went wrong: ${e}`);
  }
})();
