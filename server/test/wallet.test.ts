import Wallet from '../src/wallet/wallet.js'
import KeyPair from '../src/wallet/keypair.js'
import { INITIAL_BALANCE } from '../src/config.js';

describe('Wallet', () => {
  let wallet: Wallet;

  beforeEach(() => {
    wallet = new Wallet();
  });

  describe('check properties', () => {
    it('has a `keypair` instance', () => {
      expect(wallet.keypair instanceof KeyPair).toBe(true);
    });
    it('has a `publicKey` exported from `keypair`', () => {
      expect(wallet.publicKey).toEqual(wallet.keypair.getPublicKey())
    });
    it('has a `privateKey` exported from `keypair`', () => {
      expect(wallet.privateKey).toEqual(wallet.keypair.getPrivateKey())
    });
    it('has a `balance` equal to `INITIAL_BALANCE`', () => {
      expect(wallet.balance).toEqual(INITIAL_BALANCE);
    });
  })
})
