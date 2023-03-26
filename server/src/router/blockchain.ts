import { Router, Request, Response } from 'express';
import { paginate } from '../middleware/paginate.js';

const router = Router();

router.get('/blockchain', paginate('blockchain'), (req: Request, res: Response) => {
  res.json(res.locals.result)
});

router.get('/block/hash/:hashId', (req: Request, res: Response) => {
  const { hashId } = req.params;
  const block = req.app.locals.blockchain.findBlockByHash(hashId);
  res.json(block);
});

router.get('/block/index/:index', (req: Request, res: Response) => {
  const index = parseInt(req.params.index);
  const block = req.app.locals.blockchain.findBlockByIndex(index);
  res.json(block);
});

export default router;
