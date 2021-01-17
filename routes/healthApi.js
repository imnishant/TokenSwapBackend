import express from 'express';
import HealthController from '../app/Controllers/HealthController';

const HealthApiRouter = express.Router();

HealthApiRouter.get('/v1/', (request, response) => {
  const healthController = new HealthController(response);
  healthController.checkHealth(request);
});

export default HealthApiRouter;
