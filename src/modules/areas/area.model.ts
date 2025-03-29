import mongoose, { Schema, Document } from 'mongoose';
import { Area } from './area.interface';

const AreaSchema = new Schema({
  name: { type: String, required: true },
  coordinates: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  description: { type: String, required: true },
  country: { type: String, required: true },
}, { timestamps: true });

export const AreaModel = mongoose.model<Area & Document>('Area', AreaSchema);
