import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

import fetch from 'node-fetch';
import Wallet from '../src/wallet/wallet.js';
import Transaction from '../src/transaction/transaction.js';

const URL = process.env.ROOT_NODE_ADDRESS!;

function POST(url: string, data: object) {
  (async () => {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  })();
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function genTransaction(): Transaction {
  const senderWallet = new Wallet();
  const recipientWallet = new Wallet();

  return senderWallet.createTransaction({
    recipientAddress: recipientWallet.getPublicKey(),
    amount: randomInt(1, 49),
  })!;
}

function sleep(seconds: number) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

await sendTransactions(20);
async function sendTransactions(count: number) {
  if (count === 0) return;

  const transactions: Transaction[] = [];
  for (let j = 0; j < 2; j++) {
    transactions.push(genTransaction());
  }
  transactions.push(Transaction.rewardMiner({ minerWallet: new Wallet() }));
  const message = { data: transactions };

  POST(`${URL}/api/mine-block`, message)
  console.log('sent one request');
  await sleep(7);
  await sendTransactions(count - 1);
}
