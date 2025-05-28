// src/utils/helpers/storage.ts
// Sistema de almacenamiento actualizado para Document AI
// Maneja persistencia de documentos, imágenes y estado de análisis

// Claves de almacenamiento
export const STORAGE_KEYS = {
  APP_STATE: 'docai_app_state',
  DOCUMENT_TYPE: 'docai_document_type',
  CAPTURED_IMAGE: 'docai_captured_image',
  ANALYSIS_RESULT: 'docai_analysis_result',
  SESSION_DATA: 'docai_session_data',
  USER_PREFERENCES: 'docai_user_preferences',
  CURRENT_STEP: 'docai_current_step'
} as const;

// Tipos para Document AI
export type DocumentType = 'id' | 'invoice' | 'receipt' | 'document';

export interface DocumentTypeInfo {
  id: DocumentType;
  name: string;
  description: string;
  extractionFields: string[];
  icon: string;
}

export interface UserData {
  selectedDocumentType?: DocumentType;
  capturedImage?: string;
  userName?: string;
  userPreferences?: UserPreferences;
  sessionId: string;
  timestamp: string;
}

export interface UserPreferences {
  autoAdvance?: boolean;
  imageQuality?: 'low' | 'medium' | 'high';
  saveHistory?: boolean;
  language?: 'es' | 'en';
}

export interface CapturedImageData {
  dataUrl: string;
  originalDimensions: {
    width: number;
    height: number;
  };
  captureTimestamp: number;
  fileSize: number;
  quality: number;
}

export interface AnalysisResult {
  documentType: DocumentType;
  extractedData: Record<string, any>;
  confidence: number;
  processingTime: number;
  timestamp: number;
  errors?: string[];
}

export interface AppState {
  currentScreen: string;
  screenHistory: string[];
  userData: UserData;
  completedSteps: string[];
  isFirstVisit: boolean;
  lastActivity: number;
}

export interface SessionData {
  id: string;
  startTime: number;
  lastActivity: number;
  documentsProcessed: number;
  totalSessions: number;
}

export interface StorageInfo {
  used: number;
  total: number;
  available: number;
  itemsCount: number;
  quota: number;
}

// Extender Window interface
declare global {
  interface Window {
    docAIStorage: StorageManager;
  }
}

export class StorageManager {
  private static instance: StorageManager;
  private readonly isAvailable: boolean;
  private readonly maxImageSize: number = 5 * 1024 * 1024; // 5MB
  private readonly maxStorageUsage: number = 0.8; // 80% del total

  constructor() {
    this.isAvailable = this.checkStorageAvailability();
  }

  // Singleton pattern
  public static getInstance(): StorageManager {
    if (!StorageManager.instance) {
      StorageManager.instance = new StorageManager();
    }
    return StorageManager.instance;
  }

