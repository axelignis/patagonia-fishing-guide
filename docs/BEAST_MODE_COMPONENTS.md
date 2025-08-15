# Beast Mode Components

Documentación de los componentes avanzados implementados en el proyecto.

## 🚀 Beast Mode Panel

Panel de desarrollo avanzado con métricas en tiempo real y herramientas de debugging.

### Ubicación
- `src/components/beast-mode/BeastModePanel.jsx`
- `src/components/beast-mode/BeastModePanel.css`

### Características
- ✅ **Métricas en tiempo real** - CPU, memoria, network requests
- ✅ **Consola SQL** - Ejecución directa de queries
- ✅ **Monitor de performance** - Tracking de renders y memoria
- ✅ **Stress testing** - Herramientas de carga
- ✅ **Interfaz glassmorphism** - Diseño moderno con efectos de cristal

### Uso
```jsx
import BeastModePanel from './components/beast-mode/BeastModePanel';

// Activar Beast Mode (solo en desarrollo)
const [beastMode, setBeastMode] = useState(process.env.NODE_ENV === 'development');
```

## 🎨 UI Components Enhanced

Sistema de componentes mejorado con animaciones y efectos avanzados.

### AnimatedCard
```jsx
import { AnimatedCard } from './components/ui/simple';

<AnimatedCard delay={100} onClick={handleClick}>
  <p>Contenido con animaciones CSS</p>
</AnimatedCard>
```

### ProgressiveImage  
```jsx
import { ProgressiveImage } from './components/ui/simple';

<ProgressiveImage 
  src={imageUrl}
  placeholder="/placeholder.jpg"
  alt="Descripción"
  className="w-full h-full"
/>
```

## ⚡ Performance Hooks

### useBeastModePerformance
Hook personalizado para monitoreo de performance:

```jsx
import { useBeastModePerformance } from './hooks/useBeastModePerformance';

const Component = () => {
  const metrics = useBeastModePerformance();
  
  return (
    <div>
      <p>Memory: {metrics.memoryUsage}MB</p>
      <p>Renders: {metrics.renderCount}</p>
      <p>Network: {metrics.networkRequests.length}</p>
    </div>
  );
};
```

## 🎭 Animations

Sistema de animaciones CSS optimizado sin dependencias externas.

### Clases disponibles:
- `animate-fadeIn` - Aparición gradual
- `animate-slideInLeft` - Deslizamiento desde la izquierda  
- `animate-slideInUp` - Deslizamiento desde abajo
- `animate-scaleIn` - Escala desde 0
- `animate-pulse` - Pulsación suave
- `beast-glow` - Efecto de brillo Beast Mode

### Delays escalonados:
- `animate-delay-100` hasta `animate-delay-500`
- `stagger-item` para animaciones secuenciales

## 🔧 Configuración

Las animaciones están configuradas en `src/styles/main.css` con keyframes personalizados y utilidades de Tailwind CSS.

### Variables CSS:
```css
:root {
  --beast-primary: #3b82f6;
  --beast-secondary: #10b981;
  --beast-accent: #8b5cf6;
}
```
