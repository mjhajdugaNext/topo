import mongoose from 'mongoose';
import { Crag } from '../crags/crag.interface';
import { Sector } from '../sectors/sector.interface';
import { Area } from '../areas/area.interface';

export enum RouteType {
  SPORT = 'SPORT',
  TRAD = 'TRAD',
  BOULDER = 'BOULDER',
  AID = 'AID',
  MIXED = 'MIXED',
  ICE = 'ICE',
  ALPINE = 'ALPINE',
  MULTIPITCH = 'MULTIPITCH'
}

export interface Route extends mongoose.Document {
  _id: string;
  name: string;
  grade: string;
  length?: number;
  description?: string;
  firstAscent?: string;
  sector: Sector | mongoose.Types.ObjectId;
  crag: Crag | mongoose.Types.ObjectId;
  area?: Area| mongoose.Types.ObjectId;
  country: string;
  type: RouteType;
}
