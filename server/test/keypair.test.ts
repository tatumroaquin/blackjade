import KeyPair from '../src/wallet/keypair.js';
import { base64UrlEncode, base64UrlDecode } from '../src/utility/base64url.js';

describe('KeyPair', () => {
  let kp: KeyPair;
  let _publicKey: string;
  let _privateKey: string;

  beforeEach(() => {
    kp = new KeyPair();
    _publicKey = kp.getPublicKey();
    _privateKey = kp.getPrivateKey();
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
    it('public key `secp256k1` is 64 bytes long', () => {
      expect(keypair.publicKey.byteLength).toBe(64);
    });
    it('contains a `privateKey` buffer', () => {
      expect(keypair.privateKey instanceof Buffer).toBe(true);
    });
    it('private key `secp256k1` is 96 bytes long', () => {
      expect(keypair.privateKey.byteLength).toBe(96);
    });
  });

  describe('getPublicKey()', () => {
    it('returns the `publicKey` of the keypair', () => {
      expect(kp.getPublicKey()).toEqual(
        kp.getKeyPair()['publicKey'].toString('hex')
      );
    });
  });

  describe('getPrivateKey()', () => {
    it('returns the `privateKey` of the keypair', () => {
      expect(kp.getPrivateKey()).toEqual(
        kp.getKeyPair()['privateKey'].toString('hex')
      );
    });
  });

  describe('verify()', () => {
    let data: string, signature: string;
    beforeEach(() => {
      data = 'SIGN DATA';
      signature = kp.sign(data);
    });
    describe('check verification WITHOUT `publicKey` parameter', () => {
      it('returns true when signature is valid', () => {
        expect(kp.verify({ data, signature })).toBe(true);
      });
      it('returns false when signature is NOT valid', () => {
        signature = signature.replace(/[0-9]/g, '2');
        signature = signature.replace(/[a-f]/g, '9');
        expect(kp.verify({ data, signature })).toBe(false);
      });
    });
    describe('check verification WITH `publicKey` parameter', () => {
      describe('and `publicKey` is a string', () => {
        let publicKey: string;
        beforeEach(() => {
          publicKey = kp.getPublicKey();
        });
        it('returns true when signature is valid', () => {
          expect(KeyPair.verify({ publicKey, data, signature })).toBe(true);
        });
        it('returns false when signature is NOT valid', () => {
          signature = signature.replace(/[0-9]/g, '2');
          signature = signature.replace(/[a-f]/g, '9');
          expect(KeyPair.verify({ publicKey, data, signature })).toBe(false);
        });
      });
      describe('and `publicKey` is a buffer', () => {
        let publicKey: string;
        beforeEach(() => {
          publicKey = kp.getPublicKey();
        });
        it('returns true when signature is valid', () => {
          expect(KeyPair.verify({ publicKey, data, signature })).toBe(true);
        });
        it('returns false when signature is NOT valid', () => {
          signature = signature.replace(/[0-9]/g, '2');
          signature = signature.replace(/[a-f]/g, '9');
          expect(KeyPair.verify({ publicKey, data, signature })).toBe(false);
        });
      });
    });
  });

  describe('import()', () => {
    let keypair: KeyPair = new KeyPair();
    let hexKeyPair: { publicKey: string; privateKey: string };
    let consoleErrorSpy: jest.SpyInstance;

    beforeEach(() => {
      keypair = new KeyPair();
      hexKeyPair = {
        publicKey: _publicKey,
        privateKey: _privateKey,
      };
      consoleErrorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(jest.fn());
    });

    afterEach(() => {
      consoleErrorSpy.mockReset();
    });

    afterAll(() => {
      consoleErrorSpy.mockRestore();
    });

    describe('the keypairs are valid hex keys', () => {
      describe('and the bytes are correct', () => {
        it('imports the new keypair', () => {
          keypair.import(hexKeyPair);
          expect(keypair.getPublicKey()).toEqual(kp.getPublicKey());
          expect(keypair.getPrivateKey()).toEqual(kp.getPrivateKey());
        });
      });

      describe('but the bytes are NOT correct', () => {
        describe('and `publicKey` is corrupted', () => {
          it('does NOT import the keys', () => {
            hexKeyPair.publicKey = hexKeyPair.publicKey.replace(/[0-9]/g, '1');
            hexKeyPair.publicKey = hexKeyPair.publicKey.replace(/[a-f]/g, '9');
            keypair.import(hexKeyPair);
            expect(keypair.getPublicKey()).not.toEqual(kp.getPublicKey());
            expect(keypair.getPrivateKey()).not.toEqual(kp.getPrivateKey());
            expect(consoleErrorSpy).toBeCalled();
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
            expect(keypair.getPublicKey()).not.toEqual(kp.getPublicKey());
            expect(keypair.getPrivateKey()).not.toEqual(kp.getPrivateKey());
            expect(consoleErrorSpy).toBeCalled();
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
          expect(keypair.getPublicKey()).not.toEqual(kp.getPublicKey());
          expect(keypair.getPrivateKey()).not.toEqual(kp.getPrivateKey());
          expect(consoleErrorSpy).toBeCalled();
        });
      });

      describe('`privateKey` is corrupted', () => {
        it('does NOT import the keys', () => {
          hexKeyPair.privateKey = hexKeyPair.privateKey.replace(/[0-9]/g, 'z');
          hexKeyPair.privateKey = hexKeyPair.privateKey.replace(/[a-f]/g, 'g');
          keypair.import(hexKeyPair);
          expect(keypair.getPublicKey()).not.toEqual(kp.getPublicKey());
          expect(keypair.getPrivateKey()).not.toEqual(kp.getPrivateKey());
          expect(consoleErrorSpy).toBeCalled();
        });
      });
    });
  });

  describe('publicKeyToJwk()', () => {
    it('converts `publicKey` Buffer to JWK', () => {
      const jwkTest = KeyPair.publicKeyToJwk(_publicKey);

      let [x, y] = KeyPair.splitKey(_publicKey, _publicKey.length / 2)!;

      const jwkResult = {
        kty: 'EC',
        crv: 'secp256k1',
        x: base64UrlEncode(x),
        y: base64UrlEncode(y),
      };

      expect(jwkTest).toEqual(jwkResult);
    });
  });

  describe('jwkToPublicKey()', () => {
    it('converts `publicKey` JWK to Buffer', () => {
      let [x, y] = KeyPair.splitKey(_publicKey, _publicKey.length / 2)!;

      const jwkPublicKey = {
        kty: 'EC',
        crv: 'secp256k1',
        x: base64UrlEncode(x),
        y: base64UrlEncode(y),
      };

      const buffPublicKeyTest = KeyPair.jwkToPublicKey(jwkPublicKey);
      const buffPublicKeyResult = Buffer.from(_publicKey, 'hex');

      expect(buffPublicKeyTest).toEqual(buffPublicKeyResult);
    });
  });

  describe('privateKeyToJwk()', () => {
    it('converts `privateKey` Buffer to JWK', () => {
      const jwkTest = KeyPair.privateKeyToJwk(_privateKey);

      let [x, y, d] = KeyPair.splitKey(_privateKey, _privateKey.length / 3)!;

      const jwkResult = {
        kty: 'EC',
        crv: 'secp256k1',
        x: base64UrlEncode(x),
        y: base64UrlEncode(y),
        d: base64UrlEncode(d),
      };

      expect(jwkTest).toEqual(jwkResult);
    });
  });

  describe('jwkToPrivateKey()', () => {
    it('converts `privateKey` JWK to Buffer', () => {
      let [x, y, d] = KeyPair.splitKey(_privateKey, _privateKey.length / 3)!;

      const jwkPrivateKey = {
        kty: 'EC',
        crv: 'secp256k1',
        x: base64UrlEncode(x),
        y: base64UrlEncode(y),
        d: base64UrlEncode(d),
      };

      const buffPrivateKeyTest = KeyPair.jwkToPrivateKey(jwkPrivateKey);
      const buffPrivateKeyResult = Buffer.from(_privateKey, 'hex');

      expect(buffPrivateKeyTest).toEqual(buffPrivateKeyResult);
    });
  });
});
