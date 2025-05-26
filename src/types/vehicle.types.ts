// Re-export tipos desde app.types.ts para evitar duplicación
export type { Vehicle, VehicleId, VehicleSelection } from './app.types.js';

// Tipos específicos adicionales para vehículos si se necesitan
export interface VehicleFeature {
  name: string;
  description: string;
  icon?: string;
}

export interface VehicleStats {
  popularity: number;
  selectionCount: number;
  lastSelected: number;
}