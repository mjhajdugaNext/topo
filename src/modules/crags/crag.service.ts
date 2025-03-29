import Joi, { Schema } from 'joi';
import { validate } from '../../shared/errors';
import { mongooseDbOperation } from '../../shared/mongoose.helpers';
import mongoose from 'mongoose';
import {CragModel} from './crag.model';
import { ICrag, PartialCrag, CRAG_DATA_TO_OMIT, Crag, CragToSave } from './crag.interface';

export const getCrags = async (filter: any = undefined, toOmit: string[] = []): Promise<PartialCrag[]> => {
  return mongooseDbOperation(() => CragModel.find(filter).populate('area'), [...CRAG_DATA_TO_OMIT, ...toOmit]) as Promise<PartialCrag[]>;
};

export const getCragById = (id: string): Promise<PartialCrag> => {
  return mongooseDbOperation(
    () => CragModel.findById(new mongoose.Types.ObjectId(id)),
    CRAG_DATA_TO_OMIT
  ) as Promise<PartialCrag>;
};

const createCragValidationSchema: Schema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().optional(),
  coordinates: Joi.object({
    latitude: Joi.number().required(),
    longitude: Joi.number().required()
  }).required(),
  parkingCoordinates: Joi.object({
    latitude: Joi.number().required(),
    longitude: Joi.number().required()
  }).optional(),
  area: Joi.string().optional()
});

export const createCrag = async (crag: ICrag): Promise<PartialCrag> => {
  await validate(createCragValidationSchema, crag);

  const cragToSave: CragToSave = {
    name: crag.name,
    description: crag.description,
    coordinates: crag.coordinates,
    parkingCoordinates: crag.parkingCoordinates,
    area: crag.area,
  };

  return mongooseDbOperation(() => new CragModel(cragToSave).save(), CRAG_DATA_TO_OMIT) as Promise<PartialCrag>;
};

export const deleteCragById = (id: string): Promise<PartialCrag> => {
  return mongooseDbOperation(() => CragModel.findOneAndDelete({ _id: id }), CRAG_DATA_TO_OMIT) as Promise<PartialCrag>;
};

const updateCragValidationSchema: Schema = Joi.object()
  .keys({
    name: Joi.string().optional(),
    location: Joi.string().optional(),
    description: Joi.string().optional(),
    coordinates: Joi.object({
      latitude: Joi.number().required(),
      longitude: Joi.number().required()
    }).optional(),
    area: Joi.string().optional()
  })
  .required()
  .min(1);

export const updateCragById = async (id: string, crag: ICrag): Promise<PartialCrag> => {
  await validate(updateCragValidationSchema, crag);

  const operation = async () => {
    const dbCrag: any = await CragModel.findOne({ _id: id });

    dbCrag.name = crag.name || dbCrag.name;
    dbCrag.description = crag.description || dbCrag.description;
    dbCrag.area = crag.area || dbCrag.area;
    if (crag.coordinates) {
      dbCrag.coordinates = crag.coordinates;
    }

    return dbCrag.save();
  };

  return mongooseDbOperation(operation, CRAG_DATA_TO_OMIT) as Promise<PartialCrag>;
};
