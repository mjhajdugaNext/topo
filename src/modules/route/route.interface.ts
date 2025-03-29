import mongoose from 'mongoose';
import { Document } from 'mongoose';
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


export interface IRoute {
  name: string;
  grade: number;
  description?: string;
  length?: number;
  crag: string;
  area?: string;
  sector: string;
  country: string;
  type: string;
}

export interface RouteModel extends IRoute, Document {}


export const ROUTE_DATA_TO_OMIT = ['__v'];

export type PartialRoute = Omit<Route, typeof ROUTE_DATA_TO_OMIT[number]>;

export interface Route extends mongoose.Document {
  _id: string;
  name: string;
  grade: number;
  length?: number;
  description?: string;
  firstAscent?: string;
  sector: Sector | mongoose.Types.ObjectId;
  crag: Crag | mongoose.Types.ObjectId;
  area?: Area| mongoose.Types.ObjectId;
  country: string;
  type: RouteType;
}
