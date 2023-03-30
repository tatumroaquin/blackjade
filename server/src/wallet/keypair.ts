import {
  generateKeyPairSync,
  sign,
  verify,
  createPublicKey,
  createPrivateKey,
  JsonWebKey,
} from 'crypto';
import { base64UrlEncode, base64UrlDecode } from '../utility/base64url.js';
import SHA256 from '../utility/sha256.js';
import { HexKeyPair, SelfVerify, GlobalVerify } from './keypair.d.js';

// TODO: Convert PublicKey from DER TO JWK
export default class KeyPair {
  private publicKey: Buffer;
  private privateKey: Buffer;
  static signAlgorithm?: string;

  constructor(keypair: KeyPair | undefined = undefined) {
    KeyPair.signAlgorithm = 'SHA256';

    if (keypair && KeyPair.isValidKeyPair(keypair)) {
      this.publicKey = keypair!.publicKey;
      this.privateKey = keypair!.privateKey;
      return;
    }

    const { publicKey, privateKey } = KeyPair.genKeyPair();
    this.publicKey = publicKey;
    this.privateKey = privateKey;
  }

  static genKeyPair(): { publicKey: Buffer; privateKey: Buffer } {
    const kp = generateKeyPairSync('ec', {
      namedCurve: 'secp256k1',
    });

    const publicKey = KeyPair.jwkToPublicKey(
      kp.publicKey.export({ format: 'jwk' })
    );
    const privateKey = KeyPair.jwkToPrivateKey(
      kp.privateKey.export({ format: 'jwk' })
    );

    return { publicKey, privateKey };
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

    if (publicKey.length !== 64 * 2) {
      console.error('publicKey length is NOT isValid');
      return false;
    }

    if (privateKey.length !== 96 * 2) {
      console.error('privateKey length is NOT isValid');
      return false;
    }

    if (!KeyPair.isValidKeyBytes(publicKey, 'public')) {
      console.error('publicKey invalid bytes');
      return false;
    }

    if (!KeyPair.isValidKeyBytes(privateKey, 'private')) {
      console.error('privateKey invalid bytes');
      return false;
    }

    return true;
  }

