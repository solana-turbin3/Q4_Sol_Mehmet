import wallet from "../wba-wallet.json";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  createGenericFile,
  createSignerFromKeypair,
  signerIdentity,
} from "@metaplex-foundation/umi";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";

// Create a devnet connection
const umi = createUmi("https://api.devnet.solana.com");

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader());
umi.use(signerIdentity(signer));

(async () => {
  try {
    // Follow this JSON structure
    // https://docs.metaplex.com/programs/token-metadata/changelog/v1.0#json-structure

    const image =
      "https://devnet.irys.xyz/CrBfpfa8vN4pK8ApYRyUtSS2Kavh71CtwQMVcA1ATkLv";

    const metadata = {
      name: "Schelling",
      symbol: "FSC",
      description: "Schelling's idealism in solfi",
      image: image,
      attributes: [{ trait_type: "colour", value: "green" }],
      properties: {
        files: [
          {
            type: "image/png",
            uri: image,
          },
        ],
      },
      creators: [],
    };
    const myUri = await umi.uploader.uploadJson(metadata);

    console.log(
      "Your metadate URI: ",
      myUri.replace("arweave.net", "devnet.irys.xyz")
    );
  } catch (error) {
    console.log("Oops.. Something went wrong", error);
  }
})();
