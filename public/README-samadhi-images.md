# 🐕 Imágenes de Samadhi - El Meditador Sabio

## 📁 Archivos Requeridos

Coloca las siguientes imágenes en la carpeta `public/`:

### 🎉 `samadhi-celebration.png`
- **Pose**: Celebración con cymbals dorados y confeti
- **Uso**: Modal de celebración después de completar un registro
- **Tamaño recomendado**: 240x240px
- **Fondo**: Transparente

### 🧘 `samadhi-meditation.png`
- **Pose**: Meditación serena con aura azul-verde
- **Uso**: Páginas de meditación y estados de calma
- **Tamaño recomendado**: 200x200px
- **Fondo**: Transparente

### 👋 `samadhi-welcome.png`
- **Pose**: Saludo amigable y acogedor
- **Uso**: Dashboard de bienvenida
- **Tamaño recomendado**: 120x120px
- **Fondo**: Transparente

### 🌟 `samadhi-hero.png`
- **Pose**: Pose principal para landing page
- **Uso**: Página principal de la aplicación
- **Tamaño recomendado**: 240x240px
- **Fondo**: Transparente

### 📝 `samadhi-form.png`
- **Pose**: Pose de atención y guía
- **Uso**: Formularios y páginas de entrada de datos
- **Tamaño recomendado**: 160x160px
- **Fondo**: Transparente

### 🧭 `samadhi-nav.png`
- **Pose**: Pose compacta para navegación
- **Uso**: Barra de navegación
- **Tamaño recomendado**: 80x80px
- **Fondo**: Transparente

## 🎨 Especificaciones Técnicas

- **Formato**: PNG con fondo transparente
- **Estilo**: Ilustración vectorial/cartoon
- **Colores**: 
  - Cuerpo: Amarillo pastel (#FFE5B4)
  - Orejas: Café claro (#D2B48C)
  - Detalles: Café oscuro (#8B4513)
- **Resolución**: Mínimo 2x para pantallas de alta densidad

## 🚀 Implementación

Las imágenes se cargan automáticamente en los componentes usando el componente `SamadhiMascot`:

```tsx
import SamadhiMascot from '@/components/common/SamadhiMascot'

// Uso básico
<SamadhiMascot pose="celebration" size={120} animated />

// Con animación personalizada
<SamadhiMascot 
  pose="welcome" 
  size={80} 
  animated 
  className="custom-animation" 
/>
```

## ✨ Animaciones Disponibles

- **celebration**: Rebote con cymbals
- **meditation**: Flotación suave
- **welcome**: Saludo con movimiento
- **hero**: Brillo dorado
- **form**: Asentimiento
- **nav**: Pulso sutil

¡Samadhi está listo para guiar a los usuarios en su viaje de meditación! 🧘‍♂️✨
