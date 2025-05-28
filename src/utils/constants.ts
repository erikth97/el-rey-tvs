// src/utils/constants.ts
// Constantes centralizadas para El Rey TVS - Webapp interactiva para generar imágenes personalizadas

// ============================================================================
// CONFIGURACIÓN GENERAL DE LA APLICACIÓN
// ============================================================================

export const APP_CONFIG = {
  name: 'El Rey TVS',
  version: '1.0.0',
  description: 'Webapp interactiva para generar imágenes personalizadas con motocarros TVS',
  author: 'Erik Fabian Tamayo Heredia - Motomex - Software Developer',
  url: process.env.PUBLIC_APP_URL || 'https://el-rey-tvs.com',
  
  // Límites de archivos e imágenes
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_STORAGE_USAGE: 0.8, // 80% del storage disponible
  IMAGE_QUALITY: 0.8, // Calidad JPEG para capturas
  
  // Dimensiones mínimas de imagen
  MIN_IMAGE_DIMENSIONS: {
    width: 400,
    height: 400
  },
  
  // Tiempos y intervalos
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutos
  AUTO_SAVE_INTERVAL: 10 * 1000, // 10 segundos
  PROCESSING_TIMEOUT: 60 * 1000, // 1 minuto máximo
  RETRY_ATTEMPTS: 3
} as const;

// ============================================================================
// CONFIGURACIÓN DE ALMACENAMIENTO
// ============================================================================

export const STORAGE_KEYS = {
  APP_STATE: 'el_rey_tvs_app_state',
  SESSION_ID: 'el_rey_session_id',
  SELECTED_VEHICLE: 'selected_vehicle',
  CAPTURED_IMAGE: 'captured_image',
  CURRENT_STEP: 'current_step',
  USER_DATA: 'el_rey_user_data',
  GENERATED_IMAGE: 'generated_image'
} as const;

// ============================================================================
// DATOS DE VEHÍCULOS
// ============================================================================

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

export type VehicleId = typeof VEHICLES_DATA[number]['id'];

// ============================================================================
// ASSETS Y RECURSOS
// ============================================================================

export const ASSETS_PATHS = {
  // Imágenes principales
  HERO_EL_REY: '/assets/images/hero-el-rey.png',
  TVS_LOGO: '/assets/images/tvs-logo.png',
  EL_REY_LOGO: '/assets/images/el-rey-logo.png',
  LOADING_LUCHADOR: '/assets/images/loading-luchador.png',
  FINAL_TITLE: '/assets/images/final-title.png',
  
  // Overlay de cámara
  CAMERA_MASK: '/assets/overlays/camara-mask.png',
  
  // Elementos decorativos
  DECORATIVE: {
    // Pantalla Intro
    STAR_RED: '/assets/decorative/star-red.png',
    STAR_BLUE: '/assets/decorative/star-blue.png',
    FLASH_BLUE: '/assets/decorative/flash-blue.png',
    FLASH_RED: '/assets/decorative/flash-red.png',
    SIGN_YELLOW: '/assets/decorative/sign-yellow.png',
    SIGN_BLUE: '/assets/decorative/sign-blue.png',
    CROWN: '/assets/decorative/crown.png', 
    
    // Pantalla Instructions
    FLOWER_3_PETALS: '/assets/decorative/flower-3-petals.png',
    RADIAL_YELLOW: '/assets/decorative/radial-yellow.png',
    
    // Pantalla Carousel
    FLAG_BLUE_RIGHT: '/assets/decorative/flag-blue-right.png',
    FLAG_BLUE_LEFT: '/assets/decorative/flag-blue-left.png'
  }
} as const;

// ============================================================================
// FLUJO DE NAVEGACIÓN
// ============================================================================

export const APP_FLOW = {
  INTRO: {
    id: 'intro',
    route: '/',
    nextScreen: 'instructions',
    prevScreen: null,
    requiresData: [],
    title: 'Intro',
    stepNumber: 0,
    duration: 2000, // Auto-advance después de 2 segundos
    allowDirectAccess: true
  },
  INSTRUCTIONS: {
    id: 'instructions',
    route: '/instructions',
    nextScreen: 'carousel',
    prevScreen: 'intro',
    requiresData: [],
    title: 'Instrucciones',
    stepNumber: 1,
    allowDirectAccess: true
  },
  CAROUSEL: {
    id: 'carousel',
    route: '/carousel',
    nextScreen: 'camera',
    prevScreen: 'instructions',
    requiresData: [],
    title: 'Elige tu Motocarro',
    stepNumber: 2,
    allowDirectAccess: true
  },
  CAMERA: {
    id: 'camera',
    route: '/camera',
    nextScreen: 'loading',
    prevScreen: 'carousel',
    requiresData: ['selectedVehicle'],
    title: 'Toma tu Foto',
    stepNumber: 3,
    allowDirectAccess: false
  },
  LOADING: {
    id: 'loading',
    route: '/loading',
    nextScreen: 'result',
    prevScreen: 'camera',
    requiresData: ['selectedVehicle', 'capturedImage'],
    title: 'Generando tu Imagen',
    stepNumber: 4,
    allowDirectAccess: false
  },
  RESULT: {
    id: 'result',
    route: '/result',
    nextScreen: 'intro',
    prevScreen: 'loading',
    requiresData: ['selectedVehicle', 'capturedImage', 'generatedImage'],
    title: 'Te ves de campeonato',
    stepNumber: 5,
    allowDirectAccess: false
  }
} as const;

