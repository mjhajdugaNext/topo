import { Area } from '../areas/area.interface';
import { Crag } from '../crags/crag.interface';
import { Sector } from '../sectors/sector.interface';

export enum RouteType {
  sport = 'sport',
  trad = 'trad',
  mixedTrad = 'mixedTrad',
}

export interface Route {
  _id: string;
  name: string;
  officialGrade: string;
  type: RouteType;
  area: Area;
  crag: Crag;
  sector: Sector;
}
