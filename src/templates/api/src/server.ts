import 'dotenv/config';
import app from './app.js';
import environmentConfig from './config/environment.config.js';

const server = app.listen(environmentConfig.port, () => {
  console.log(
    `API running on http://localhost:${environmentConfig.port}/${environmentConfig.apiBaseRoute}/${environmentConfig.apiVersion}`,
  );
});

export default server;
