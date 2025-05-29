/** @jsxImportSource preact */
import { useRef, useEffect, useState } from 'preact/hooks';

type CameraPageProps = { className?: string };

export default function CameraPage({ className = '' }: CameraPageProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

  // inicializar detección de caras con API nativa
  const faceDetector = useRef<any>(null);
  useEffect(() => {
    // usar FaceDetector desde window para evitar errores de TS
    const FD = (window as any).FaceDetector;
    if (FD) faceDetector.current = new FD();
  }, []);

  // detección real de cara
  const checkFaceCentered = async () => {
    if (!faceDetector.current || !videoRef.current) return;
    try {
      const faces = await faceDetector.current.detect(videoRef.current);
      const detected = faces.length > 0;
      const el = document.getElementById('centerIndicator');
      const maskEl = document.getElementById('faceMask') as HTMLImageElement | null;
      if (!el || !maskEl) return;
      const svgEl = el.querySelector('svg');
      if (detected) {
        el.classList.add('opacity-100');
        if (svgEl) { svgEl.classList.replace('text-white','text-green-500'); }
        maskEl.src = '/assets/decorative/mask-active.svg';
        maskEl.classList.add('scale-150');
      } else {
        el.classList.remove('opacity-100');
        if (svgEl) { svgEl.classList.replace('text-green-500','text-white'); }
        maskEl.src = '/assets/decorative/mask.svg';
        maskEl.classList.remove('scale-150');
      }
    } catch (err) {
      console.error('Face detection error', err);
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
    sessionStorage.setItem('sessionId', sessionId);
    sessionStorage.setItem('photo', png);
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

      {/* Máscara + Check */}
      {!capturedImage && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none">
          <div
            id="centerIndicator"
            className="
              mb-6 flex items-center justify-center
              w-12 h-12 bg-transparent rounded-full
              opacity-0 transition-opacity duration-300
            "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <img
            id="faceMask"
            src="/assets/decorative/mask.svg"
            alt="Guía de silueta"
            className="w-1/2 opacity-80 transition-all duration-300"
          />
        </div>
      )}

      {/* Controles siempre visibles y responsive */}
      <div
        className="
          fixed inset-x-0 bottom-0 z-30 flex items-center justify-center
          px-4 py-3 pb-[env(safe-area-inset-bottom)] space-x-6
          bg-gradient-to-t from-black/70 to-transparent
        "
      >
        {!capturedImage ? (
          <>
            {/* Botón captura con animación */}
            <button
              onClick={capture}
              className="
                relative flex items-center justify-center
                w-16 h-16 sm:w-20 sm:h-20
                active:scale-95 transition-transform
              "
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              {/* Anillo pulsante */}
              <span className="absolute inset-0 rounded-full border-4 border-white opacity-50 animate-pulse"></span>
              <span className="absolute inset-3 rounded-full border-2 border-white"></span>
              <span className="absolute inset-6 rounded-full bg-white"></span>
            </button>

            {/* Flip cámara */}
            <button
              onClick={flipCamera}
              className="p-3 bg-black bg-opacity-50 rounded-full"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <img
                src="/assets/icons/reverse.png"
                alt="Cambiar cámara"
                className="w-6 h-6 sm:w-8 sm:h-8"
              />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={resetCapture}
              className="px-5 py-2 bg-black text-white rounded-lg"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              Tomar otra
            </button>
            <button
              onClick={sendImage}
              className="px-5 py-2 bg-red-600 text-white rounded-lg"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              Usar foto
            </button>
          </>
        )}
      </div>
    </div>
  );
}