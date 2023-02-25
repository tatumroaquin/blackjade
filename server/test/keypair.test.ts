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

  describe('import()', () => {
    let keypair: KeyPair = new KeyPair();
    let hexKeyPair: { publicKey: string; privateKey: string };

    beforeEach(() => {
      keypair = new KeyPair();
      hexKeyPair = {
        publicKey: kp.getPublicKey(),
        privateKey: kp.getPrivateKey(),
      };
    });

    describe('the keypairs are valid hex keys', () => {
      describe('and the bytes are correct', () => {
        it('imports the new keypair', () => {
          keypair.import(hexKeyPair);
          expect(keypair.publicKey.equals(kp.publicKey)).toBe(true);
          expect(keypair.privateKey.equals(kp.privateKey)).toBe(true);
        });
      });
      describe('but the bytes are NOT correct', () => {
        describe('and `publicKey` is corrupted', () => {
          it('does NOT import the keys', () => {
            hexKeyPair.publicKey = hexKeyPair.publicKey.replace(/[0-9]/g, '1');
            hexKeyPair.publicKey = hexKeyPair.publicKey.replace(/[a-f]/g, '9');
            keypair.import(hexKeyPair);
            expect(keypair.publicKey.equals(kp.publicKey)).toBe(false);
            expect(keypair.privateKey.equals(kp.privateKey)).toBe(false);
          });
        });
        describe('and `privateKey` is corrupted', () => {
          it('does NOT import the keys', () => {
            hexKeyPair.privateKey = hexKeyPair.privateKey.replace(
              /[0-9]/g,
              '1'
            );
            hexKeyPair.privateKey = hexKeyPair.privateKey.replace(
              /[a-f]/g,
              '9'
            );
            keypair.import(hexKeyPair);
            expect(keypair.publicKey.equals(kp.publicKey)).toBe(false);
            expect(keypair.privateKey.equals(kp.privateKey)).toBe(false);
          });
        });
      });
    });

    describe('the keypairs are NOT valid hex keys', () => {
      describe('`publicKey` is corrupted', () => {
        it('does NOT import the keys', () => {
          hexKeyPair.publicKey = hexKeyPair.publicKey.replace(/[0-9]/g, 'z');
          hexKeyPair.publicKey = hexKeyPair.publicKey.replace(/[a-f]/g, 'g');
          keypair.import(hexKeyPair);
          expect(keypair.publicKey.equals(kp.publicKey)).toBe(false);
          expect(keypair.privateKey.equals(kp.privateKey)).toBe(false);
        });
      });

      describe('`privateKey` is corrupted', () => {
        it('does NOT import the keys', () => {
          hexKeyPair.privateKey = hexKeyPair.privateKey.replace(/[0-9]/g, 'z');
          hexKeyPair.privateKey = hexKeyPair.privateKey.replace(/[a-f]/g, 'g');
          keypair.import(hexKeyPair);
          expect(keypair.publicKey.equals(kp.publicKey)).toBe(false);
          expect(keypair.privateKey.equals(kp.privateKey)).toBe(false);
        });
      });
    });
  });
});
