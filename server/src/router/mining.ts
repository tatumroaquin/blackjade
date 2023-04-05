import { Router, Request, Response, NextFunction } from 'express';

const router = Router();

router.get('/mine-txpool', (req: Request, res: Response) => {
  req.app.locals.txminer.mineTransactions({
    minerWallet: req.app.locals.wallet,
  });
  res.redirect('/api/blockchain');
});

router.post('/mine-block', (req: Request, res: Response) => {
  const { data } = req.body;
  req.app.locals.blockchain.addBlock({ data });
  req.app.locals.pubsub.broadcastChain();
  res.redirect('/api/blockchain');
});

export default router;
