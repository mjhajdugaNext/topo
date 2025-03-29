import { AreaModel } from './area.model';
import { Area } from './area.interface';
import { mongooseDbOperation } from '../../shared/mongoose.helpers';
import Joi from 'joi';
import { ApiError, validate } from '../../shared/errors';

// Validation schemas
const createAreaSchema = Joi.object({
  name: Joi.string().required(),
  coordinates: Joi.object({
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
  }).required(),
  description: Joi.string().required(),
  country: Joi.string().required(),
});

const updateAreaSchema = Joi.object({
  name: Joi.string(),
  coordinates: Joi.object({
    latitude: Joi.number(),
    longitude: Joi.number(),
  }),
  description: Joi.string(),
  country: Joi.string(),
}).min(1);

const areaIdSchema = Joi.object({
  id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Area ID must be a valid MongoDB ObjectId',
      'any.required': 'Area ID is required',
    }),
});

export async function getAllAreas(): Promise<Area[]> {
  return mongooseDbOperation(() => AreaModel.find({})) as Promise<Area[]>;
}

export async function getAreaById(id: string): Promise<Area | null> {
  validate(areaIdSchema, { id });
  return mongooseDbOperation(() => AreaModel.findById(id)) as Promise<Area | null>;
}

export async function createArea(areaData: Omit<Area, '_id'>): Promise<Area> {
  validate(createAreaSchema, areaData);
  return mongooseDbOperation(() => AreaModel.create(areaData)) as Promise<Area>;
}

export async function updateArea(id: string, areaData: Partial<Area>): Promise<Area | null> {
  validate(areaIdSchema, { id });
  validate(updateAreaSchema, areaData);
  return mongooseDbOperation(() => AreaModel.findByIdAndUpdate(id, areaData, { new: true })) as Promise<Area | null>;
}

export async function deleteArea(id: string): Promise<Area | null> {
  validate(areaIdSchema, { id });
  return mongooseDbOperation(() => AreaModel.findByIdAndDelete(id)) as Promise<Area | null>;
}
