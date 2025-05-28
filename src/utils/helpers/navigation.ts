// src/utils/helpers/navigation.ts
// Sistema de navegación mejorado para Document AI
// Maneja el flujo paso a paso y protección de rutas

import { storage } from './storage.js';

// Definir el flujo de la aplicación
export const APP_FLOW = {
  LANDING: {
    id: 'landing',
    route: '/',
    nextScreen: 'instructions',
    prevScreen: null,
    requiresData: [],
    title: 'Inicio'
  },
  INSTRUCTIONS: {
    id: 'instructions',
    route: '/instructions',
    nextScreen: 'selector',
    prevScreen: 'landing',
    requiresData: [],
    title: 'Instrucciones'
  },
  SELECTOR: {
    id: 'selector',
    route: '/selector',
    nextScreen: 'camera',
    prevScreen: 'instructions',
    requiresData: [],
    title: 'Selector de Documento'
  },
  CAMERA: {
    id: 'camera',
    route: '/camera',
    nextScreen: 'loading',
    prevScreen: 'selector',
    requiresData: ['selectedDocumentType'],
    title: 'Captura de Documento'
  },
  LOADING: {
    id: 'loading',
    route: '/loading',
    nextScreen: 'result',
    prevScreen: 'camera',
    requiresData: ['selectedDocumentType', 'capturedImage'],
    title: 'Procesando'
  },
  RESULT: {
    id: 'result',
    route: '/result',
    nextScreen: null,
    prevScreen: 'loading',
    requiresData: ['selectedDocumentType', 'capturedImage'],
    title: 'Resultados'
  }
} as const;

export type AppScreen = keyof typeof APP_FLOW;
export type DocumentType = 'id' | 'invoice' | 'receipt' | 'document';

// Datos que necesita cada pantalla (compatible con UserData del storage)
export interface NavigationData {
  selectedDocumentType?: DocumentType;
  capturedImage?: string;
  analysisResult?: any;
  userName?: string;
  userPreferences?: any;
  sessionId?: string;
  timestamp?: string;
  [key: string]: any;
}

// Evento de transición entre pantallas
export interface ScreenTransitionEvent extends CustomEvent {
  detail: {
    from: string;
    to: string;
    data: NavigationData;
    timestamp: number;
  };
}

declare global {
  interface Window {
    documentNavigator: NavigationManager;
  }
}

export class NavigationManager {
  private static instance: NavigationManager;
  private currentScreen: AppScreen;
  private navigationHistory: AppScreen[];
  private navigationData: NavigationData;
  private isNavigating: boolean;

  constructor() {
    this.currentScreen = 'LANDING';
    this.navigationHistory = [];
    this.navigationData = {};
    this.isNavigating = false;
    this.initialize();
  }

  // Singleton pattern
  public static getInstance(): NavigationManager {
    if (!NavigationManager.instance) {
      NavigationManager.instance = new NavigationManager();
    }
    return NavigationManager.instance;
  }

  private initialize(): void {
    this.loadState();
    this.setupEventListeners();
    this.validateCurrentRoute();
    console.log('🧭 NavigationManager initialized for Document AI');
  }

