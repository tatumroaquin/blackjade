import { INITIAL_BALANCE } from '../config.js';
import { HexKeyPair, SelfVerifyParams } from './keypair.d.js';
import { createTransactionParams, calculateBalanceParams } from './wallet.d.js';
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
    chain,
  }: createTransactionParams): Transaction | undefined {
    if (chain) {
      this.balance = Wallet.calculateBalance({
        chain,
        address: this.publicKey,
      });
    }

    if (amount > this.balance) {
      console.error('Amount exceeds balance');
      return;
    }

    return new Transaction({ senderWallet: this, recipientAddress, amount });
  }

  static calculateBalance({ chain, address }: calculateBalanceParams): number {
    let hasInputs = false;
    let outputsTotal = 0;

    for (let i = chain.length - 1; i > 0; --i) {
      const block = chain[i];

      block.data.forEach((tx: Transaction) => {
        if (tx.input.wallet === address) hasInputs = true;

        const outputAmount = tx.output[address];
        if (outputAmount) outputsTotal += outputAmount;
      });

      if (hasInputs) return outputsTotal;
    }

    return INITIAL_BALANCE + outputsTotal;
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

  getPublicKey() {
    return this.publicKey;
  }

  getPrivateKey() {
    return this.publicKey;
  }
}
