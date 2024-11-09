import { Coordinates } from "../../shared/shared.interface";

export interface Sector {
    _id: string;
    name: string;
    coordinates: Coordinates,
    parkingCoordinates: Coordinates,
    parkingInfo: string;
    description: string;
}