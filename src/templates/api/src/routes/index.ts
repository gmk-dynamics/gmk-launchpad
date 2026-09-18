import { Router } from 'express';

import healthRouter from './health.routes.js';

// GMK:MODULE_IMPORTS

const router = Router();

router.use('/health', healthRouter);

// GMK:MODULE_ROUTES

export default router;