export type AppScreen = keyof typeof APP_FLOW;

// ============================================================================
// CONFIGURACIÓN DE CÁMARA
// ============================================================================

export const CAMERA_CONFIG = {
  DEFAULT_WIDTH: 1280,
  DEFAULT_HEIGHT: 720,
  DEFAULT_FRAME_RATE: 30,
  DEFAULT_FACING_MODE: 'user', // Cámara frontal para selfies
  CAPTURE_FORMAT: 'image/png',
  CAPTURE_QUALITY: 1.0,
  
  video: {
    facingMode: 'user', // Cámara frontal para selfies
    width: { ideal: 1280, min: 640, max: 1920 },
    height: { ideal: 720, min: 480, max: 1080 },
    frameRate: { ideal: 30, min: 15, max: 60 }
  },
  audio: false
} as const;

// ============================================================================
// MENSAJES Y CONTENIDO
// ============================================================================

export const LOADING_MESSAGES = [
  'Generando tu imagen...',
  '¡Qué buen estilo!',
  '¿A dónde tan Rey?',
  'Casi listo...',
  'Preparando tu transformación...'
] as const;

export const FUN_FACTS = [
  'Los motocarros TVS son líderes en el mercado mexicano',
  'Cada imagen se genera con IA en menos de 30 segundos',
  'El Rey TVS lleva más de 10 años en México',
  'Los King son perfectos para el trabajo urbano',
  'TVS es una marca con más de 40 años de experiencia',
  'Cada motocarro está diseñado para el trabajo mexicano'
] as const;

// ============================================================================
// MANEJO DE ERRORES
// ============================================================================

export const ERROR_CODES = {
  CAMERA_NOT_FOUND: 'camera_not_found',
  CAMERA_PERMISSION_DENIED: 'camera_permission_denied',
  INVALID_IMAGE_FORMAT: 'invalid_image_format',
  IMAGE_TOO_LARGE: 'image_too_large',
  STORAGE_QUOTA_EXCEEDED: 'storage_quota_exceeded',
  NETWORK_ERROR: 'network_error',
  GENERATION_FAILED: 'generation_failed',
  INVALID_VEHICLE_TYPE: 'invalid_vehicle_type',
  MISSING_REQUIRED_DATA: 'missing_required_data'
} as const;

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

// ============================================================================
// CONFIGURACIÓN DE UI Y ANIMACIONES
// ============================================================================

export const ANIMATION_CONFIG = {
  PAGE_TRANSITION_DURATION: 300,
  LOADING_ANIMATION_SPEED: 2000,
  PROGRESS_UPDATE_INTERVAL: 100,
  NOTIFICATION_DURATION: 3000,
  AUTO_ADVANCE_DELAY: 2000 // Para intro screen
} as const;

export const A11Y_CONFIG = {
  FOCUS_RING_COLOR: '#DC2626', // Rojo TVS
  HIGH_CONTRAST_RATIO: 4.5,
  KEYBOARD_NAVIGATION: true,
  SCREEN_READER_SUPPORT: true
} as const;

// ============================================================================
// CONFIGURACIÓN DE DESARROLLO
// ============================================================================

export const DEV_CONFIG = {
  DEBUG_MODE: process.env.NODE_ENV === 'development',
  MOCK_GENERATION: true, // Usar generación simulada
  SKIP_CAMERA_CHECK: false,
  FORCE_ERROR_SIMULATION: false,
  LOG_LEVEL: 'info' // 'debug', 'info', 'warn', 'error'
} as const;

// ============================================================================
// CONFIGURACIÓN DE PERFORMANCE
// ============================================================================

export const PERFORMANCE_TARGETS = {
  MAX_BUNDLE_SIZE: 2 * 1024 * 1024, // 2MB
  MAX_IMAGE_SIZE: 500 * 1024, // 500KB para hero
  MAX_VEHICLE_IMAGE_SIZE: 300 * 1024, // 300KB por vehículo
  MAX_ICON_SIZE: 50 * 1024, // 50KB para iconos
  TARGET_FCP: 1500, // First Contentful Paint < 1.5s
  TARGET_LCP: 2500 // Largest Contentful Paint < 2.5s
} as const;

// ============================================================================
// OBJETO PRINCIPAL PARA EXPORTACIÓN
// ============================================================================

export const CONSTANTS = {
  APP_CONFIG,
  STORAGE_KEYS,
  VEHICLES_DATA,
  ASSETS_PATHS,
  APP_FLOW,
  CAMERA_CONFIG,
  LOADING_MESSAGES,
  FUN_FACTS,
  ERROR_CODES,
  ERROR_MESSAGES,
  ANIMATION_CONFIG,
  A11Y_CONFIG,
  DEV_CONFIG,
  PERFORMANCE_TARGETS
} as const;