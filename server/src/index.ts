import express, { Request, Response, NextFunction } from 'express';
import fetch from 'node-fetch';
import Block from './blockchain/block.js';
import Blockchain from './blockchain/chain.js';
import PubSub from './network/pubsub.redis.js';
import Wallet from './wallet/wallet.js';
import TransactionPool from './transaction/transaction-pool.js';
import TransactionMiner from './transaction/transaction-miner.js';
import { TransactionMap } from './transaction/transaction-pool.d.js';
import { NODE_ID } from './config.js';

import blockchainRouter from './router/blockchain.js';
import miningRouter from './router/mining.js';
import transactionRouter from './router/transaction.js';

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

app.locals.blockchain = new Blockchain();
app.locals.txpool = new TransactionPool();
app.locals.wallet = new Wallet();

app.locals.pubsub = new PubSub({
  blockchain: app.locals.blockchain,
  txpool: app.locals.txpool,
});

app.locals.txminer = new TransactionMiner({
  blockchain: app.locals.blockchain,
  txpool: app.locals.txpool,
  pubsub: app.locals.pubsub,
});

setTimeout(() => app.locals.pubsub.broadcastChain(), 1000);

app.use('/api', blockchainRouter);
app.use('/api', miningRouter);
app.use('/api', transactionRouter);

async function syncBlockchains() {
  const response = await fetch(`${ROOT_NODE_ADDRESS}/api/blockchain`);
  if (!response.ok || response.type === 'error') {
    console.log('error fetching root node blockchain');
    return;
  }
  console.log(`sync chains event, fetching from root "${ROOT_NODE_ADDRESS}"`);
  const paginatedResults = (await response.json()) as { data: Block[] };
  const rootChain = new Blockchain();
  rootChain.chain = paginatedResults.data;
  app.locals.blockchain.replaceChain({ blockchain: rootChain });
}

async function syncTransactionPool() {
  const response = await fetch(`${ROOT_NODE_ADDRESS}/api/tx-pool`);
  if (!response.ok || response.type === 'error') {
    console.error('failed to sync tx-pool with root node');
    return;
  }

  const rootTxPool = (await response.json()) as TransactionMap;
  app.locals.txpool.setTransactionMap(rootTxPool);
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
