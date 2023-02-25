import { sign } from 'crypto';
import SHA256 from '../src/utility/sha256.js';
import KeyPair from '../src/wallet/keypair.js';

describe('KeyPair', () => {
  let kp: KeyPair;

  beforeEach(() => {
    kp = new KeyPair();
  });

  describe('initialise keypair with a pre-existing key', () => {
    it('imports the existing keypair to the new instance', () => {
      const newKeypair = new KeyPair(kp);
      expect(newKeypair.getPublicKey()).toEqual(kp.getPublicKey());
      expect(newKeypair.getPrivateKey()).toEqual(kp.getPrivateKey());
    });
  });

  describe('genKeyPair()', () => {
    const keypair = KeyPair.genKeyPair();

    it('returns a keypair object', () => {
      expect(typeof keypair === 'object').toBe(true);
    });
    it('contains a `publicKey` buffer', () => {
      expect(keypair.publicKey instanceof Buffer).toBe(true);
    });
    it('public key `secp256k1` is 88 bytes long', () => {
      expect(keypair.publicKey.byteLength).toBe(88);
    });
    it('contains a `privateKey` buffer', () => {
      expect(keypair.privateKey instanceof Buffer).toBe(true);
    });
    it('private key `secp256k1` is 135 bytes long', () => {
      expect(keypair.privateKey.byteLength).toBe(135);
    });
  });

  describe('getPublicKey()', () => {
    it('returns the `publicKey` of the keypair', () => {
      expect(kp.getPublicKey()).toEqual(kp.publicKey.toString('hex'));
    });
  });

  describe('getPrivateKey()', () => {
    it('returns the `privateKey` of the keypair', () => {
      expect(kp.getPrivateKey()).toEqual(kp.privateKey.toString('hex'));
    });
  });

  describe('verify()', () => {
    it('returns true when signature is valid', () => {
      const data = 'SIGN DATA';
      const signature = kp.sign('SIGN DATA');
      expect(kp.verify(data, signature)).toBe(true);
    });
    it('returns false when signature is NOT valid', () => {
      const data = 'SIGN DATA';
      let signature = kp.sign('SIGN DATA');
      signature = signature.replace(/[0-9]/g, '2');
      signature = signature.replace(/[a-f]/g, '9');
      expect(kp.verify(data, signature)).toBe(false);
    });
  });
});
