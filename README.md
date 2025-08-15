# Patagonia Fishing Guide 🎣

> **Beast Mode Activated** 🚀 - Aplicación de guías de pesca de Patagonia con componentes avanzados y sistema de monitoreo en tiempo real.

Una plataforma web moderna que conecta entusiastas de la pesca con guías experimentados en los lagos y ríos de la Patagonia, con un sistema de administración completo y características avanzadas de desarrollo.

## ✨ Características Principales

### 🎯 Para Usuarios
- **Explorar Guías** - Catálogo completo de guías de pesca con perfiles detallados
- **Sistema de Filtros** - Búsqueda por ubicación, especialidad y precio
- **Información Detallada** - Perfiles con experiencia, servicios y reseñas
- **Diseño Responsive** - Optimizado para todos los dispositivos
- **Interfaz Intuitiva** - Navegación fluida y moderna

### 👨‍💼 Para Administradores  
- **Panel de Administración** - Gestión completa de guías y servicios
- **Autenticación Segura** - Sistema de login con Supabase Auth
- **Gestión de Imágenes** - Carga y administración de fotos
- **Analytics** - Estadísticas de uso y performance

### 🚀 Beast Mode (Desarrollo)
- **Panel de Desarrollo** - Métricas en tiempo real y debugging
- **Monitor de Performance** - CPU, memoria y network requests
- **Consola SQL** - Ejecución directa de queries
- **Animaciones Avanzadas** - Sistema de animaciones CSS optimizado
- **Componentes Premium** - UI library con efectos glassmorphism

## 🛠️ Tecnologías

### Frontend
- **React 17.0.2** - Framework principal
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Framework CSS utilitario
- **Framer Motion** - Animaciones avanzadas

### Backend & Database
- **Supabase** - Backend-as-a-Service
  - PostgreSQL database
  - Authentication
  - Storage
  - Real-time subscriptions

### Performance & Monitoring
- **Custom Performance Hooks** - Monitoreo de métricas
- **Network Interception** - Tracking de requests
- **Memory Profiling** - Análisis de uso de memoria

## Setup Instructions
## 🚀 Setup Rápido

### 1. Clonar e Instalar
```bash
git clone https://github.com/yourusername/patagonia-fishing-guide.git
cd patagonia-fishing-guide
npm install
```

### 2. Configurar Variables de Entorno
Crear `.env.local`:
```env
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. Configurar Base de Datos
```bash
# Ejecutar setup inicial (ver docs/SUPABASE_SETUP.md)
# Poblar con datos de prueba
node scripts/seed/seed-guides.js
```

### 4. Iniciar Desarrollo
```bash
npm start
# Beast Mode disponible en desarrollo
```

## 📁 Estructura del Proyecto

```
patagonia-fishing-guide/
├── docs/                    # Documentación
├── public/                  # Assets estáticos
├── scripts/                 # Scripts organizados
│   ├── setup/              # Configuración BD
│   ├── seed/               # Datos de prueba
│   └── utils/              # Utilidades
├── src/
│   ├── components/         # Componentes React
│   │   ├── beast-mode/    # Panel Beast Mode
│   │   └── ui/            # UI Components
│   ├── hooks/             # Custom hooks
│   ├── pages/             # Páginas principales
│   ├── services/          # API services
│   ├── styles/           # CSS y estilos
│   └── types/            # TypeScript types
```

## 🎮 Beast Mode

Activa el modo de desarrollo avanzado:

```javascript
// En cualquier componente
const [beastMode, setBeastMode] = useState(true);
```

### Características Beast Mode:
- 📊 **Métricas en tiempo real**
- 🔍 **SQL Console integrada**  
- ⚡ **Monitor de performance**
- 🧪 **Stress testing tools**
- 🎨 **Componentes con glassmorphism**

## 📚 Documentación

- [Beast Mode Components](./docs/BEAST_MODE_COMPONENTS.md)
- [Supabase Setup](./docs/SUPABASE_SETUP.md)
- [Scripts README](./scripts/README.md)

## 🤝 Contribuir

1. Fork el proyecto
2. Crear feature branch (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push al branch (`git push origin feature/nueva-funcionalidad`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver `LICENSE` para más detalles.
   ```

6. Optional: Seed guides to Supabase from local JSON:
   ```
   npm run seed:guides
   ```

## Usage

Once the server is running, open your browser and navigate to `http://localhost:3000` to view the application. You can explore the different pages and learn more about our fishing guides and services.

## Contributing

We welcome contributions to improve the project! Please fork the repository and submit a pull request with your changes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.