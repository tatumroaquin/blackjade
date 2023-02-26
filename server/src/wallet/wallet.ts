import { INITIAL_BALANCE } from '../config.js';
import KeyPair from './keypair.js';

export default class Wallet {
  keypair: KeyPair;
  publicKey: string;
  privateKey: string;
  balance: number;

  constructor() {
    this.keypair = new KeyPair();
    this.publicKey = this.keypair.getPublicKey();
    this.privateKey = this.keypair.getPrivateKey();
    this.balance = INITIAL_BALANCE;
  }
}
