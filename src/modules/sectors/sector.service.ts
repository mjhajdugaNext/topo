import Joi, { Schema } from 'joi';
import { validate } from '../../shared/errors';
import { mongooseDbOperation } from '../../shared/mongoose.helpers';
import mongoose from 'mongoose';
import {SectorModel} from './sector.model';
import { ISector, PartialSector, SECTOR_DATA_TO_OMIT, Sector, SectorToSave } from './sector.interface';

export const getSectors = async (filter: any = undefined, toOmit: string[] = []): Promise<PartialSector[]> => {
  return mongooseDbOperation(() => SectorModel.find(filter), [...SECTOR_DATA_TO_OMIT, ...toOmit]) as Promise<PartialSector[]>;
};

export const getSectorById = (id: string): Promise<PartialSector> => {
  return mongooseDbOperation(
    () => SectorModel.findById(new mongoose.Types.ObjectId(id)),
    SECTOR_DATA_TO_OMIT
  ) as Promise<PartialSector>;
};

const createSectorValidationSchema: Schema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().optional(),
  coordinates: Joi.object({
    latitude: Joi.number().required(),
    longitude: Joi.number().required()
  }).optional(),
});

export const createSector = async (sector: ISector): Promise<PartialSector> => {
  await validate(createSectorValidationSchema, sector);

  const sectorToSave: SectorToSave = {
    name: sector.name,
    description: sector.description,
    coordinates: sector.coordinates,
    crag: sector.crag,
  };

  return mongooseDbOperation(() => new SectorModel(sectorToSave).save(), SECTOR_DATA_TO_OMIT) as Promise<PartialSector>;
};

export const deleteSectorById = (id: string): Promise<PartialSector> => {
  return mongooseDbOperation(() => SectorModel.findOneAndDelete({ _id: id }), SECTOR_DATA_TO_OMIT) as Promise<PartialSector>;
};

const updateSectorValidationSchema: Schema = Joi.object()
  .keys({
    name: Joi.string().optional(),
    description: Joi.string().optional(),
    coordinates: Joi.object({
      latitude: Joi.number().required(),
      longitude: Joi.number().required()
    }).optional()
  })
  .required()
  .min(1);

export const updateSectorById = async (id: string, sector: ISector): Promise<PartialSector> => {
  await validate(updateSectorValidationSchema, sector);

  const operation = async () => {
    const dbSector: any = await SectorModel.findOne({ _id: id });

    dbSector.name = sector.name || dbSector.name;
    dbSector.description = sector.description || dbSector.description;
    dbSector.crag = sector.crag || dbSector.crag;
    if (sector.coordinates) {
      dbSector.coordinates = sector.coordinates;
    }

    return dbSector.save();
  };

  return mongooseDbOperation(operation, SECTOR_DATA_TO_OMIT) as Promise<PartialSector>;
};
