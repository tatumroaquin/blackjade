import { Router, Request, Response } from 'express';
import Wallet from '../wallet/wallet.js';

const router = Router();

router.get('/tx-pool', (req: Request, res: Response) => {
  const { transactionMap } = req.app.locals.txpool;
  res.json(transactionMap);
});

router.post('/transact', (req: Request, res: Response) => {
  const { recipientAddress, amount } = req.body;
  console.log(recipientAddress, amount);

  const wallet = new Wallet();

  let transaction = req.app.locals.txpool.getExistingTransaction({
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
  req.app.locals.txpool.addTransaction(transaction!);
  req.app.locals.pubsub.broadcastTransaction(transaction!);
  res.json({ type: 'success', transaction });
});

export default router;
