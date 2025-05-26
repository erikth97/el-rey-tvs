// Constantes de la aplicación
export const APP_CONFIG = {
  name: 'El Rey TVS',
  version: '1.0.0',
  description: 'Webapp interactiva para generar imágenes personalizadas con motocarros TVS',
  author: 'TVS Motor Company',
  url: process.env.PUBLIC_APP_URL || 'https://el-rey-tvs.com'
} as const;

export const STORAGE_KEYS = {
  APP_STATE: 'el_rey_tvs_app_state',
  SESSION_ID: 'el_rey_session_id',
  SELECTED_VEHICLE: 'selected_vehicle',
  CAPTURED_IMAGE: 'captured_image',
  CURRENT_STEP: 'current_step'
} as const;

export const CAMERA_CONFIG = {
  DEFAULT_WIDTH: 1280,
  DEFAULT_HEIGHT: 720,
  DEFAULT_FRAME_RATE: 30,
  DEFAULT_FACING_MODE: 'user',
  CAPTURE_FORMAT: 'image/png',
  CAPTURE_QUALITY: 1.0
} as const;

export const PERFORMANCE_TARGETS = {
  MAX_BUNDLE_SIZE: 2 * 1024 * 1024, // 2MB
  MAX_IMAGE_SIZE: 500 * 1024, // 500KB para hero
  MAX_VEHICLE_IMAGE_SIZE: 300 * 1024, // 300KB por vehículo
  MAX_ICON_SIZE: 50 * 1024, // 50KB para iconos
  TARGET_FCP: 1500, // First Contentful Paint < 1.5s
  TARGET_LCP: 2500 // Largest Contentful Paint < 2.5s
} as const;

export const VEHICLES_DATA = [
  {
    id: 'king_deluxe_plus' as const,
    name: 'King Deluxe Plus',
    description: '"El más cómodo"',
    image: '/assets/images/motocarros/king-deluxe-plus.png',
    logo: '/assets/logos/king-deluxe-plus-logo.png',
    features: ['Suspensión mejorada', 'Asientos premium', 'Cabina amplia'],
    color: 'red'
  },
  {
    id: 'king_duramax_plus' as const,
    name: 'King Duramax Plus', 
    description: '"El más fuerte"',
    image: '/assets/images/motocarros/king-duramax-plus.png',
    logo: '/assets/logos/king-duramax-plus-logo.png',
    features: ['Motor potente', 'Carga pesada', 'Durabilidad extrema'],
    color: 'white'
  },
  {
    id: 'king_kargo' as const,
    name: 'King Kargo',
    description: '"El de batalla"',
    image: '/assets/images/motocarros/king-kargo.png',
    logo: '/assets/logos/king-kargo-logo.png',
    features: ['Máxima carga', 'Trabajo pesado', 'Resistencia total'],
    color: 'gray'
  }
] as const;

export const LOADING_MESSAGES = [
  'Generando tu imagen...',
  '¡Qué buen estilo!',
  '¿A dónde tan Rey?',
  'Casi listo...',
  'Preparando tu transformación...'
] as const;

export const ERROR_MESSAGES = {
  CAMERA_PERMISSION_DENIED: 'Necesitamos acceso a tu cámara para tomar la foto.',
  CAMERA_NOT_FOUND: 'No se encontró una cámara en tu dispositivo.',
  CAMERA_CONSTRAINT_ERROR: 'Tu cámara no soporta la configuración requerida.',
  CAMERA_UNKNOWN_ERROR: 'Error al acceder a la cámara. Por favor, recarga la página.',
  STORAGE_QUOTA_EXCEEDED: 'No hay suficiente espacio de almacenamiento.',
  STORAGE_NOT_AVAILABLE: 'El almacenamiento local no está disponible.',
  NETWORK_ERROR: 'Error de conexión. Verifica tu internet.',
  GENERIC_ERROR: 'Ha ocurrido un error inesperado. Por favor, intenta de nuevo.'
} as const;