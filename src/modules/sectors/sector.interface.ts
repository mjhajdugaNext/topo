import mongoose from 'mongoose';
import { Crag } from '../crags/crag.interface';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface ISector {
  name: string;
  description?: string;
  coordinates?: Coordinates;
  crag: string;
}

export interface Sector extends mongoose.Document {
  _id: string;
  name: string;
  description?: string;
  coordinates?: Coordinates;
  crag: Crag | mongoose.Types.ObjectId;
}

export interface SectorToSave extends ISector {
  // Additional properties specific to saving, if any
}

export type PartialSector = Omit<Sector, never>; // You can replace 'never' with fields to omit if needed

export const SECTOR_DATA_TO_OMIT = ['__v', 'createdAt', 'updatedAt'];