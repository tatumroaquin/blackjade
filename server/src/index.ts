import express, { Request, Response } from 'express';
import Blockchain from './blockchain/chain.js';
import PubSub from './pubsub.js';

const app = express();
const blockchain = new Blockchain();
const pubsub = new PubSub({ blockchain });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

setTimeout(() => pubsub.broadcastChain(), 1000)

app.get('/api/blocks', (_: Request, res: Response) => {
  res.json(blockchain.chain);
});

app.post('/api/mine', (req: Request, res: Response) => {
  const { data } = req.body;
  blockchain.addBlock({ data });
  pubsub.broadcastChain();
  res.redirect('/api/blocks');
});

const ROOT_PORT = process.env.PORT ?? 3000;
let PEER_PORT: number | undefined;

if (Boolean(process.env.LOCAL_PEER) === true) {
  PEER_PORT = Number(ROOT_PORT) + Math.floor(Math.random() * 1000);
}

const PORT = PEER_PORT ?? ROOT_PORT;

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
