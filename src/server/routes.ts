import express, { type Router } from 'express';
import * as userController from '../modules/users/user.controller';
import * as routeController from '../modules/route/route.controller';
import * as sectorController from '../modules/sectors/sector.controller';
import * as cragController from '../modules/crags/crag.controller';
import { authenticate } from './middlewares';

const router = express.Router();

const authenticationRouter = (router: Router) => {
  router.post('/auth/register', userController.register);
  router.post('/auth/login', userController.login)
  router.get('/users', authenticate, (req, res) => {
    res.status(200).json({ message: 'middleware working' }).end();
  })
};

const routeRouter = (router: Router) => {
  router.get('/routes', routeController.getAllRoutes);
  router.get('/routes/:id', routeController.getRouteById);
  router.post('/routes', authenticate, routeController.createRoute);
  router.put('/routes/:id', authenticate, routeController.updateRoute);
  router.delete('/routes/:id', authenticate, routeController.deleteRoute);
};

const sectorRouter = (router: Router) => {
  router.get('/sectors', sectorController.getAllSectors);
  router.get('/sectors/:id', sectorController.getSectorById);
  router.post('/sectors', authenticate, sectorController.createSector);
  router.put('/sectors/:id', authenticate, sectorController.updateSector);
  router.delete('/sectors/:id', authenticate, sectorController.deleteSector);
};

const cragRouter = (router: Router) => {
  router.get('/crags', cragController.getAllCrags);
  router.get('/crags/:id', cragController.getCragById);
  router.post('/crags', authenticate, cragController.createCrag);
  router.put('/crags/:id', authenticate, cragController.updateCrag);
  router.delete('/crags/:id', authenticate, cragController.deleteCrag);
};

export default (): Router => {
  authenticationRouter(router);
  routeRouter(router);
  sectorRouter(router);
  cragRouter(router);
  return router;
};
