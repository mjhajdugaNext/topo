import mongoose, { Schema, Document } from 'mongoose';
import { Crag } from './crag.interface';

const CoordinatesSchema = new Schema({
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
}, { _id: false });

const CragSchema = new Schema({
  name: { type: String, required: true },
  coordinates: { type: CoordinatesSchema, required: true },
  description: { type: String, required: false },
  area: { type: Schema.Types.ObjectId, ref: 'Area', required: true },
}, { timestamps: true });

export const CragModel = mongoose.model<Crag & Document>('Crag', CragSchema);