  static isValidKeyPair(keypair: KeyPair | undefined) {
    if (!keypair) {
      console.error('!keypair', keypair);
      return false;
    }

    if (!(keypair instanceof KeyPair)) {
      console.error('!(keypair instanceof KeyPair)');
      return false;
    }

    if (!(keypair.publicKey instanceof Buffer)) {
      console.error('!(keypair.publicKey instanceof Buffer)');
      return false;
    }

    if (!(keypair.privateKey instanceof Buffer)) {
      console.error('!(keypair.privateKey instanceof Buffer)');
      return false;
    }

    if (keypair.publicKey.byteLength !== 64) {
      console.error('publicKey byte length', keypair.publicKey.byteLength);
      return false;
    }

    if (keypair.privateKey.byteLength !== 96) {
      console.error('privateKey byte length', keypair.privateKey.byteLength);
      return false;
    }

    if (!KeyPair.isValidKeyBytes(keypair.publicKey, 'public')) {
      console.error('publicKey invalid bytes');
      return false;
    }

    if (!KeyPair.isValidKeyBytes(keypair.privateKey, 'private')) {
      console.error('privateKey invalid bytes');
      return false;
    }

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
          key: KeyPair.publicKeyToJwk(key),
          format: 'jwk',
        });
      }
      if (type === 'private') {
        createPrivateKey({
          key: KeyPair.privateKeyToJwk(key),
          format: 'jwk',
        });
      }
    } catch (error) {
      console.error(error);
      return false;
    }

    return true;
  }

  getPublicKey(): string {
    const { x, y } = KeyPair.publicKeyToJwk(this.publicKey);
    const publicKey = base64UrlDecode(x!) + base64UrlDecode(y!);
    return publicKey;
  }

  getPrivateKey(): string {
    const { x, y, d } = KeyPair.privateKeyToJwk(this.privateKey);
    const privateKey =
      base64UrlDecode(x!) + base64UrlDecode(y!) + base64UrlDecode(d!);
    return privateKey;
  }

  getKeyPair(): { publicKey: Buffer; privateKey: Buffer } {
    return { publicKey: this.publicKey, privateKey: this.privateKey };
  }

  sign(data: any): string {
    const hashedData = SHA256(data);

    let key = createPrivateKey({
      key: KeyPair.privateKeyToJwk(this.privateKey),
      format: 'jwk',
    });

    const signature = sign(
      KeyPair.signAlgorithm,
      Buffer.from(hashedData, 'hex'),
      { key, format: 'der' }
    );

    return signature.toString('hex');
  }

  static verify({ publicKey, data, signature }: GlobalVerify): boolean {
    const hashedData = SHA256(data);

    let key = createPublicKey({
      key: KeyPair.publicKeyToJwk(publicKey),
      format: 'jwk',
    });

    switch (publicKey.constructor.name) {
      case 'String': {
        return verify(
          this.signAlgorithm,
          Buffer.from(hashedData, 'hex'),
          key,
          Buffer.from(signature, 'hex')
        );
      }
      case 'Buffer': {
        return verify(
          this.signAlgorithm,
          Buffer.from(hashedData, 'hex'),
          key,
          Buffer.from(signature, 'hex')
        );
      }
      default:
        console.error('you must specify a `publicKey`');
        return false;
    }
  }

  static splitKey(key: string, length: number) {
    return key.match(new RegExp(`.{1,${length}}`, 'g'));
  }

  static jwkToPublicKey(publicKey: JsonWebKey): Buffer {
    let { x, y } = publicKey;

    x = base64UrlDecode(x!);
    y = base64UrlDecode(y!);

    return Buffer.from(x + y, 'hex');
  }

  // https://www.rfc-editor.org/rfc/rfc7517#section-3
  static publicKeyToJwk(publicKey: string | Buffer): JsonWebKey {
    if (publicKey instanceof Buffer) publicKey = publicKey.toString('hex');
    let [x, y] = KeyPair.splitKey(publicKey, publicKey.length / 2)!;

    x = base64UrlEncode(x);
    y = base64UrlEncode(y);

    const jwk = {
      kty: 'EC',
      x,
      y,
      crv: 'secp256k1',
    };

    return jwk;
  }

  static jwkToPrivateKey(privateKey: JsonWebKey): Buffer {
    let { x, y, d } = privateKey;

    x = base64UrlDecode(x!);
    y = base64UrlDecode(y!);
    d = base64UrlDecode(d!);

    return Buffer.from(x + y + d, 'hex');
  }

  static privateKeyToJwk(privateKey: string | Buffer): JsonWebKey {
    if (privateKey instanceof Buffer) privateKey = privateKey.toString('hex');
    let [x, y, d] = KeyPair.splitKey(privateKey, privateKey.length / 3)!;

    x = base64UrlEncode(x);
    y = base64UrlEncode(y);
    d = base64UrlEncode(d);

    const jwk = {
      kty: 'EC',
      crv: 'secp256k1',
      x,
      y,
      d,
    };

    return jwk;
  }

  verify({ data, signature }: SelfVerify): boolean {
    const hashedData = SHA256(data);

    let key = createPublicKey({
      key: KeyPair.publicKeyToJwk(this.publicKey),
      format: 'jwk',
    });

    return verify(
      KeyPair.signAlgorithm,
      Buffer.from(hashedData, 'hex'),
      key,
      Buffer.from(signature, 'hex')
    );
  }

  import({ publicKey, privateKey }: HexKeyPair) {
    if (!KeyPair.isValidHexKeyPair({ publicKey, privateKey })) {
      console.error('hex keypair invalid');
      return;
    }

    // const jwkPublicKey = KeyPair.publicKeyToJwk(publicKey);
    // const jwkPrivateKey = KeyPair.privateKeyToJwk(privateKey);

    this.publicKey = Buffer.from(publicKey, 'hex');
    this.privateKey = Buffer.from(privateKey, 'hex');
  }
}
