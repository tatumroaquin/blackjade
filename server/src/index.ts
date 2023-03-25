import express, { Request, Response, NextFunction } from 'express';
import fetch from 'node-fetch';
import Blockchain from './blockchain/chain.js';
import PubSub from './network/pubsub.redis.js';
import Wallet from './wallet/wallet.js';
import TransactionPool from './transaction/transaction-pool.js';
import TransactionMiner from './transaction/transaction-miner.js';
import { TransactionMap } from './transaction/transaction-pool.d.js';
import { NODE_ID } from './config.js';

const blockchain = new Blockchain();

const txpool = new TransactionPool();
const wallet = new Wallet();

const pubsub = new PubSub({ blockchain, txpool });

const txminer = new TransactionMiner({
  blockchain,
  txpool,
  pubsub,
});

const { ROOT_NODE_ADDRESS } = process.env;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS Policy
app.use((_: Request, res: Response, next: NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-Width, Content-Type, Accept, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE, OPTIONS'
  );
  next();
});

setTimeout(() => pubsub.broadcastChain(), 1000);

app.get('/api/blockchain', (_: Request, res: Response) => {
  res.json(blockchain);
});

app.get('/api/block/hash/:hashId', (req: Request, res: Response) => {
  const { hashId } = req.params;
  res.json(blockchain.findBlockByHash(hashId));
});

app.get('/api/block/index/:index', (req: Request, res: Response) => {
  const index = parseInt(req.params.index);
  res.json(blockchain.findBlockByIndex(index));
});

app.get('/api/tx-pool', (_: Request, res: Response) => {
  res.json(txpool.transactionMap);
});

app.get('/api/mine-txpool', (_: Request, res: Response) => {
  txminer.mineTransactions({ minerWallet: wallet });
  res.redirect('/api/blockchain');
});

app.post('/api/mine-block', (req: Request, res: Response) => {
  const { data } = req.body;
  blockchain.addBlock({ data });
  pubsub.broadcastChain();
  res.redirect('/api/blockchain');
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
  pubsub.broadcastTransaction(transaction!);
  res.json({ type: 'success', transaction });
});

async function syncBlockchains() {
  const response = await fetch(`${ROOT_NODE_ADDRESS}/api/blockchain`);
  if (!response.ok || response.type === 'error') {
    console.log('error fetching root node blockchain');
    return;
  }
  console.log(`sync chains event, fetching from root "${ROOT_NODE_ADDRESS}"`);
  const rootChain = (await response.json()) as Blockchain;
  blockchain.replaceChain({ blockchain: rootChain });
}

async function syncTransactionPool() {
  const response = await fetch(`${ROOT_NODE_ADDRESS}/api/tx-pool`);
  if (!response.ok || response.type === 'error') {
    console.error('failed to sync tx-pool with root node');
    return;
  }

  const rootTxPool = (await response.json()) as TransactionMap;
  txpool.setTransactionMap(rootTxPool);
  console.log(`sync tx-pool event, fetching from root "${ROOT_NODE_ADDRESS}"`);
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
  console.log(`Node ID: ${NODE_ID}`);
  (async () => {
    await syncBlockchains();
    await syncTransactionPool();
  })();
});
