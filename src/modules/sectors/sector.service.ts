import { Sector } from './sector.interface';
import { SectorModel } from './sector.model';
import { mongooseDbOperation } from '../../shared/mongoose.helpers';

export const getAll = async (): Promise<Sector[]> => {
  return mongooseDbOperation(() => SectorModel.find().exec()) as Promise<Sector[]>;
};

export const getById = async (id: string): Promise<Sector | null> => {
  return mongooseDbOperation(() => SectorModel.findById(id).exec()) as Promise<Sector | null>;
};

export const create = async (sectorData: Omit<Sector, '_id'>): Promise<Sector> => {
  const newSector = new SectorModel(sectorData);
  return mongooseDbOperation(() => newSector.save()) as Promise<Sector>;
};

export const update = async (id: string, sectorData: Partial<Sector>): Promise<Sector | null> => {
  return mongooseDbOperation(() => 
    SectorModel.findByIdAndUpdate(id, sectorData, { new: true }).exec()
  ) as Promise<Sector | null>;
};

export const deleteItem = async (id: string): Promise<boolean> => {
  const result = await mongooseDbOperation(() => SectorModel.findByIdAndDelete(id).exec());
  return !!result;
};
