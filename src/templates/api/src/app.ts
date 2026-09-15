import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import environmentConfig from './config/environment.config.js';
import errorMiddleware from './middlewares/error.middleware.js';
import router from './routes/index.js';

const app = express();

app.disable('x-powered-by');

app.use(helmet());
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(`/${environmentConfig.apiBaseRoute}/${environmentConfig.apiVersion}`, router);

app.use((_req, res) => {
  return res.status(404).json({
    success: false,
    message: 'Route not found.',
  });
});

app.use(errorMiddleware.handleError);

export default app;
