import mongoose, { Schema, Document } from 'mongoose';
import { Sector } from './sector.interface';

const CoordinatesSchema = new Schema(
  {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  { _id: false }
);

const SectorSchema = new Schema(
  {
    name: { type: String, required: true },
    coordinates: { type: CoordinatesSchema, required: true },
    description: { type: String, required: false },
    crag: { type: Schema.Types.ObjectId, ref: 'Crag', required: true },
  },
  { timestamps: true }
);

export const SectorModel = mongoose.model<Sector & Document>('Sector', SectorSchema);
