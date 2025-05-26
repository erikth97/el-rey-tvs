// Tipos principales de la aplicación
export type AppStep = 'landing' | 'instructions' | 'selector' | 'camera' | 'loading' | 'result';

export interface AppState {
  currentStep: AppStep;
  selectedVehicle: Vehicle | null;
  capturedImage: CapturedImage | null;
  session: SessionData;
  ui: UIState;
}

export interface Vehicle {
  id: string;
  name: string;
  description: string;
  image: string;
  logo: string;
}

export interface CapturedImage {
  dataUrl: string;
  timestamp: number;
  dimensions: {
    width: number;
    height: number;
  };
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
