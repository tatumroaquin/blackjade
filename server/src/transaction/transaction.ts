import { v4 as uuid } from 'uuid';
import {
  Input,
  InputParams,
  Output,
  OutputParams,
  TransactionParams,
  UpdateParams,
  RewardMinerParams,
} from './transaction.d.js';
import KeyPair from '../wallet/keypair.js';
import Wallet from '../wallet/wallet.js';
import { MINING_REWARD } from '../config.js';

export default class Transaction {
  id: string;
  input: Input;
  output: Output;

  constructor({
    senderWallet,
    recipientAddress,
    amount,
    input,
    output,
  }: TransactionParams) {
    this.id = uuid();

    if (senderWallet && recipientAddress && amount) {
      this.output = this.createOutput({
        senderWallet,
        recipientAddress,
        amount,
      });
      this.input = this.createInput({ senderWallet, output: this.output });
      return;
    }

    this.output = output!;
    this.input = input!;
  }

  createOutput({
    senderWallet,
    recipientAddress,
    amount,
  }: OutputParams): Output {
    return {
      [recipientAddress]: amount,
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

  update({ senderWallet, recipientAddress, amount }: UpdateParams) {
    if (amount > this.output[senderWallet.getPublicKey()]) {
      console.error(`Amount ${amount} exceeds balance.`);
      return;
    }

    if (!this.output[recipientAddress]) {
      this.output[recipientAddress] = amount;
    } else {
      this.output[recipientAddress] += amount;
    }

    this.output[senderWallet.getPublicKey()] -= amount;

    this.input = this.createInput({ senderWallet, output: this.output });
  }

  static rewardMiner({ minerWallet }: RewardMinerParams): Transaction {
    const rewardWallet = new Wallet();

    const rewardOutput = {
      [minerWallet.getPublicKey()]: MINING_REWARD,
    };

    const rewardInput = {
      timestamp: Date.now(),
      wallet: rewardWallet.getPublicKey(),
      amount: MINING_REWARD,
      signature: rewardWallet.sign(rewardOutput),
      type: 'MINER-REWARD',
    };

    return new this({
      input: rewardInput,
      output: rewardOutput,
    });
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
