import { v4 as uuid } from 'uuid';
import {
  Input,
  InputParams,
  Output,
  OutputParams,
  TransactionParams,
} from './transaction.d.js';
import KeyPair from '../wallet/keypair.js';

export default class Transaction {
  id: string;
  input: Input;
  output: Output;

  constructor({
    senderWallet,
    receiverWallet,
    amount,
    input,
    output,
  }: TransactionParams) {
    this.id = uuid();
    this.output =
      output || this.createOutput({ senderWallet, receiverWallet, amount });
    this.input =
      input || this.createInput({ senderWallet, output: this.output });
  }

  createOutput({ senderWallet, receiverWallet, amount }: OutputParams): Output {
    return {
      [receiverWallet.keypair.getPublicKey()]: amount,
      [senderWallet.keypair.getPublicKey()]: senderWallet.balance - amount,
    };
  }

  createInput({ senderWallet, output }: InputParams): Input {
    return {
      timestamp: Date.now(),
      wallet: senderWallet.keypair.getPublicKey(),
      amount: senderWallet.balance,
      signature: senderWallet.keypair.sign(output),
    };
  }

  static isValidTransaction(transaction: Transaction): boolean {
    const { input, output } = transaction;

    const totalOutput = Object.values(output).reduce(
      (total, amount) => total + amount
    );

    if (totalOutput !== input.amount) {
      console.error(`invalid transaction from ${input.wallet}`);
      return false;
    }

    if (
      !KeyPair.verify({
        publicKey: input.wallet,
        data: output,
        signature: input.signature,
      })
    ) {
      console.error(`invalid signature from ${input.wallet}`);
      return false;
    }

    return true;
  }
}