  // Verificar disponibilidad de localStorage
  private checkStorageAvailability(): boolean {
    try {
      if (typeof window === 'undefined') return false;
      
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (error) {
      console.warn('⚠️ localStorage no está disponible:', error);
      return false;
    }
  }

  // === Métodos para Documentos ===

  /**
   * Guardar tipo de documento seleccionado
   */
  saveDocumentType(documentType: DocumentType): boolean {
    try {
      if (!this.isAvailable) {
        console.warn('⚠️ Storage no disponible');
        return false;
      }

      localStorage.setItem(STORAGE_KEYS.DOCUMENT_TYPE, documentType);
      
      // También guardarlo en userData
      this.saveUserData({ selectedDocumentType: documentType });
      
      console.log('✅ Tipo de documento guardado:', documentType);
      return true;
    } catch (error) {
      console.error('❌ Error guardando tipo de documento:', error);
      return false;
    }
  }

  /**
   * Obtener tipo de documento seleccionado
   */
  getDocumentType(): DocumentType | null {
    try {
      if (!this.isAvailable) return null;

      const saved = localStorage.getItem(STORAGE_KEYS.DOCUMENT_TYPE);
      return saved as DocumentType | null;
    } catch (error) {
      console.error('❌ Error obteniendo tipo de documento:', error);
      return null;
    }
  }

  // === Métodos para Imágenes ===

  /**
   * Guardar imagen capturada con metadatos
   */
  saveCapturedImage(imageData: CapturedImageData): boolean {
    try {
      if (!this.isAvailable) return false;

      // Verificar tamaño de imagen
      const imageSizeBytes = (imageData.dataUrl.length * 3) / 4;
      if (imageSizeBytes > this.maxImageSize) {
        console.warn('⚠️ Imagen muy grande:', Math.round(imageSizeBytes / 1024 / 1024) + 'MB');
        return false;
      }

      // Verificar espacio disponible
      if (!this.hasAvailableSpace(imageSizeBytes)) {
        console.warn('⚠️ Espacio insuficiente, limpiando datos antiguos...');
        this.clearOldData();
      }

      const imageWithMetadata = {
        ...imageData,
        saveTimestamp: Date.now()
      };

      localStorage.setItem(STORAGE_KEYS.CAPTURED_IMAGE, JSON.stringify(imageWithMetadata));
      
      // También guardarlo en userData (solo la URL)
      this.saveUserData({ capturedImage: imageData.dataUrl });
      
      console.log('✅ Imagen capturada guardada');
      return true;
    } catch (error) {
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        console.error('❌ Cuota de almacenamiento excedida');
        this.clearOldData();
      } else {
        console.error('❌ Error guardando imagen:', error);
      }
      return false;
    }
  }

  /**
   * Obtener imagen capturada con metadatos
   */
  getCapturedImage(): CapturedImageData | null {
    try {
      if (!this.isAvailable) return null;

      const saved = localStorage.getItem(STORAGE_KEYS.CAPTURED_IMAGE);
      if (saved) {
        return JSON.parse(saved);
      }
      return null;
    } catch (error) {
      console.error('❌ Error obteniendo imagen capturada:', error);
      return null;
    }
  }

  /**
   * Obtener solo la URL de la imagen (para compatibilidad)
   */
  getCapturedImageUrl(): string | null {
    const imageData = this.getCapturedImage();
    return imageData?.dataUrl || null;
  }

  // === Métodos para Resultados de Análisis ===

  /**
   * Guardar resultado del análisis
   */
  saveAnalysisResult(result: AnalysisResult): boolean {
    try {
      if (!this.isAvailable) return false;

      localStorage.setItem(STORAGE_KEYS.ANALYSIS_RESULT, JSON.stringify(result));
      
      console.log('✅ Resultado de análisis guardado');
      return true;
    } catch (error) {
      console.error('❌ Error guardando resultado de análisis:', error);
      return false;
    }
  }

  /**
   * Obtener resultado del análisis
   */
  getAnalysisResult(): AnalysisResult | null {
    try {
      if (!this.isAvailable) return null;

      const saved = localStorage.getItem(STORAGE_KEYS.ANALYSIS_RESULT);
      if (saved) {
        return JSON.parse(saved);
      }
      return null;
    } catch (error) {
      console.error('❌ Error obteniendo resultado de análisis:', error);
      return null;
    }
  }

  // === Métodos para Estado de Usuario ===

  /**
   * Guardar datos del usuario
   */
  saveUserData(data: Partial<UserData>): boolean {
    try {
      if (!this.isAvailable) {
        console.warn('⚠️ Storage no disponible, usando memoria temporal');
        return false;
      }

      const currentData = this.getUserData();
      const updatedData: UserData = {
        ...currentData,
        ...data,
        timestamp: new Date().toISOString()
      };

      localStorage.setItem(STORAGE_KEYS.SESSION_DATA, JSON.stringify(updatedData));
      console.log('✅ Datos de usuario guardados:', Object.keys(data));
      return true;
    } catch (error) {
      console.error('❌ Error guardando datos de usuario:', error);
      return false;
    }
  }

