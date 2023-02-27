import { v4 as uuid } from 'uuid';
import {
  Input,
  InputParams,
  Output,
  OutputParams,
  TransactionParams,
} from './transaction.d.js';

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
      balance: senderWallet.balance,
      signature: senderWallet.keypair.sign(output),
    };
  }
}
