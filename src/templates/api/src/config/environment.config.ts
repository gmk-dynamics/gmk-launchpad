import {
  DEFAULT_API_BASE_ROUTE,
  DEFAULT_API_VERSION,
  DEFAULT_PORT,
} from '../shared/constants/app.constants.js';

const environmentConfig = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || DEFAULT_PORT,
  apiBaseRoute: process.env.API_BASE_ROUTE || DEFAULT_API_BASE_ROUTE,
  apiVersion: process.env.API_VERSION || DEFAULT_API_VERSION,
};

export default environmentConfig;
