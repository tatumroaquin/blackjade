import express, { Request, Response } from 'express';
import fetch from 'node-fetch';
import Block from './blockchain/block.js';
import Blockchain from './blockchain/chain.js';
import PubSub from './pubsub.js';
import Wallet from './wallet/wallet.js';
import TransactionPool from './transaction/transaction-pool.js';

const blockchain = new Blockchain();
const pubsub = new PubSub({ blockchain });
const { ROOT_NODE_ADDRESS } = process.env;

const txpool = new TransactionPool();
const wallet = new Wallet();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

setTimeout(() => pubsub.broadcastChain(), 1000);

app.get('/api/blocks', (_: Request, res: Response) => {
  res.json(blockchain.chain);
});

app.get('/api/tx-pool', (_: Request, res: Response) => {
  res.json(txpool.transactionMap);
});

app.post('/api/mine', (req: Request, res: Response) => {
  const { data } = req.body;
  blockchain.addBlock({ data });
  pubsub.broadcastChain();
  res.redirect('/api/blocks');
});

app.post('/api/transact', (req: Request, res: Response) => {
  const { recipientAddress, amount } = req.body;
  console.log(recipientAddress, amount);

  let transaction = txpool.getExistingTransaction({
    inputAddress: wallet.getPublicKey(),
  });

  try {
    if (transaction) {
      transaction.update({
        senderWallet: wallet,
        recipientAddress,
        amount,
      });
    } else {
      transaction = wallet.createTransaction({
        recipientAddress,
        amount,
      });
    }
  } catch (error: any) {
    res.status(400);
    res.json({ type: 'error', message: error.message });
  }
  txpool.addTransaction(transaction!);
  res.json({ type: 'success', transaction });
});

async function syncBlockchains() {
  const response = await fetch(`${ROOT_NODE_ADDRESS}/api/blocks`);
  if (!response.ok || response.type === 'error') {
    console.log('error fetching root node blockchain');
    return;
  }
  console.log(`sync chains event, fetching from root "${ROOT_NODE_ADDRESS}"`);
  const rootChain = (await response.json()) as Block[];
  blockchain.replaceChain(rootChain);
}

function getPortNumber() {
  const LOCAL_PEER = Boolean(process.env.LOCAL_PEER);
  const ROOT_PORT = process.env.PORT ?? 3000;
  if (!LOCAL_PEER) return ROOT_PORT;

  return Number(ROOT_PORT) + Math.floor(Math.random() * 1000);
}

const PORT = getPortNumber();
app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
  (async () => {
    await syncBlockchains();
  })();
});
