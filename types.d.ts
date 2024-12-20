export interface ParsedLocation {
    country: string;
    lat: number;
    lng: number;
    points: number;
  }
  
  export function parseLocationId(id: string): ParsedLocation;
  
  export function generateLocationId(
    country: string,
    lat: number,
    lng: number,
    pointsCount: number
  ): string;

  export function validateLocationId(id: string): boolean;

  export function parseScalePoints(scale: string, number: string): number;
  