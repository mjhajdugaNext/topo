import { Route } from './route.interface';
import { RouteModel } from './route.model';
import { mongooseDbOperation } from '../../shared/mongoose.helpers';

export const getAll = async (): Promise<Route[]> => {
  return mongooseDbOperation(() => 
    RouteModel.find()
      .populate('area')
      .populate('crag')
      .populate('sector')
      .exec()
  ) as Promise<Route[]>;
};

export const getById = async (id: string): Promise<Route | null> => {
  return mongooseDbOperation(() => 
    RouteModel.findById(id)
      .populate('area')
      .populate('crag')
      .populate('sector')
      .exec()
  ) as Promise<Route | null>;
};

export const create = async (routeData: Omit<Route, '_id'>): Promise<Route> => {
  const newRoute = new RouteModel(routeData);
  return mongooseDbOperation(() => newRoute.save()) as Promise<Route>;
};

export const update = async (id: string, routeData: Partial<Route>): Promise<Route | null> => {
  return mongooseDbOperation(() => 
    RouteModel.findByIdAndUpdate(id, routeData, { new: true })
      .populate('area')
      .populate('crag')
      .populate('sector')
      .exec()
  ) as Promise<Route | null>;
};

export const deleteItem = async (id: string): Promise<boolean> => {
  const result = await mongooseDbOperation(() => RouteModel.findByIdAndDelete(id).exec());
  return !!result;
};

export const getRoutesBySector = async (sectorId: string): Promise<Route[]> => {
  return mongooseDbOperation(() => 
    RouteModel.find({ sector: sectorId })
      .populate('area')
      .populate('crag')
      .populate('sector')
      .exec()
  ) as Promise<Route[]>;
};

export const getRoutesByCrag = async (cragId: string): Promise<Route[]> => {
  return mongooseDbOperation(() => 
    RouteModel.find({ crag: cragId })
      .populate('area')
      .populate('crag')
      .populate('sector')
      .exec()
  ) as Promise<Route[]>;
};
