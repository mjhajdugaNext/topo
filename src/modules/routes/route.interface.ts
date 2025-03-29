import { Document } from 'mongoose';

export interface IRoute {
  name: string;
  grade: string;
  description?: string;
  length?: number;
  crag: string;
  area?: string;
  sector: string;
  country?: string;
  type: string;
  author?: string;
  firstAscent?: Date;
}

export interface RouteModel extends IRoute, Document {}

export type Route = RouteModel;

export type RouteToSave = Omit<IRoute, 'area' | 'country' | 'type'>;

export const ROUTE_DATA_TO_OMIT = ['__v'];

export type PartialRoute = Omit<Route, typeof ROUTE_DATA_TO_OMIT[number]>;
