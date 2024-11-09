import { Coordinates } from "../../shared/shared.interface";

export interface Crag {
    _id: string;
    name: string;
    coordinates: Coordinates,
    description: string;
}