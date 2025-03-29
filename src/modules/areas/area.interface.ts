import { Coordinates } from '../../shared/shared.interface';

export interface Area {
  _id: string;
  name: string;
  coordinates: Coordinates;
  description: string;
  country: string;
}
