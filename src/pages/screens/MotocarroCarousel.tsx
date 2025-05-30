// src/components/screens/MotocarroCarousel.tsx
import { useState, useEffect, useRef } from 'preact/hooks';

interface Motocarro {
  id: string;
  name: string;
  description: string;
  image: string;
}

const motocarros: Motocarro[] = [
  {
    id: 'king-deluxe-plus',
    name: 'King Deluxe Plus',
    description: '"EL MÁS CÓMODO"',
    image: '/assets/images/motocarros/king-deluxe-plus.png'
  },
  {
    id: 'king-duramax-plus',
    name: 'King Duramax Plus',
    description: '"EL MÁS RESISTENTE"',
    image: '/assets/images/motocarros/king-duramax-plus.png'
  },
  {
    id: 'king-kargo',
    name: 'King Kargo',
    description: '"EL MÁS ESPACIOSO"',
    image: '/assets/images/motocarros/king-kargo.png'
  }
];

export default function MotocarroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  const ellipseImageSrc = '/assets/decorative/elipse.png'; // Ruta a la nueva imagen

  // Navegación del carrusel
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % motocarros.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + motocarros.length) % motocarros.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Seleccionar motocarro y navegar
  const selectMotocarro = () => {
    const selectedMotocarro = motocarros[currentSlide];
    setIsLoading(true);
    
    // Guardar en sessionStorage
    sessionStorage.setItem('selectedMotocarro', selectedMotocarro.id);
    
    // Navegar a cámara después de un delay
    setTimeout(() => {
      window.location.href = '/screens/camera';
    }, 500);
  };

  // Navegación por teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          prevSlide();
          break;
        case 'ArrowRight':
          e.preventDefault();
          nextSlide();
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          selectMotocarro();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide]);

  // Soporte para swipe táctil
  useEffect(() => {
    let startX = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const endX = e.changedTouches[0].clientX;
      const diff = startX - endX;
      const threshold = 50;

      if (Math.abs(diff) > threshold) {
        if (diff > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }
    };

    const carouselElement = carouselRef.current;
    if (carouselElement) {
      carouselElement.addEventListener('touchstart', handleTouchStart, { passive: true });
      carouselElement.addEventListener('touchend', handleTouchEnd, { passive: true });
    }

    return () => {
      if (carouselElement) {
        carouselElement.removeEventListener('touchstart', handleTouchStart);
        carouselElement.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [currentSlide]);

  return (
    <div className="w-full max-w-md mx-auto h-full flex flex-col items-center justify-center py-4">
      
      <div 
        className="relative w-full flex-1 flex items-center"
        id="motocarroCarousel"
        ref={carouselRef}
      >
        <div className="overflow-hidden w-full">
          <div 
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {motocarros.map((motocarro, index) => (
              <div
                key={motocarro.id}
                className="w-full flex-shrink-0 px-2 flex flex-col items-center justify-center text-center"
              >
                {/* Contenedor de la imagen del motocarro */}
                <div className={`mb-[-5%] sm:mb-[-8%] z-10 transform transition-all duration-500 ease-out ${currentSlide === index ? 'scale-100 opacity-100' : 'scale-90 opacity-60'}`}>
                  <img
                    src={motocarro.image}
                    alt={motocarro.name}
                    className="w-full max-w-[600px] sm:max-w-[370px] h-auto object-contain drop-shadow-lg"
                  />
                </div>
                
                {/* NUEVA SECCIÓN PARA ELIPSE, NOMBRE Y DESCRIPCIÓN */}
                <div 
                  className="relative w-full max-w-[300px] sm:max-w-[340px] mx-auto mt-[-20px]"
                  style={{
                    aspectRatio: '273 / 130',
                    transform: 'rotate(-3deg)'
                  }}
                >
                  {/* Imagen de la Elipse como fondo */}
                  <img 
                    src={ellipseImageSrc} 
                    alt="Fondo de elipse" 
                    className="absolute inset-0 w-full h-full object-contain"
                  />

                  {/* Contenedor para el texto, para centrarlo sobre la elipse */}
                  <div className="relative z-10 w-full h-full flex flex-col items-center justify-center pt-[5%]">
                    
                    {/* Nombre del motocarro (sobre la elipse) */}
                    <h3 
                      className="text-3xl sm:text-4xl font-bold mb-1 sm:mb-2"
                      style={{ 
                        fontFamily: 'italic, sans-serif',
                        color: '#dc2626',
                      }}
                    >
                      {motocarro.name}
                    </h3>
                    
                    {/* Descripción (sobre la elipse) */}
                    <p 
                      className="text-sm sm:text-base font-black tracking-tight px-4"
                      style={{
                        fontFamily: 'sans-serif',
                        color: '#003399',
                        textTransform: 'uppercase',
                      }}
                    >
                      {motocarro.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Indicadores de posición */}
      <div className="flex justify-center gap-2.5 my-6 md:my-4">
        {motocarros.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`
              w-2.5 h-2.5 rounded-full transition-all duration-300
              ${index === currentSlide
                ? 'bg-[#003399] scale-125 ring-2 ring-[#003399] ring-offset-1 ring-offset-gray-200'
                : 'bg-gray-400 hover:bg-gray-500'
              }
            `}
            aria-label={`Seleccionar motocarro ${index + 1}`}
          />
        ))}
      </div>

      {/* BOTÓN DE SELECCIÓN "¡ESTE MERO!" */}
      <div className="flex justify-center w-full px-8">
        <button
          onClick={selectMotocarro}
          disabled={isLoading}
          className={`
            text-white text-lg md:text-xl font-black uppercase tracking-wider
            w-full 
            px-8 rounded-full
            shadow-xl active:scale-95
            transition-all duration-200 ease-in-out
            hover:brightness-110 
            disabled:opacity-60 disabled:cursor-not-allowed
            ${isLoading ? 'opacity-70 animate-pulse' : ''}
          `}
          style={{
            fontFamily: 'sans-serif',
            background: isLoading 
              ? '#b91c1c'
              : 'linear-gradient(145deg, #ef4444 0%, #dc2626 100%)',
            color: 'white',
            boxShadow: isLoading 
              ? 'none' 
              : '0 8px 20px rgba(220, 38, 38, 0.5), inset 0 1px 0px rgba(255, 255, 255, 0.3), 0 0 0 1px rgba(255,255,255,0.1)',
            textShadow: '1px 1px 2px rgba(0,0,0,0.4)',
            border: 'none',
            maxWidth: '260px',
            paddingTop: '1.2rem',
            paddingBottom: '1rem'
          }}
        >
          {isLoading ? '¡SELECCIONANDO...!' : '¡ESTE MERO!'}
        </button>
      </div>

      {/* Screen reader announcements */}
      <div 
        aria-live="polite" 
        aria-atomic="true" 
        className="sr-only"
      >
        Motocarro {currentSlide + 1} de {motocarros.length}: {motocarros[currentSlide].name}
      </div>
    </div>
  );
}