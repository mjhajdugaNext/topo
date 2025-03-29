import mongoose, { Schema, Document } from 'mongoose';
import { Route, RouteType } from './route.interface';

const RouteSchema = new Schema({
  name: { type: String, required: true },
  officialGrade: { type: String, required: true },
  type: { 
    type: String, 
    enum: Object.values(RouteType),
    required: true 
  },
  area: { type: Schema.Types.ObjectId, ref: 'Area', required: true },
  crag: { type: Schema.Types.ObjectId, ref: 'Crag', required: true },
  sector: { type: Schema.Types.ObjectId, ref: 'Sector', required: true },
}, { timestamps: true });

export const RouteModel = mongoose.model<Route & Document>('Route', RouteSchema);
