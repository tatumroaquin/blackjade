import {
  generateKeyPairSync,
  sign,
  verify,
  createPublicKey,
  createPrivateKey,
} from 'crypto';
import SHA256 from '../utility/sha256.js';
import { HexKeyPair, SelfVerifyParams, GlobalVerifyParams } from './keypair.d.js';

export default class KeyPair {
  publicKey: Buffer;
  privateKey: Buffer;
  static signAlgorithm?: string;

  constructor(keypair: KeyPair | undefined = undefined) {
    KeyPair.signAlgorithm = 'SHA256';

    if (KeyPair.isValidKeyPair(keypair)) {
      this.publicKey = keypair!.publicKey;
      this.privateKey = keypair!.privateKey;
      return;
    }

    const { publicKey, privateKey } = KeyPair.genKeyPair();
    this.publicKey = publicKey;
    this.privateKey = privateKey;
  }

  static genKeyPair() {
    return generateKeyPairSync('ec', {
      namedCurve: 'secp256k1',
      publicKeyEncoding: { type: 'spki', format: 'der' },
      privateKeyEncoding: { type: 'pkcs8', format: 'der' },
    });
  }

  static isValidHexKeyPair(keypair: HexKeyPair): boolean {
    const { publicKey, privateKey } = keypair;
    if (!publicKey || !privateKey) {
      console.error('incoming keys must not be empty');
      return false;
    }

    const isHex = new RegExp(/^[0-9a-f]+$/);
    if (!isHex.test(publicKey) || !isHex.test(privateKey)) {
      console.error('incoming keys must be a hex string');
      return false;
    }

    if (publicKey.length !== 88 * 2) {
      console.error('publicKey length is NOT isValid');
      return false;
    }

    if (privateKey.length !== 135 * 2) {
      console.error('privateKey length is NOT isValid');
      return false;
    }

    if (!KeyPair.isValidKeyBytes(publicKey, 'public')) return false;

    if (!KeyPair.isValidKeyBytes(privateKey, 'private')) return false;

    return true;
  }

  static isValidKeyPair(keypair: KeyPair | undefined) {
    if (!keypair) return false;

    if (!(keypair instanceof KeyPair)) return false;

    if (!(keypair.publicKey instanceof Buffer)) return false;

    if (!(keypair.privateKey instanceof Buffer)) return false;

    // secp256k1 publickey bytelength is 88
    if (keypair.publicKey.byteLength !== 88) return false;

    // secp256k1 privateKey bytelength is 135
    if (keypair.privateKey.byteLength !== 135) return false;

    if (!KeyPair.isValidKeyBytes(keypair.publicKey, 'public')) return false;

    if (!KeyPair.isValidKeyBytes(keypair.privateKey, 'private')) return false;

    return true;
  }

  static isValidKeyBytes(
    key: Buffer | string,
    type: 'public' | 'private' = 'public'
  ) {
    if (typeof key === 'string') key = Buffer.from(key, 'hex');

    try {
      if (type === 'public') {
        createPublicKey({
          key,
          type: 'spki',
          format: 'der',
        });
      }
      if (type === 'private') {
        createPrivateKey({
          key,
          type: 'pkcs8',
          format: 'der',
        });
      }
    } catch (error) {
      console.error(`this ${type} key contains the wrong bytes`);
      return false;
    }

    return true;
  }

  getPublicKey(): string {
    return this.publicKey.toString('hex');
  }

  getPrivateKey(): string {
    return this.privateKey.toString('hex');
  }

  sign(data: any): string {
    const hashedData = SHA256(data);
    const signature = sign(
      KeyPair.signAlgorithm,
      Buffer.from(hashedData, 'hex'),
      {
        key: this.privateKey,
        type: 'pkcs8',
        format: 'der',
      }
    );
    return signature.toString('hex');
  }

  static verify({ publicKey, data, signature }: GlobalVerifyParams): boolean {
    const hashedData = SHA256(data);

    switch (publicKey.constructor.name) {
      case 'String':
        return verify(
          this.signAlgorithm,
          Buffer.from(hashedData, 'hex'),
          {
            key: publicKey,
            type: 'spki',
            format: 'der',
            encoding: 'hex',
          },
          Buffer.from(signature, 'hex')
        );
      case 'Buffer':
        return verify(
          this.signAlgorithm,
          Buffer.from(hashedData, 'hex'),
          { key: publicKey, type: 'spki', format: 'der' },
          Buffer.from(signature, 'hex')
        );
      default:
        console.error('you must specify a `publicKey`')
        return false;
    }
  }

  verify({ data, signature }: SelfVerifyParams): boolean {
    const hashedData = SHA256(data);

    return verify(
      KeyPair.signAlgorithm,
      Buffer.from(hashedData, 'hex'),
      { key: this.publicKey, type: 'spki', format: 'der' },
      Buffer.from(signature, 'hex')
    );
  }

  import({ publicKey, privateKey }: HexKeyPair) {
    if (!KeyPair.isValidHexKeyPair({ publicKey, privateKey })) return;

    this.publicKey = Buffer.from(publicKey, 'hex');
    this.privateKey = Buffer.from(privateKey, 'hex');
  }
}
