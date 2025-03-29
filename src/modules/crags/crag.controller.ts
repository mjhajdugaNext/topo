import { Request, Response } from 'express';
import * as cragService from './crag.service';

export const getAllCrags = async (req: Request, res: Response): Promise<void> => {
  const crags = await cragService.getAll();
  res.status(200).json(crags);
};

export const getCragById = async (req: Request, res: Response): Promise<void> => {
  const crag = await cragService.getById(req.params.id);
  if (!crag) {
    res.status(404).json({ message: 'Crag not found' });
    return;
  }
  res.status(200).json(crag);
};

export const createCrag = async (req: Request, res: Response): Promise<void> => {
  const newCrag = await cragService.create(req.body);
  res.status(201).json(newCrag);
};

export const updateCrag = async (req: Request, res: Response): Promise<void> => {
  const updatedCrag = await cragService.update(req.params.id, req.body);
  if (!updatedCrag) {
    res.status(404).json({ message: 'Crag not found' });
    return;
  }
  res.status(200).json(updatedCrag);
};

export const deleteCrag = async (req: Request, res: Response): Promise<void> => {
  const deleted = await cragService.deleteItem(req.params.id);
  if (!deleted) {
    res.status(404).json({ message: 'Crag not found' });
    return;
  }
  res.status(204).send();
};
