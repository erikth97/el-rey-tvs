// Tipos principales de la aplicación
export type AppStep = 'landing' | 'instructions' | 'selector' | 'camera' | 'loading' | 'result';
export type VehicleId = 'king_deluxe_plus' | 'king_duramax_plus' | 'king_kargo';

export interface Vehicle {
  id: VehicleId;
  name: string;
  description: string;
  image: string;
  logo: string;
  features: string[];
  color: string;
}

export interface AppState {
  currentStep: AppStep;
  selectedVehicle: Vehicle | null;
  capturedImage: CapturedImage | null;
  session: SessionData;
  ui: UIState;
}

export interface SessionData {
  id: string;
  startTime: number;
  lastActivity: number;
}

export interface UIState {
  isLoading: boolean;
  error: string | null;
  carouselIndex: number;
  cameraPermission: 'granted' | 'denied' | 'prompt';
}

export interface CapturedImage {
  dataUrl: string;
  timestamp: number;
  dimensions: {
    width: number;
    height: number;
  };
}

export interface VehicleSelection {
  vehicle: Vehicle;
  timestamp: number;
  selectionIndex: number;
}

// Tipos para manejo de errores
export type CameraError = 'permission_denied' | 'device_not_found' | 'constraint_not_satisfied' | 'unknown_error';

export interface ErrorState {
  type: string;
  message: string;
  timestamp: number;
  context?: Record<string, any>;
}

// Tipos para configuración de cámara
export interface CameraConfig {
  video: {
    facingMode: 'user' | 'environment';
    width: { ideal: number };
    height: { ideal: number };
    frameRate: { ideal: number };
  };
  audio: false;
}

export interface CameraCapture {
  dataUrl: string;
  blob: Blob;
  dimensions: {
    width: number;
    height: number;
  };
  quality: number;
}

// Tipos para el storage
export interface StorageData {
  selectedVehicle: Vehicle | null;
  capturedImage: string | null;
  sessionId: string;
  timestamp: number;
  currentStep: AppStep;
}