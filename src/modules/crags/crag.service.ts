import { Crag } from './crag.interface';
import { CragModel } from './crag.model';
import { mongooseDbOperation } from '../../shared/mongoose.helpers';

export const getAll = async (): Promise<Crag[]> => {
  return mongooseDbOperation(() => CragModel.find().exec()) as Promise<Crag[]>;
};

export const getById = async (id: string): Promise<Crag | null> => {
  return mongooseDbOperation(() => CragModel.findById(id).exec()) as Promise<Crag | null>;
};

export const create = async (cragData: Omit<Crag, '_id'>): Promise<Crag> => {
  const newCrag = new CragModel(cragData);
  return mongooseDbOperation(() => newCrag.save()) as Promise<Crag>;
};

export const update = async (id: string, cragData: Partial<Crag>): Promise<Crag | null> => {
  return mongooseDbOperation(() => 
    CragModel.findByIdAndUpdate(id, cragData, { new: true }).exec()
  ) as Promise<Crag | null>;
};

export const deleteItem = async (id: string): Promise<boolean> => {
  const result = await mongooseDbOperation(() => CragModel.findByIdAndDelete(id).exec());
  return !!result;
};
