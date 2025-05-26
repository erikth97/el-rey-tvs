// Re-export tipos desde app.types.ts para evitar duplicación
export type { CameraError, CameraConfig, CameraCapture } from './app.types.js';

// Tipos específicos adicionales para cámara
export interface CameraPermissionState {
  granted: boolean;
  denied: boolean;
  prompt: boolean;
}

export interface CameraStreamInfo {
  deviceId: string;
  label: string;
  facingMode: string;
  width: number;
  height: number;
}