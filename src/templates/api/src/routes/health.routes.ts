import { Router } from 'express';

const healthRouter = Router();

healthRouter.get('/', (_req, res) => {
  return res.status(200).json({
    success: true,
    message: 'API is healthy.',
  });
});

export default healthRouter;
