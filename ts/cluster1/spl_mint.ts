import { Keypair, PublicKey, Connection, Commitment } from "@solana/web3.js";
import { getOrCreateAssociatedTokenAccount, mintTo } from "@solana/spl-token";
import wallet from "../wba-wallet.json";

// Import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

const token_decimals = 1_000_000n;

// Mint address
const mint = new PublicKey("9wt5V8vzvJ9Uj9xoHfK52W8H9ZU3uXpxyv8fv2aojxLs");

(async () => {
  try {
    const ata = await getOrCreateAssociatedTokenAccount(
      connection,
      keypair,
      mint,
      keypair.publicKey
    );
    //59QLU3HMXG8AXY82GrxqnW7KQBu5nNcwySQgxfy2Cnqd
    console.log(`Your ata is: ${ata.address.toBase58()}`);
    const mintTx = await mintTo(
      connection,
      keypair,
      mint,
      ata.address,
      keypair,
      1n * token_decimals
    );
    console.log(`Your mint txid: ${mintTx}`); //38tbYqBktHHRGemm3x2eqC7v1z14PLam2rFjt6BVpexfmpEAmDXQHQh4inRn4q2JPMVtNN6EE2pNipDVSv5dfUNB
  } catch (error) {
    console.log(`Oops, something went wrong: ${error}`);
  }
})();
