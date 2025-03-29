import { Request, Response } from 'express';
import * as routeService from './route.service';

export const getAllRoutes = async (req: Request, res: Response): Promise<void> => {
  const routes = await routeService.getRoutes();
  res.status(200).json(routes);
};

export const getRouteById = async (req: Request, res: Response): Promise<void> => {
  const route = await routeService.getRouteById(req.params.id);
  if (!route) {
    res.status(404).json({ message: 'Route not found' });
    return;
  }
  res.status(200).json(route);
};

export const createRoute = async (req: Request, res: Response): Promise<void> => {
  const newRoute = await routeService.createRoute(req.body);
  res.status(201).json(newRoute);
};

export const updateRoute = async (req: Request, res: Response): Promise<void> => {
  const updatedRoute = await routeService.updateRouteById(req.params.id, req.body);
  if (!updatedRoute) {
    res.status(404).json({ message: 'Route not found' });
    return;
  }
  res.status(200).json(updatedRoute);
};

export const deleteRoute = async (req: Request, res: Response): Promise<void> => {
  const deleted = await routeService.deleteRouteById(req.params.id);
  if (!deleted) {
    res.status(404).json({ message: 'Route not found' });
    return;
  }
  res.status(204).send();
};