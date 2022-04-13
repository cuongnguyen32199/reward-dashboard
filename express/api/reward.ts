import { Router, Request, Response, NextFunction } from 'express';

import { Logger } from '../lib/logger';
import * as controller from '../controllers/reward.controller';

const router = Router();
const logger = Logger.create(module);

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const items = req.query?.itemNftIds;
    const materials = req.query?.materialIds;

    let itemNfts: number[] = [];
    let materialIds: number[] = [];

    if (typeof items === 'string' && items) itemNfts = items.split(',').map((itemNft) => +itemNft);
    if (typeof materials === 'string' && materials) materialIds = materials.split(',').map((materialId) => +materialId);

    const rewards = await controller.filter(itemNfts, materialIds);

    return res.json({ success: true, data: rewards });
  } catch (error: any) {
    logger.error('Error', error?.message || error.toString());
    next(error);
  }
});

router.get('/claimed', async (_: Request, res: Response, next: NextFunction) => {
  try {
    const data = await controller.claimed();

    return res.json({ success: true, data });
  } catch (error: any) {
    logger.error('Error', error?.message || error.toString());
    next(error);
  }
});

router.get('/items', async (_: Request, res: Response, next: NextFunction) => {
  try {
    const data = await controller.itemNftRewards();

    return res.json({ success: true, data });
  } catch (error: any) {
    logger.error('Error', error?.message || error.toString());
    next(error);
  }
});

router.get('/materials', async (_: Request, res: Response, next: NextFunction) => {
  try {
    const data = await controller.materialRewards();

    return res.json({ success: true, data });
  } catch (error: any) {
    logger.error('Error', error?.message || error.toString());
    next(error);
  }
});

export default router;
