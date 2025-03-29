import mongoose from 'mongoose';
import { Area } from '../areas/area.interface';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface ICrag {
  name: string;
  description?: string;
  coordinates: Coordinates;
  parkingCoordinates?: Coordinates;
  area: string;
}

export interface Crag extends mongoose.Document {
  _id: string;
  description?: string;
  coordinates: Coordinates;
  parkingCoordinates?: Coordinates;
  area: Area | mongoose.Types.ObjectId;
}

export interface CragToSave extends ICrag {
  // Additional properties specific to saving, if any
}

export type PartialCrag = Omit<Crag, never>; // You can replace 'never' with fields to omit if needed

export const CRAG_DATA_TO_OMIT = ['__v', 'createdAt', 'updatedAt'];