  /**
   * Obtener datos del usuario
   */
  getUserData(): UserData {
    try {
      if (!this.isAvailable) {
        return this.getDefaultUserData();
      }

      const savedData = localStorage.getItem(STORAGE_KEYS.SESSION_DATA);
      if (savedData) {
        const userData: UserData = JSON.parse(savedData);
        return {
          ...this.getDefaultUserData(),
          ...userData
        };
      }
    } catch (error) {
      console.error('❌ Error obteniendo datos de usuario:', error);
    }
    
    return this.getDefaultUserData();
  }

  // === Métodos para Preferencias ===

  /**
   * Guardar preferencias del usuario
   */
  saveUserPreferences(preferences: Partial<UserPreferences>): boolean {
    try {
      if (!this.isAvailable) return false;

      const currentPrefs = this.getUserPreferences();
      const updatedPrefs = { ...currentPrefs, ...preferences };

      localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(updatedPrefs));
      
      // También actualizar en userData
      this.saveUserData({ userPreferences: updatedPrefs });
      
      console.log('✅ Preferencias guardadas');
      return true;
    } catch (error) {
      console.error('❌ Error guardando preferencias:', error);
      return false;
    }
  }

  /**
   * Obtener preferencias del usuario
   */
  getUserPreferences(): UserPreferences {
    try {
      if (!this.isAvailable) return this.getDefaultPreferences();

      const saved = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
      if (saved) {
        return { ...this.getDefaultPreferences(), ...JSON.parse(saved) };
      }
    } catch (error) {
      console.error('❌ Error obteniendo preferencias:', error);
    }

    return this.getDefaultPreferences();
  }

  // === Métodos para Estado de Aplicación ===

  /**
   * Guardar estado completo de la aplicación
   */
  saveAppState(state: Partial<AppState>): boolean {
    try {
      if (!this.isAvailable) return false;

      const currentState = this.getAppState();
      const updatedState: AppState = {
        ...currentState,
        ...state,
        lastActivity: Date.now(),
        userData: {
          ...currentState.userData,
          ...state.userData,
          timestamp: new Date().toISOString()
        }
      };

      localStorage.setItem(STORAGE_KEYS.APP_STATE, JSON.stringify(updatedState));
      console.log('✅ Estado de app guardado');
      return true;
    } catch (error) {
      console.error('❌ Error guardando estado de app:', error);
      return false;
    }
  }

  /**
   * Obtener estado completo de la aplicación
   */
  getAppState(): AppState {
    try {
      if (!this.isAvailable) {
        return this.getDefaultAppState();
      }

      const savedState = localStorage.getItem(STORAGE_KEYS.APP_STATE);
      if (savedState) {
        const appState: AppState = JSON.parse(savedState);
        return {
          ...this.getDefaultAppState(),
          ...appState
        };
      }
    } catch (error) {
      console.error('❌ Error obteniendo estado de app:', error);
    }

    return this.getDefaultAppState();
  }

  // === Métodos para Sesión ===

  // === Métodos para Sesión ===

  /**
   * Inicializar nueva sesión
   */
  initializeSession(): SessionData {
    const existingSession = this.getSessionData();
    const sessionData: SessionData = {
      id: existingSession?.id || this.generateSessionId(),
      startTime: existingSession?.startTime || Date.now(),
      lastActivity: Date.now(),
      documentsProcessed: existingSession?.documentsProcessed || 0,
      totalSessions: (existingSession?.totalSessions || 0) + 1
    };

    this.saveSessionData(sessionData);
    return sessionData;
  }

  /**
   * Guardar datos de sesión
   */
  private saveSessionData(sessionData: SessionData): boolean {
    try {
      if (!this.isAvailable) return false;

      localStorage.setItem(STORAGE_KEYS.SESSION_DATA, JSON.stringify(sessionData));
      return true;
    } catch (error) {
      console.error('❌ Error guardando datos de sesión:', error);
      return false;
    }
  }

  /**
   * Obtener datos de sesión
   */
  getSessionData(): SessionData | null {
    try {
      if (!this.isAvailable) return null;

      const saved = localStorage.getItem(STORAGE_KEYS.SESSION_DATA);
      if (saved) {
        return JSON.parse(saved);
      }
      return null;
    } catch (error) {
      console.error('❌ Error obteniendo datos de sesión:', error);
      return null;
    }
  }

  // === Métodos para Pasos/Steps ===

  /**
   * Guardar paso actual
   */
  saveCurrentStep(step: string): boolean {
    try {
      if (!this.isAvailable) return false;

      localStorage.setItem(STORAGE_KEYS.CURRENT_STEP, step);
      
      // Agregar a pasos completados
      const appState = this.getAppState();
      const completedSteps = [...appState.completedSteps];
      if (!completedSteps.includes(step)) {
        completedSteps.push(step);
      }
      
      this.saveAppState({ 
        currentScreen: step, 
        completedSteps 
      });
      
      return true;
    } catch (error) {
      console.error('❌ Error guardando paso actual:', error);
      return false;
    }
  }

  /**
   * Obtener paso actual
   */
  getCurrentStep(): string {
    try {
      if (!this.isAvailable) return 'landing';

      return localStorage.getItem(STORAGE_KEYS.CURRENT_STEP) || 'landing';
    } catch (error) {
      console.error('❌ Error obteniendo paso actual:', error);
      return 'landing';
    }
  }

  // === Métodos para Verificaciones ===

  /**
   * Verificar si hay espacio disponible
   */
  private hasAvailableSpace(requiredBytes: number): boolean {
    const storageInfo = this.getStorageInfo();
    const requiredKB = requiredBytes / 1024;
    return storageInfo.available > requiredKB;
  }

  /**
   * Verificar si es la primera visita
   */
  isFirstVisit(): boolean {
    const appState = this.getAppState();
    return appState.isFirstVisit;
  }

  /**
   * Marcar como visitado
   */
  markAsVisited(): void {
    this.saveAppState({ isFirstVisit: false });
  }

  // === Métodos de Limpieza ===

  /**
   * Limpiar datos antiguos para liberar espacio
   */
  private clearOldData(): void {
    try {
      const storageInfo = this.getStorageInfo();
      
      if (storageInfo.used > (storageInfo.total * this.maxStorageUsage)) {
        // Eliminar imágenes antiguas primero (ocupan más espacio)
        localStorage.removeItem(STORAGE_KEYS.CAPTURED_IMAGE);
        
        // Eliminar resultados de análisis antiguos
        localStorage.removeItem(STORAGE_KEYS.ANALYSIS_RESULT);
        
        console.log('🧹 Datos antiguos limpiados para liberar espacio');
      }
    } catch (error) {
      console.error('❌ Error limpiando datos antiguos:', error);
    }
  }

  /**
   * Limpiar todos los datos
   */
  clearAllData(): boolean {
    try {
      if (!this.isAvailable) return false;

      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });

      console.log('🗑️ Todos los datos limpiados');
      return true;
    } catch (error) {
      console.error('❌ Error limpiando datos:', error);
      return false;
    }
  }

  /**
   * Limpiar datos de sesión actual (mantener preferencias)
   */
  clearSessionData(): boolean {
    try {
      if (!this.isAvailable) return false;

      const keysToKeep = [STORAGE_KEYS.USER_PREFERENCES];
      
      Object.values(STORAGE_KEYS).forEach(key => {
        if (!keysToKeep.includes(key)) {
          localStorage.removeItem(key);
        }
      });

      console.log('🧹 Datos de sesión limpiados');
      return true;
    } catch (error) {
      console.error('❌ Error limpiando datos de sesión:', error);
      return false;
    }
  }

  // === Métodos de Información ===

  /**
   * Obtener información de uso del almacenamiento
   */
  getStorageInfo(): StorageInfo {
    if (!this.isAvailable) {
      return { used: 0, total: 0, available: 0, itemsCount: 0, quota: 0 };
    }

    try {
      let used = 0;
      let itemsCount = 0;
      
      Object.values(STORAGE_KEYS).forEach(key => {
        const item = localStorage.getItem(key);
        if (item) {
          used += item.length;
          itemsCount++;
        }
      });

      // Estimación del límite total (varía por navegador, ~5-10MB típico)
      const total = 10 * 1024 * 1024; // 10MB
      const available = total - used;

      // Obtener cuota real si está disponible
      let quota = total;
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        navigator.storage.estimate().then(estimate => {
          quota = estimate.quota || total;
        });
      }

      return {
        used: Math.round(used / 1024), // KB
        total: Math.round(total / 1024), // KB
        available: Math.round(available / 1024), // KB
        itemsCount,
        quota: Math.round(quota / 1024) // KB
      };
    } catch (error) {
      console.error('❌ Error obteniendo info de almacenamiento:', error);
      return { used: 0, total: 0, available: 0, itemsCount: 0, quota: 0 };
    }
  }

  /**
   * Obtener estadísticas de uso
   */
  getUsageStats() {
    const sessionData = this.getSessionData();
    const appState = this.getAppState();
    const storageInfo = this.getStorageInfo();

    return {
      session: sessionData,
      completedSteps: appState.completedSteps.length,
      totalSteps: 6, // landing, instructions, selector, camera, loading, result
      isFirstVisit: appState.isFirstVisit,
      storageUsage: `${storageInfo.used}KB / ${storageInfo.total}KB`,
      storagePercent: Math.round((storageInfo.used / storageInfo.total) * 100)
    };
  }

  // === Métodos Privados para Datos por Defecto ===

  private generateSessionId(): string {
    return `docai_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getDefaultUserData(): UserData {
    return {
      sessionId: this.generateSessionId(),
      timestamp: new Date().toISOString()
    };
  }

  private getDefaultPreferences(): UserPreferences {
    return {
      autoAdvance: false,
      imageQuality: 'high',
      saveHistory: true,
      language: 'es'
    };
  }

  private getDefaultAppState(): AppState {
    return {
      currentScreen: 'landing',
      screenHistory: [],
      userData: this.getDefaultUserData(),
      completedSteps: [],
      isFirstVisit: true,
      lastActivity: Date.now()
    };
  }
}

// Exportar instancia singleton
export const storage = StorageManager.getInstance();

// Hacer disponible globalmente para debugging
if (typeof window !== 'undefined') {
  window.docAIStorage = storage;
}

// Utility functions para uso directo
export const saveUserData = (data: Partial<UserData>): boolean => 
  storage.saveUserData(data);

export const getUserData = (): UserData => 
  storage.getUserData();

export const saveDocumentType = (type: DocumentType): boolean => 
  storage.saveDocumentType(type);

export const getDocumentType = (): DocumentType | null => 
  storage.getDocumentType();

export const saveCapturedImage = (imageData: CapturedImageData): boolean => 
  storage.saveCapturedImage(imageData);

export const getCapturedImage = (): CapturedImageData | null => 
  storage.getCapturedImage();

export const getCapturedImageUrl = (): string | null => 
  storage.getCapturedImageUrl();

export const saveAnalysisResult = (result: AnalysisResult): boolean => 
  storage.saveAnalysisResult(result);

export const getAnalysisResult = (): AnalysisResult | null => 
  storage.getAnalysisResult();

export const clearAllData = (): boolean => 
  storage.clearAllData();

export const clearSessionData = (): boolean => 
  storage.clearSessionData();

export const getStorageInfo = (): StorageInfo => 
  storage.getStorageInfo();

export const getUsageStats = () => 
  storage.getUsageStats();

export const initializeSession = (): SessionData => 
  storage.initializeSession();