import Joi, { Schema } from 'joi';
import { validate } from '../../shared/errors';
import { mongooseDbOperation } from '../../shared/mongoose.helpers';
import mongoose from 'mongoose';
import { RouteModel } from './route.model';
import { IRoute, PartialRoute, ROUTE_DATA_TO_OMIT } from './route.interface';

export const getRoutes = async (filter: any = undefined, toOmit: string[] = []): Promise<PartialRoute[]> => {
  return mongooseDbOperation(() => RouteModel.find(filter).populate('sector').populate('area').populate('crag'), [...ROUTE_DATA_TO_OMIT, ...toOmit]) as Promise<PartialRoute[]>;
};

export const getRouteById = (id: string): Promise<PartialRoute> => {
  return mongooseDbOperation(
    () => RouteModel.findById(new mongoose.Types.ObjectId(id)),
    ROUTE_DATA_TO_OMIT
  ) as Promise<PartialRoute>;
};

const createRouteValidationSchema: Schema = Joi.object({
  name: Joi.string().required(),
  grade: Joi.number().required(),
  description: Joi.string().optional(),
  length: Joi.number().optional(),
  crag: Joi.string().required(),
  area: Joi.string().required(),
  sector: Joi.string().required(),
  country: Joi.string().optional(),
  type: Joi.string().required(),
});

export const createRoute = async (route: IRoute): Promise<PartialRoute> => {
  await validate(createRouteValidationSchema, route);

  const routeToSave: IRoute = {
    name: route.name,
    grade: route.grade,
    description: route.description,
    length: route.length,
    crag: route.crag,
    sector: route.sector,
    type: route.type,
    country: route.country,
    area: route.area,
  };

  return mongooseDbOperation(() => new RouteModel(routeToSave).save(), ROUTE_DATA_TO_OMIT) as Promise<PartialRoute>;
};

export const deleteRouteById = (id: string): Promise<PartialRoute> => {
  return mongooseDbOperation(() => RouteModel.findOneAndDelete({ _id: id }), ROUTE_DATA_TO_OMIT) as Promise<PartialRoute>;
};

const updateRouteValidationSchema: Schema = Joi.object()
  .keys({
    name: Joi.string().optional(),
    grade: Joi.number().optional(),
    description: Joi.string().optional(),
    length: Joi.number().optional(),
    crag: Joi.string().optional(),
    sector: Joi.string().optional(),
    country: Joi.string().required(),
    area: Joi.string().required(),
  })
  .required()
  .min(1);

export const updateRouteById = async (id: string, route: IRoute): Promise<PartialRoute> => {
  await validate(updateRouteValidationSchema, route);

  const operation = async () => {
    const dbRoute: any = await RouteModel.findOne({ _id: id });

    dbRoute.name = route.name || dbRoute.name;
    dbRoute.grade = route.grade || dbRoute.grade;
    dbRoute.description = route.description || dbRoute.description;
    dbRoute.length = route.length || dbRoute.length;
    dbRoute.crag = route.crag || dbRoute.crag;
    dbRoute.sector = route.sector || dbRoute.sector;
    dbRoute.country = route.country || dbRoute.country;
    dbRoute.area = route.area || dbRoute.area;

    return dbRoute.save();
  };

  return mongooseDbOperation(operation, ROUTE_DATA_TO_OMIT) as Promise<PartialRoute>;
};
