// src/utils/helpers/index.ts
// Utilidades helper para El Rey TVS

/**
 * Formatear tiempo en formato MM:SS
 */
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Generar ID único
 */
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Debounce function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(null, args), wait);
  };
};

/**
 * Throttle function
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func.apply(null, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Validar email
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validar teléfono mexicano
 */
export const isValidMexicanPhone = (phone: string): boolean => {
  // Formato: 10 dígitos, puede empezar con +52
  const cleanPhone = phone.replace(/\D/g, '');
  return cleanPhone.length === 10 || (cleanPhone.length === 12 && cleanPhone.startsWith('52'));
};

/**
 * Formatear teléfono mexicano
 */
export const formatMexicanPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
  }
  return phone;
};

/**
 * Comprimir imagen
 */
export const compressImage = (
  file: File, 
  maxWidth: number = 800, 
  quality: number = 0.8
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Calcular dimensiones manteniendo aspect ratio
      const { width, height } = img;
      const aspectRatio = width / height;
      
      if (width > maxWidth) {
        canvas.width = maxWidth;
        canvas.height = maxWidth / aspectRatio;
      } else {
        canvas.width = width;
        canvas.height = height;
      }
      
      // Dibujar imagen comprimida
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      // Convertir a base64
      const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
      resolve(compressedDataUrl);
    };
    
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Detectar tipo de dispositivo
 */
export const getDeviceType = (): 'mobile' | 'tablet' | 'desktop' => {
  if (typeof window === 'undefined') return 'desktop';
  
  const width = window.innerWidth;
  if (width <= 640) return 'mobile';
  if (width <= 1024) return 'tablet';
  return 'desktop';
};

/**
 * Detectar si es iOS
 */
export const isIOS = (): boolean => {
  if (typeof window === 'undefined') return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
};

/**
 * Detectar si es Android
 */
export const isAndroid = (): boolean => {
  if (typeof window === 'undefined') return false;
  return /Android/.test(navigator.userAgent);
};

/**
 * Scroll suave a elemento
 */
export const scrollToElement = (elementId: string, offset: number = 0): void => {
  const element = document.getElementById(elementId);
  if (element) {
    const top = element.offsetTop - offset;
    window.scrollTo({
      top,
      behavior: 'smooth'
    });
  }
};

/**
 * Copiar texto al clipboard
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback para navegadores antiguos
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    }
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    return false;
  }
};

/**
 * Generar URL de compartir
 */
export const generateShareUrl = (vehicleId: string, imageId?: string): string => {
  const baseUrl = window.location.origin;
  const params = new URLSearchParams({
    vehicle: vehicleId,
    ...(imageId && { image: imageId })
  });
  return `${baseUrl}/share?${params.toString()}`;
};

/**
 * Analytics helper
 */
export const trackEvent = (eventName: string, properties?: Record<string, any>): void => {
  // Placeholder para analytics
  console.log('📊 Event:', eventName, properties);
  
  // Aquí se integraría con Google Analytics, Mixpanel, etc.
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, properties);
  }
};

/**
 * Verificar soporte de cámara
 */
export const isCameraSupported = (): boolean => {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
};

/**
 * Verificar permisos de cámara
 */
export const checkCameraPermission = async (): Promise<'granted' | 'denied' | 'prompt'> => {
  try {
    const permission = await navigator.permissions.query({ name: 'camera' as PermissionName });
    return permission.state;
  } catch (error) {
    console.warn('Could not check camera permission:', error);
    return 'prompt';
  }
};

/**
 * Obtener dimensiones de imagen
 */
export const getImageDimensions = (imageUrl: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = reject;
    img.src = imageUrl;
  });
};