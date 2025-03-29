import Joi, { Schema } from 'joi';
import { validate } from '../../shared/errors';
import { mongooseDbOperation } from '../../shared/mongoose.helpers';
import mongoose from 'mongoose';
import RouteModel from './route.model';
import { IRoute, PartialRoute, ROUTE_DATA_TO_OMIT, Route, RouteToSave } from './route.interface';

export const getRoutes = async (filter: any = undefined, toOmit: string[] = []): Promise<PartialRoute[]> => {
  return mongooseDbOperation(() => RouteModel.find(filter), [...ROUTE_DATA_TO_OMIT, ...toOmit]) as Promise<PartialRoute[]>;
};

export const getRouteById = (id: string): Promise<PartialRoute> => {
  return mongooseDbOperation(
    () => RouteModel.findById(new mongoose.Types.ObjectId(id)),
    ROUTE_DATA_TO_OMIT
  ) as Promise<PartialRoute>;
};

const createRouteValidationSchema: Schema = Joi.object({
  name: Joi.string().required(),
  grade: Joi.string().required(),
  length: Joi.number().required(),
  sectorId: Joi.string().required(),
  description: Joi.string().optional(),
  createdBy: Joi.string().required()
});

export const createRoute = async (route: IRoute): Promise<PartialRoute> => {
  await validate(createRouteValidationSchema, route);

  const routeToSave: RouteToSave = {
    name: route.name,
    grade: route.grade,
    length: route.length,
    sectorId: route.sectorId,
    description: route.description,
    createdBy: route.createdBy
  };

  return mongooseDbOperation(() => new RouteModel(routeToSave).save(), ROUTE_DATA_TO_OMIT) as Promise<PartialRoute>;
};

export const deleteRouteById = (id: string): Promise<PartialRoute> => {
  return mongooseDbOperation(() => RouteModel.findOneAndDelete({ _id: id }), ROUTE_DATA_TO_OMIT) as Promise<PartialRoute>;
};

const updateRouteValidationSchema: Schema = Joi.object()
  .keys({
    name: Joi.string().optional(),
    grade: Joi.string().optional(),
    length: Joi.number().optional(),
    description: Joi.string().optional()
  })
  .required()
  .min(1);

export const updateRouteById = async (id: string, route: IRoute): Promise<PartialRoute> => {
  await validate(updateRouteValidationSchema, route);

  const operation = async () => {
    const dbRoute = await RouteModel.findOne({ _id: id });

    dbRoute.name = route.name || dbRoute.name;
    dbRoute.grade = route.grade || dbRoute.grade;
    dbRoute.length = route.length || dbRoute.length;
    dbRoute.description = route.description || dbRoute.description;

    return dbRoute.save();
  };

  return mongooseDbOperation(operation, ROUTE_DATA_TO_OMIT) as Promise<PartialRoute>;
};
