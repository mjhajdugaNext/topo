import mongoose, { Schema, Document } from 'mongoose';
import { Sector } from './sector.interface';

const CoordinatesSchema = new Schema({
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
}, { _id: false });

const SectorSchema = new Schema({
  name: { type: String, required: true },
  coordinates: { type: CoordinatesSchema, required: true },
  parkingCoordinates: { type: CoordinatesSchema, required: false },
  parkingInfo: { type: String, required: false },
  description: { type: String, required: false },
}, { timestamps: true });

export const SectorModel = mongoose.model<Sector & Document>('Sector', SectorSchema);
