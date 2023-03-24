import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });

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

function sleep(seconds: number) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

function genTransaction() {
  const recipientWallet = new Wallet();

  return {
    recipientAddress: recipientWallet.getPublicKey(),
    amount: randomInt(1, 49),
  };
}

await conductTransaction(20);
async function conductTransaction(count: number) {
  if (count === 0) return;

  let message = genTransaction();

  POST(`${URL}/api/transact`, message);
  console.log('MESSAGE: ', message);
  await sleep(1);
  await conductTransaction(count - 1);
}
