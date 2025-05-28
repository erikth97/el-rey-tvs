# 🎨 Design System - El Rey TVS

## 📋 Índice
- [Introducción](#introducción)
- [Tipografía](#tipografía)
- [Colores](#colores)
- [Espaciado](#espaciado)
- [Componentes](#componentes)
- [Animaciones](#animaciones)
- [Responsive](#responsive)
- [Guía de Implementación](#guía-de-implementación)

---

## 🎯 Introducción

El Design System de **El Rey TVS** está diseñado para crear una experiencia visual coherente, moderna y atractiva que refleje la personalidad de la marca TVS Motor Company. Este sistema está optimizado para aplicaciones web móviles con enfoque en performance y accesibilidad.

### Principios de Diseño
- **Consistencia**: Elementos visuales uniformes en toda la aplicación
- **Accesibilidad**: Contraste adecuado y navegación intuitiva
- **Performance**: Optimizado para carga rápida y fluidez
- **Mobile-First**: Diseñado prioritariamente para dispositivos móviles

---

## 🔤 Tipografía

### Fuentes Principales

#### ChunkyRetro (Display)
```css
font-family: 'ChunkyRetro', 'Fredoka One', system-ui, sans-serif;
```
- **Uso**: Títulos principales, logos, elementos destacados
- **Peso**: 900 (Black)
- **Características**: Bold, impactante, perfecto para headlines

#### SignLabeling (Body)
```css
font-family: 'SignLabeling', 'Oswald', system-ui, sans-serif;
```
- **Uso**: Títulos de sección, botones, navegación
- **Peso**: 400-700
- **Características**: Legible, versátil, excelente para UI

#### SingLabeling (Script)
```css
font-family: 'SingLabeling', 'Kalam', cursive;
```
- **Uso**: Descripciones, texto decorativo, elementos casuales
- **Peso**: 400-700
- **Estilo**: Italic
- **Características**: Amigable, personal, cálido

### Jerarquía Tipográfica

| Clase | Tamaño | Uso | Fuente |
|-------|--------|-----|--------|
| `.text-hero` | 36px-48px | "Así se ve un Rey" | Script |
| `.text-rey-title` | 48px-80px | "REY" (con efecto 3D) | Display |
| `.text-section-title` | 20px-24px | "ELIGE TU MOTOCARRO" | Body |
| `.text-vehicle-name` | 24px-32px | "King Deluxe Plus" | Display |
| `.text-vehicle-description` | 16px-18px | "El más cómodo" | Script |
| `.text-cta-button` | 18px-20px | "¡ARRE!" | Body |
| `.text-body` | 14px-16px | Texto general | Body |

### Escalado Responsivo

El sistema usa `clamp()` para escalado fluido:
```css
/* Ejemplo */
--text-hero: clamp(36px, 8vw, 48px);
--text-vehicle: clamp(24px, 6vw, 32px);
```

### Efectos Especiales

#### Efecto 3D para "REY"
```css
.text-rey-title {
  text-shadow: 
    3px 3px 0px var(--color-gold-light),
    6px 6px 0px var(--color-gold),
    9px 9px 10px rgba(0,0,0,0.3);
}
```

---

## 🎨 Colores

### Paleta Principal

#### TVS Red (Principal)
```css
--color-tvs-red: #E31E24;
--color-tvs-red-dark: #B71C1C;
--color-tvs-red-light: #FF5252;
```
- **Uso**: Botones principales, elementos de acción, marca
- **Significado**: Energía, pasión, poder

#### TVS Blue (Secundario)
```css
--color-tvs-blue: #1E40AF;
--color-tvs-blue-dark: #1E3A8A;
--color-tvs-blue-light: #3B82F6;
```
- **Uso**: Enlaces, botones secundarios, información
- **Significado**: Confianza, tecnología, estabilidad

#### Gold (Acento)
```css
--color-gold: #F59E0B;
--color-gold-dark: #D97706;
--color-gold-light: #FCD34D;
```
- **Uso**: Destacados, premios, elementos de lujo
- **Significado**: Calidad, éxito, exclusividad

### Colores de Estado

```css
--color-success: #10B981;    /* Verde - Éxito */
--color-warning: #F59E0B;    /* Amarillo - Advertencia */
--color-error: #EF4444;      /* Rojo - Error */
```

### Colores de UI

```css
--color-background: #F5F5F5;     /* Fondo principal */
--color-surface: #FFFFFF;        /* Tarjetas, modales */
--color-text-primary: #1F2937;   /* Texto principal */
--color-text-secondary: #6B7280; /* Texto secundario */
--color-text-inverse: #FFFFFF;   /* Texto en fondos oscuros */
```

### Uso de Colores

| Elemento | Color Principal | Color Hover |
|----------|----------------|-------------|
| Botón Primario | TVS Red | TVS Red Dark |
| Botón Secundario | TVS Blue | TVS Blue Dark |
| Enlaces | TVS Blue | TVS Blue Light |
| Texto de Acento | Gold | Gold Dark |

---

## 📏 Espaciado

### Sistema de Espaciado

```css
--space-1: 4px;    /* Espaciado mínimo */
--space-2: 8px;    /* Espaciado pequeño */
--space-4: 16px;   /* Espaciado base */
--space-6: 24px;   /* Espaciado medio */
--space-8: 32px;   /* Espaciado grande */
--space-12: 48px;  /* Espaciado extra grande */
--space-16: 64px;  /* Espaciado máximo */
```

### Contenedores

#### Container Mobile
```css
.container-mobile {
  width: 100%;
  max-width: 430px;
  margin: 0 auto;
  padding-left: var(--space-4);
  padding-right: var(--space-4);
}
```

#### Container Narrow
```css
.container-narrow {
  width: 100%;
  max-width: 320px;
  margin: 0 auto;
  padding-left: var(--space-4);
  padding-right: var(--space-4);
}
```

### Espaciado de Componentes

```css
--container-padding: var(--space-4);     /* 16px */
--button-padding-x: var(--space-6);      /* 24px */
--button-padding-y: var(--space-3);      /* 12px */
--card-padding: var(--space-6);          /* 24px */
--section-gap: var(--space-8);           /* 32px */
```

---

## 🔘 Componentes

### Sistema de Botones

#### Botón Primario
```css
.btn-primary {
  background-color: var(--color-tvs-red);
  color: var(--color-text-inverse);
  font-family: var(--font-body);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-radius: 50px;
  padding: var(--button-padding-y) var(--button-padding-x);
  transition: var(--transition-colors), transform var(--duration-fast);
}

.btn-primary:hover {
  background-color: var(--color-tvs-red-dark);
  transform: translateY(-1px);
}
```

#### Estados de Botones
- **Normal**: Color base
- **Hover**: Color oscurecido + elevación
- **Active**: Sin elevación
- **Disabled**: Opacidad 50% + cursor not-allowed

### Cards

```css
.card-base {
  background: var(--color-surface);
  border-radius: 16px;
  padding: var(--card-padding);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: var(--transition-base);
}

.card-hover:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}
```

---

## ⚡ Animaciones

### Duraciones
```css
--duration-fast: 150ms;     /* Hover, pequeñas interacciones */
--duration-base: 300ms;     /* Transiciones estándar */
--duration-slow: 500ms;     /* Animaciones de entrada */
--duration-slower: 750ms;   /* Animaciones complejas */
```

### Curvas de Easing
```css
--ease-out: cubic-bezier(0, 0, 0.2, 1);      /* Salida suave */
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1); /* Entrada y salida */
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55); /* Rebote */
```

### Animaciones Predefinidas

#### Animaciones de Entrada
```css
.animate-fade-in-up {
  animation: fadeInUp var(--duration-slow) var(--ease-out) forwards;
  opacity: 0;
}

.animate-fade-in-scale {
  animation: fadeInScale var(--duration-base) var(--ease-out) forwards;
  opacity: 0;
}

.animate-slide-in-right {
  animation: slideInRight var(--duration-base) var(--ease-out) forwards;
  opacity: 0;
}
```

#### Animaciones Continuas
```css
.animate-pulse-red {
  animation: pulse-red 2s infinite;
}

.animate-pulse-blue {
  animation: pulse-blue 2s infinite;
}
```

---

## 📱 Responsive

### Breakpoints

| Nombre | Rango | Uso |
|--------|-------|-----|
| Mobile | < 640px | Teléfonos |
| Small | 640px - 768px | Teléfonos grandes |
| Medium | 768px - 1024px | Tablets |
| Large | 1024px - 1280px | Laptops |
| XL | > 1280px | Desktops |

### Media Queries

```css
/* Mobile First Approach */
.responsive-element {
  /* Estilos base (mobile) */
  font-size: 16px;
}

@media (min-width: 640px) {
  .responsive-element {
    font-size: 18px;
  }
}

@media (min-width: 1024px) {
  .responsive-element {
    font-size: 20px;
  }
}
```

### Texto Responsivo

Todos los tamaños de texto usan `clamp()` para escalado fluido:
```css
font-size: clamp(min-size, preferred-size, max-size);
```

---

## 🛠️ Guía de Implementación

### 1. Importar Estilos

```html
<!-- En BaseLayout.astro -->
<link rel="stylesheet" href="/src/styles/global.css">
```

### 2. Uso de Clases Tipográficas

```html
<!-- Título principal -->
<h1 class="text-hero text-brand">Así se ve un Rey</h1>

<!-- Título con efecto 3D -->
<div class="text-rey-title text-brand">REY</div>

<!-- Botón principal -->
<button class="btn-base btn-primary">¡ARRE!</button>
```

### 3. Uso de Variables CSS

```css
.custom-element {
  color: var(--color-tvs-red);
  padding: var(--space-4);
  font-family: var(--font-display);
  transition: var(--transition-base);
}
```

### 4. Contenedores Responsivos

```html
<!-- Contenedor mobile -->
<div class="container-mobile">
  <p class="text-body">Contenido centrado y con padding</p>
</div>

<!-- Contenedor estrecho -->
<div class="container-narrow">
  <p class="text-body">Contenido más estrecho</p>
</div>
```

### 5. Animaciones

```html
<!-- Animación de entrada -->
<div class="animate-fade-in-up">
  <p>Este contenido aparece con animación</p>
</div>

<!-- Elemento con hover -->
<div class="transition-transform hover:scale-105">
  <p>Se agranda al hacer hover</p>
</div>
```

---

## 📋 Checklist de Implementación

### ✅ Tipografía
- [ ] Fuentes custom cargando correctamente
- [ ] Jerarquía visual clara
- [ ] Escalado responsivo funcionando
- [ ] Fallbacks definidos

### ✅ Colores
- [ ] Paleta TVS implementada
- [ ] Variables CSS definidas
- [ ] Estados de hover funcionando
- [ ] Contraste accesible

### ✅ Componentes
- [ ] Botones con estados
- [ ] Cards con hover effects
- [ ] Contenedores responsivos
- [ ] Formularios estilizados

### ✅ Animaciones
- [ ] Transiciones suaves
- [ ] Animaciones de entrada
- [ ] Performance optimizada
- [ ] Respeta reduced-motion

### ✅ Responsive
- [ ] Mobile-first implementado
- [ ] Breakpoints funcionando
- [ ] Texto escalando fluidamente
- [ ] Imágenes responsivas

---

## 🎯 Targets de Performance

```css
/* Objetivos definidos */
--target-fcp: 1500ms;     /* First Contentful Paint */
--target-lcp: 2500ms;     /* Largest Contentful Paint */
--max-bundle-size: 2MB;   /* Tamaño máximo del bundle */
--max-image-size: 500KB;  /* Imágenes hero */
--max-icon-size: 50KB;    /* Iconos y elementos pequeños */
```

---

## 📚 Recursos Adicionales

### Herramientas de Desarrollo
- **Design Tokens**: Variables CSS en `/src/styles/global.css`
- **Test Page**: `/design-system-test` para verificación visual
- **Asset Verification**: `/asset-test` para verificar recursos

### Fuentes de Referencia
- [Documentación de Astro](https://docs.astro.build)
- [Tailwind CSS](https://tailwindcss.com)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)

---

**📝 Documentación creada el:** Martes 27 Mayo 2025  
**✍️ Autor:** Erik Fabian Tamayo Heredia - Motomex - Software Developer  
**🏢 Cliente:** TVS Motor Company  
**📄 Versión:** 1.0.0