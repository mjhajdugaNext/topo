import { Request, Response } from 'express';
import * as areaService from './area.service';

export async function getAllAreas(req: Request, res: Response): Promise<void> {
  const areas = await areaService.getAllAreas();
  res.status(200).json(areas);
}

export async function getAreaById(req: Request, res: Response): Promise<void> {
  const area = await areaService.getAreaById(req.params.id);
  if (!area) {
    res.status(404).json({ message: 'Area not found' });
    return;
  }
  res.status(200).json(area);
}

export async function createArea(req: Request, res: Response): Promise<void> {
  const area = await areaService.createArea(req.body);
  res.status(201).json(area);
}

export async function updateArea(req: Request, res: Response): Promise<void> {
  const area = await areaService.updateArea(req.params.id, req.body);
  if (!area) {
    res.status(404).json({ message: 'Area not found' });
    return;
  }
  res.status(200).json(area);
}

export async function deleteArea(req: Request, res: Response): Promise<void> {
  const area = await areaService.deleteArea(req.params.id);
  if (!area) {
    res.status(404).json({ message: 'Area not found' });
    return;
  }
  res.status(200).json({ message: 'Area deleted successfully' });
}
