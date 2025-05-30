/** @jsxImportSource preact */
import { useRef, useEffect, useState } from 'preact/hooks';

type CameraPageProps = { className?: string };

export default function CameraPage({ className = '' }: CameraPageProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

  // simulación de centrado
  const checkFaceCentered = () => {
    const el = document.getElementById('centerIndicator');
    const maskEl = document.getElementById('faceMask') as HTMLImageElement | null;
    if (!el || !maskEl) return;
    
    if (Math.random() > 0.4) {
      // Mostrar indicador de check
      el.classList.add('opacity-100');
      // Cambiar máscara al SVG activo verde
      maskEl.src = '/assets/decorative/mask-active.svg';
    } else {
      // Ocultar indicador
      el.classList.remove('opacity-100');
      // Restaurar máscara al SVG predeterminado
      maskEl.src = '/assets/decorative/mask.svg';
    }
  };

  useEffect(() => {
    let stream: MediaStream | null = null;
    let intervalId: number;

    (async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          if (!capturedImage) {
            intervalId = window.setInterval(checkFaceCentered, 3000);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'No se pudo abrir la cámara');
      }
    })();

    return () => {
      stream?.getTracks().forEach((t) => t.stop());
      clearInterval(intervalId);
    };
  }, [facingMode, capturedImage]);

  const capture = () => {
    if (!videoRef.current) return;
    const v = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = v.videoWidth;
    canvas.height = v.videoHeight;
    const ctx = canvas.getContext('2d')!;
    // espejo para que la foto no quede invertida
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(v, 0, 0);
    setCapturedImage(canvas.toDataURL('image/jpeg', 1));
  };

  const resetCapture = () => {
    setCapturedImage(null);
    videoRef.current?.play().catch(() => {});
  };

  const flipCamera = () => {
    resetCapture();
    setFacingMode((f) => (f === 'user' ? 'environment' : 'user'));
  };

  const sendImage = async () => {
    if (!capturedImage) return;
    const img = new Image();
    img.src = capturedImage;
    await new Promise((res) => (img.onload = () => res(null)));
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    canvas.getContext('2d')!.drawImage(img, 0, 0);
    const png = canvas.toDataURL('image/png');
    const sessionId = crypto.randomUUID();
    
    // Guardar la imagen y el ID de sesión para la página de carga
    sessionStorage.setItem('sessionId', sessionId);
    sessionStorage.setItem('photo', png);
    
    // Simular envío de datos al servidor (en producción, esto sería un fetch real)
    console.log('Preparando imagen para procesamiento...');
    
    // Redirigir a la página de carga con animaciones
    window.location.href = '/loading';
  };

  if (error) {
    return (
      <div className={`relative w-full h-screen bg-black ${className}`}>
        <p className="text-white text-center mt-4">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-screen bg-black ${className}`}>
      {/* Indicador de cámara */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30">
        <span className="bg-black bg-opacity-50 text-white text-xs px-3 py-1 rounded-full">
          {facingMode === 'user' ? 'Cámara Frontal' : 'Cámara Trasera'}
        </span>
      </div>

      {/* Video Preview */}
      <video
        ref={videoRef}
        className={`
          absolute inset-0 w-full h-full object-cover
          ${facingMode === 'user' ? 'transform scale-x-[-1]' : ''}
        `}
        autoPlay
        playsInline
      />

      {/* Preview de foto */}
      {capturedImage && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black">
          <img
            src={capturedImage}
            alt="Preview"
            className="max-w-full max-h-full object-contain rounded-lg"
          />
        </div>
      )}

      {/* Instrucción y máscara sobre el video */}
      {!capturedImage && (
        <div className="absolute inset-0 z-20 pointer-events-none">
          <p className="absolute top-18 w-full text-center text-white text-lg uppercase" style={{ fontFamily: 'Sign Labeling, sans-serif' }}>
            ACOMODA TU ROSTRO A LA ALTURA DE LA SILUETA
          </p>
          <div
            id="centerIndicator"
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 transition-opacity duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <img
            id="faceMask"
            src="/assets/decorative/mask.svg"
            alt="Guía de silueta"
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4 max-w-sm opacity-70 transition-all duration-300"
          />
        </div>
      )}

      {/* Controles siempre visibles y responsive */}
      <div 
        className="
          fixed inset-x-0 bottom-0 z-30 flex flex-col items-center justify-center
          px-4 pt-6 pb-16 space-y-4
          bg-gradient-to-t from-black/70 to-transparent
        "
      >
        {!capturedImage ? (
          <div className="flex flex-row items-center justify-center space-x-8">
            <button
              onClick={capture}
              className="
                relative flex items-center justify-center
                w-16 h-16 sm:w-20 sm:h-20
                active:scale-95 transition-transform
              "
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              {/* Círculo exterior */}
              <div className="absolute inset-0 rounded-full border-2 border-white opacity-80"></div>
              {/* Círculo interior */}
              <div className="absolute w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white opacity-90"></div>
              {/* Círculo central */}
              <div className="absolute w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-gray-300"></div>
            </button>

            <button
              onClick={flipCamera}
              className="p-3 bg-black bg-opacity-50 rounded-full"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <img
                src="/assets/decorative/reverse.png"
                alt="Cambiar cámara"
                className="w-6 h-6 sm:w-8 sm:h-8"
              />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-4">
            <button
              onClick={sendImage}
              className="w-48 py-3 bg-[#FF4C4C] text-white rounded-full uppercase shadow-md"
              style={{ fontFamily: 'Sign Labeling, sans-serif', WebkitTapHighlightColor: 'transparent' }}
            >
              Usar foto
            </button>
            <button
              onClick={resetCapture}
              className="w-48 py-3 bg-[#0047AB] text-white rounded-full uppercase shadow-md"
              style={{ fontFamily: 'Sign Labeling, sans-serif', WebkitTapHighlightColor: 'transparent' }}
            >
              Tomar otra
            </button>
          </div>
        )}
      </div >
    </div>
  );
}