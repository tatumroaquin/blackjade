import { INITIAL_BALANCE } from '../config.js';
import { HexKeyPair, SelfVerifyParams } from './keypair.d.js';
import { createTransactionParams } from './wallet.d.js';
import KeyPair from './keypair.js';
import Transaction from '../transaction/transaction.js';

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

  createTransaction({
    recipientAddress,
    amount,
  }: createTransactionParams): Transaction | undefined {
    if (amount > this.balance) {
      console.error('Amount exceeds balance');
      return;
    }

    return new Transaction({ senderWallet: this, recipientAddress, amount });
  }

  sign(data: any): string {
    return this.keypair.sign(data);
  }

  verify({ data, signature }: SelfVerifyParams): boolean {
    return this.keypair.verify({ data, signature });
  }

  import({ publicKey, privateKey }: HexKeyPair) {
    this.keypair.import({ publicKey, privateKey });
  }
}