  private setupEventListeners(): void {
    // Manejar navegación por botones
    document.addEventListener('click', (e: Event) => {
      const target = e.target as HTMLElement;
      if (target) {
        const navTo = target.getAttribute('data-nav-to');
        const navBack = target.getAttribute('data-nav-back');
        
        if (navTo) {
          e.preventDefault();
          this.navigateTo(navTo as AppScreen);
        } else if (navBack !== null) {
          e.preventDefault();
          this.goBack();
        }
      }
    });

    // Manejar navegación del navegador (back/forward)
    window.addEventListener('popstate', (e) => {
      if (e.state && e.state.screen) {
        this.navigateTo(e.state.screen, false);
      }
    });

    // Guardar estado antes de cerrar
    window.addEventListener('beforeunload', () => {
      this.saveState();
    });

    // Teclas de navegación para desarrollo
    document.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) return; // Evitar interferir con shortcuts del navegador
      
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        this.goToNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        this.goBack();
      }
    });
  }

  /**
   * Navegar a una pantalla específica
   */
  public navigateTo(screenId: string | AppScreen, updateHistory: boolean = true): boolean {
    if (this.isNavigating) {
      console.warn('⚠️ Navigation already in progress, ignoring request');
      return false;
    }

    const targetScreen = screenId.toUpperCase() as AppScreen;
    
    if (!this.isValidScreen(targetScreen)) {
      console.error(`❌ Invalid screen: ${screenId}`);
      return false;
    }

    // Verificar si se puede navegar a esta pantalla
    if (!this.canNavigateTo(targetScreen)) {
      console.warn(`⚠️ Cannot navigate to ${targetScreen} - missing required data`);
      return false;
    }

    this.isNavigating = true;
    const previousScreen = this.currentScreen;

    try {
      // Agregar a historial si es navegación hacia adelante
      if (updateHistory && this.currentScreen) {
        this.navigationHistory.push(this.currentScreen);
      }

      // Actualizar estado
      this.currentScreen = targetScreen;

      // Disparar evento de transición
      this.triggerScreenTransition(previousScreen, targetScreen);

      // Actualizar URL del navegador
      this.updateBrowserUrl(targetScreen, updateHistory);

      // Actualizar progreso visual
      this.updateProgress();

      // Guardar estado
      this.saveState();

      console.log(`🧭 Navigation: ${previousScreen} → ${targetScreen}`);
      return true;

    } catch (error) {
      console.error('❌ Navigation error:', error);
      return false;
    } finally {
      this.isNavigating = false;
    }
  }

  /**
   * Ir a la siguiente pantalla en el flujo
   */
  public goToNext(): boolean {
    const currentFlow = APP_FLOW[this.currentScreen];
    if (currentFlow?.nextScreen) {
      return this.navigateTo(currentFlow.nextScreen);
    }
    console.warn('⚠️ No next screen available');
    return false;
  }

  /**
   * Volver a la pantalla anterior
   */
  public goBack(): boolean {
    if (this.navigationHistory.length > 0) {
      const previousScreen = this.navigationHistory.pop()!;
      return this.navigateTo(previousScreen, false);
    }

    // Fallback: usar prevScreen del flujo
    const currentFlow = APP_FLOW[this.currentScreen];
    if (currentFlow?.prevScreen) {
      return this.navigateTo(currentFlow.prevScreen.toUpperCase() as AppScreen);
    }

    console.warn('⚠️ No previous screen available');
    return false;
  }

  /**
   * Verificar si se puede navegar a una pantalla
   */
  private canNavigateTo(screenId: AppScreen): boolean {
    const targetFlow = APP_FLOW[screenId];
    if (!targetFlow) return false;

    // Verificar datos requeridos
    for (const requiredData of targetFlow.requiresData) {
      if (!this.navigationData[requiredData]) {
        console.warn(`⚠️ Missing required data: ${requiredData} for screen ${screenId}`);
        return false;
      }
    }

    return true;
  }

  /**
   * Validar que la ruta actual es correcta
   */
  private validateCurrentRoute(): void {
    const currentPath = window.location.pathname;
    const expectedPath = APP_FLOW[this.currentScreen]?.route;

    if (currentPath !== expectedPath) {
      // Intentar determinar la pantalla por la ruta
      const screenByRoute = Object.entries(APP_FLOW).find(
        ([_, flow]) => flow.route === currentPath
      );

      if (screenByRoute) {
        const [screenKey] = screenByRoute;
        this.currentScreen = screenKey as AppScreen;
        console.log(`🔄 Route corrected to: ${screenKey}`);
      }
    }
  }

  /**
   * Disparar evento de transición
   */
  private triggerScreenTransition(from: AppScreen, to: AppScreen): void {
    const event = new CustomEvent('screenTransition', {
      detail: {
        from: from.toLowerCase(),
        to: to.toLowerCase(),
        data: { ...this.navigationData },
        timestamp: Date.now()
      }
    }) as ScreenTransitionEvent;

    document.dispatchEvent(event);
  }

  /**
   * Actualizar URL del navegador
   */
  private updateBrowserUrl(screenId: AppScreen, updateHistory: boolean): void {
    const targetFlow = APP_FLOW[screenId];
    if (!targetFlow) return;

    const newUrl = targetFlow.route;
    const state = { screen: screenId.toLowerCase() };

    if (updateHistory) {
      history.pushState(state, '', newUrl);
    } else {
      history.replaceState(state, '', newUrl);
    }
  }

  /**
   * Actualizar indicador de progreso
   */
  private updateProgress(): void {
    const screens = Object.keys(APP_FLOW);
    const currentIndex = screens.findIndex(screen => screen === this.currentScreen);
    const progress = ((currentIndex + 1) / screens.length) * 100;

    // Actualizar elementos de progreso si existen
    const progressBar = document.querySelector('[data-progress-bar]') as HTMLElement;
    const progressText = document.querySelector('[data-progress-text]') as HTMLElement;
    const currentStepEl = document.querySelector('[data-current-step]') as HTMLElement;
    const totalStepsEl = document.querySelector('[data-total-steps]') as HTMLElement;

    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }

    if (progressText) {
      progressText.textContent = `${currentIndex + 1} de ${screens.length}`;
    }

    if (currentStepEl) {
      currentStepEl.textContent = (currentIndex + 1).toString();
    }

    if (totalStepsEl) {
      totalStepsEl.textContent = screens.length.toString();
    }

    // Actualizar título de la página
    const currentFlow = APP_FLOW[this.currentScreen];
    if (currentFlow) {
      document.title = `${currentFlow.title} - Document AI`;
    }
  }

  /**
   * Verificar si una pantalla es válida
   */
  private isValidScreen(screenId: string): screenId is AppScreen {
    return screenId in APP_FLOW;
  }

  // Gestión de datos de navegación

  /**
   * Establecer datos de navegación
   */
  public setData(key: string, value: any): void {
    this.navigationData[key] = value;
    
    // También guardar en storage persistente con tipos compatibles
    const dataToSave: any = { [key]: value };
    
    // Asegurar que sessionId y timestamp estén presentes
    if (!this.navigationData.sessionId) {
      this.navigationData.sessionId = this.generateSessionId();
      dataToSave.sessionId = this.navigationData.sessionId;
    }
    
    if (!this.navigationData.timestamp) {
      this.navigationData.timestamp = new Date().toISOString();
    }
    dataToSave.timestamp = new Date().toISOString();
    
    storage.saveUserData(dataToSave);
    
    this.saveState();
    console.log(`📊 Navigation data set: ${key}`);
  }

  /**
   * Generar ID de sesión único
   */
  private generateSessionId(): string {
    return `docai_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Obtener datos de navegación
   */
  public getData(key: string): any {
    return this.navigationData[key];
  }

  /**
   * Obtener todos los datos de navegación
   */
  public getAllData(): NavigationData {
    return { ...this.navigationData };
  }

  /**
   * Limpiar datos de navegación
   */
  public clearData(key?: string): void {
    if (key) {
      delete this.navigationData[key];
    } else {
      this.navigationData = {};
    }
    this.saveState();
  }

  // Persistencia de estado

  /**
   * Guardar estado actual
   */
  private saveState(): void {
    const state = {
      currentScreen: this.currentScreen,
      navigationHistory: this.navigationHistory,
      navigationData: this.navigationData,
      timestamp: Date.now()
    };

    try {
      storage.saveAppState({
        currentScreen: this.currentScreen.toLowerCase(),
        userData: {
          ...this.navigationData,
          sessionId: this.navigationData.sessionId || this.generateSessionId(),
          timestamp: new Date().toISOString()
        }
      });
      
      sessionStorage.setItem('docai_navigation_state', JSON.stringify(state));
      
    } catch (error) {
      console.warn('⚠️ Could not save navigation state:', error);
    }
  }

  /**
   * Cargar estado guardado
   */
  private loadState(): void {
    try {
      // Cargar del storage persistente
      const appState = storage.getAppState();
      if (appState.currentScreen) {
        this.currentScreen = appState.currentScreen.toUpperCase() as AppScreen;
        // Asegurar compatibilidad de tipos con sessionId y timestamp
        this.navigationData = { 
          ...appState.userData,
          sessionId: appState.userData.sessionId || this.generateSessionId(),
          timestamp: appState.userData.timestamp || new Date().toISOString()
        };
      }

      // Cargar del session storage
      const sessionState = sessionStorage.getItem('docai_navigation_state');
      if (sessionState) {
        const state = JSON.parse(sessionState);
        this.currentScreen = state.currentScreen || 'LANDING';
        this.navigationHistory = state.navigationHistory || [];
        this.navigationData = { ...this.navigationData, ...state.navigationData };
      }

      console.log('✅ Navigation state loaded');
      
    } catch (error) {
      console.warn('⚠️ Could not load navigation state:', error);
      this.resetState();
    }
  }

  /**
   * Resetear estado de navegación
   */
  public resetState(): void {
    this.currentScreen = 'LANDING';
    this.navigationHistory = [];
    this.navigationData = {};

    try {
      sessionStorage.removeItem('docai_navigation_state');
      storage.clearAllData();
    } catch (error) {
      console.warn('⚠️ Could not clear navigation state:', error);
    }

    console.log('🔄 Navigation state reset');
  }

  // Métodos públicos para información

  /**
   * Obtener pantalla actual
   */
  public getCurrentScreen(): AppScreen {
    return this.currentScreen;
  }

  /**
   * Obtener historial de navegación
   */
  public getNavigationHistory(): AppScreen[] {
    return [...this.navigationHistory];
  }

  /**
   * Verificar si puede ir hacia atrás
   */
  public canGoBack(): boolean {
    return this.navigationHistory.length > 0 || 
           APP_FLOW[this.currentScreen]?.prevScreen !== null;
  }

  /**
   * Verificar si puede ir hacia adelante
   */
  public canGoForward(): boolean {
    return APP_FLOW[this.currentScreen]?.nextScreen !== null;
  }

  /**
   * Obtener información del flujo actual
   */
  public getCurrentFlow() {
    return APP_FLOW[this.currentScreen];
  }

  /**
   * Obtener progreso actual (0-100)
   */
  public getProgress(): number {
    const screens = Object.keys(APP_FLOW);
    const currentIndex = screens.findIndex(screen => screen === this.currentScreen);
    return ((currentIndex + 1) / screens.length) * 100;
  }
}

// Crear instancia singleton
export const navigationManager = NavigationManager.getInstance();

// Hacer disponible globalmente para debugging
if (typeof window !== 'undefined') {
  window.documentNavigator = navigationManager;
}

// Funciones de utilidad para uso directo
export const navigateTo = (screen: string | AppScreen): boolean => 
  navigationManager.navigateTo(screen);

export const goToNext = (): boolean => 
  navigationManager.goToNext();

export const goBack = (): boolean => 
  navigationManager.goBack();

export const setNavigationData = (key: string, value: any): void => 
  navigationManager.setData(key, value);

export const getNavigationData = (key: string): any => 
  navigationManager.getData(key);

export const getCurrentScreen = (): AppScreen => 
  navigationManager.getCurrentScreen();

export const canGoBack = (): boolean => 
  navigationManager.canGoBack();

export const canGoForward = (): boolean => 
  navigationManager.canGoForward();