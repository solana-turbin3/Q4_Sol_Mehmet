import CryptoJS from 'crypto-js';

export class ZKProof {
  private static readonly PRIME = BigInt('2147483647');
  private static readonly GENERATOR = BigInt('16807');

  private static hash(message: string): string {
    return CryptoJS.SHA256(message).toString();
  }

  private static generateRandomNumber(): bigint {
    const randomBytes = new Uint8Array(32);
    crypto.getRandomValues(randomBytes);
    return BigInt('0x' + Array.from(randomBytes).map(b => b.toString(16).padStart(2, '0')).join('')) % this.PRIME;
  }

  static generateProof(secret: string): {
    commitment: string;
    proof: string;
    timestamp: number;
  } {
    // Generate random value r
    const r = this.generateRandomNumber();
    const timestamp = Date.now();
    
    // Calculate commitment C = g^r mod p
    const commitment = this.modExp(this.GENERATOR, r, this.PRIME).toString();
    
    // Calculate challenge e = H(C || timestamp)
    const challenge = BigInt('0x' + this.hash(commitment + timestamp.toString())) % this.PRIME;
    
    // Calculate response s = r + x*e mod (p-1)
    const x = BigInt('0x' + this.hash(secret)) % this.PRIME;
    const response = (r + x * challenge) % (this.PRIME - BigInt(1));

    // Create and return proof
    const proofData = {
      commitment,
      challenge: challenge.toString(),
      response: response.toString(),
      timestamp
    };

    return {
      commitment,
      proof: btoa(JSON.stringify(proofData)),
      timestamp
    };
  }

  static verifyProof(proof: string, commitment: string): boolean {
    try {
      const proofData = JSON.parse(atob(proof));
      const { response, challenge, timestamp } = proofData;

      // Verify timestamp is within 5 minutes
      if (Date.now() - timestamp > 5 * 60 * 1000) {
        return false;
      }

      // Verify g^s = C * y^e mod p
      const s = BigInt(response);
      const e = BigInt(challenge);
      const C = BigInt(commitment);

      const left = this.modExp(this.GENERATOR, s, this.PRIME);
      const right = (C * this.modExp(C, e, this.PRIME)) % this.PRIME;

      return left === right;
    } catch (error) {
      console.error('ZK verification failed:', error);
      return false;
    }
  }

  private static modExp(base: bigint, exponent: bigint, modulus: bigint): bigint {
    if (modulus === BigInt(1)) return BigInt(0);
    
    let result = BigInt(1);
    base = base % modulus;
    
    while (exponent > BigInt(0)) {
      if (exponent % BigInt(2) === BigInt(1)) {
        result = (result * base) % modulus;
      }
      base = (base * base) % modulus;
      exponent = exponent / BigInt(2);
    }
    
    return result;
  }
}