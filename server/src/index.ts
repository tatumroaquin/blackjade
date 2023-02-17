import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import Blockchain from './blockchain/chain.js';

dotenv.config()

const app = express();
const blockchain = new Blockchain();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/blocks', (_: Request, res: Response) => {
  res.json(blockchain.chain);
});

app.post('/api/mine', (req: Request, res: Response) => {
  const { data } = req.body;
  blockchain.addBlock({ data });
  res.redirect('/api/blocks');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
