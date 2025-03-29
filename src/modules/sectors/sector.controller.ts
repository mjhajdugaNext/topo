import { Request, Response } from 'express';
import * as sectorService from './sector.service';

export const getAllSectors = async (req: Request, res: Response): Promise<void> => {
  const sectors = await sectorService.getAll();
  res.status(200).json(sectors);
};

export const getSectorById = async (req: Request, res: Response): Promise<void> => {
  const sector = await sectorService.getById(req.params.id);
  if (!sector) {
    res.status(404).json({ message: 'Sector not found' });
    return;
  }
  res.status(200).json(sector);
};

export const createSector = async (req: Request, res: Response): Promise<void> => {
  const newSector = await sectorService.create(req.body);
  res.status(201).json(newSector);
};

export const updateSector = async (req: Request, res: Response): Promise<void> => {
  const updatedSector = await sectorService.update(req.params.id, req.body);
  if (!updatedSector) {
    res.status(404).json({ message: 'Sector not found' });
    return;
  }
  res.status(200).json(updatedSector);
};

export const deleteSector = async (req: Request, res: Response): Promise<void> => {
  const deleted = await sectorService.deleteItem(req.params.id);
  if (!deleted) {
    res.status(404).json({ message: 'Sector not found' });
    return;
  }
  res.status(204).send();
};
