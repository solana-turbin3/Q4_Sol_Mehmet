import wallet from "../wba-wallet.json";
import bs58 from "bs58";
import { findMetadataPda } from "@metaplex-foundation/mpl-token-metadata";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  createMetadataAccountV3,
  CreateMetadataAccountV3InstructionAccounts,
  CreateMetadataAccountV3InstructionArgs,
  DataV2Args,
} from "@metaplex-foundation/mpl-token-metadata";
import {
  createSignerFromKeypair,
  signerIdentity,
  publicKey,
} from "@metaplex-foundation/umi";

// Define our Mint address
const mint = publicKey("4oA3o4z2PPVz86Qcy7cRF9uXMp2ozxdvU48dBrpBBo1M");

// Create a UMI connection
const umi = createUmi("https://api.devnet.solana.com");
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(createSignerFromKeypair(umi, keypair)));

(async () => {
  try {
    // Start here

    const metadataPda = findMetadataPda(umi, { mint });

    let accounts: CreateMetadataAccountV3InstructionAccounts = {
      metadata: metadataPda,
      mint: mint,
      mintAuthority: signer,
      payer: signer,
      updateAuthority: signer.publicKey,
    };

    let data: DataV2Args = {
      name: "soolock",
      symbol: "SLK",
      uri: "",
      sellerFeeBasisPoints: 500,
      creators: null,
      collection: null,
      uses: null,
    };

    let args: CreateMetadataAccountV3InstructionArgs = {
      data: data,
      isMutable: true,
      collectionDetails: null,
    };

    let tx = createMetadataAccountV3(umi, { ...accounts, ...args });

    let result = await tx.sendAndConfirm(umi);
    console.log(bs58.encode(result.signature));
  } catch (e) {
    console.error(`Oops, something went wrong: ${e}`);
  }
})();
