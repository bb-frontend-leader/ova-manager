# 🌟 OVA Folder Scan — UI

Interfaz de usuario para explorar, buscar y gestionar OVAs (Objetos Virtuales de Aprendizaje) escaneados desde carpetas en el servidor.

## ✨ Características

- 🔐 Login contra un servidor propio (`ova-auth-server`, Node + SQLite) con sesión en cookie HttpOnly (48 h) y rutas protegidas.
- 📦 Listado de OVAs consumido desde una API REST con adaptador de datos.
- 🔍 Búsqueda en tiempo real por título con normalización de texto.
- 🏷️ Filtrado por etiquetas (tags) con ordenamiento por relevancia.
- 🔃 Ordenamiento alfabético ascendente / descendente.
- 💅 UI construida con componentes Radix UI + Tailwind CSS v4.
- 🔔 Notificaciones tipo toast con Sonner.
- ⚡ Data fetching y caché con TanStack Query v5.

## 📥 Instalación

1. Clona el repositorio:
   ```bash
   git clone git@github.com:300-OVAs-2026/ova-manager.git
   cd ova-folder-scan-ui-vite
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Crea el archivo de variables de entorno en la raíz del proyecto:
   ```bash
   cp .env.template .env
   ```
   Luego edita `.env` y define la URL base de la API:
   ```env
   VITE_PUBLIC_API_URL=http://localhost:3000/api/ovas
   ```
   La URL del servidor de login (`VITE_AUTH_API_URL`) ya viene con `http://localhost:3100` para desarrollo en `.env.development`. Para un build de producción defínela en `.env` con la URL real del servidor.

4. Levanta el servidor de login (proyecto hermano `../ova-auth-server`) y crea al menos un usuario; sin él no se puede iniciar sesión:
   ```bash
   cd ../ova-auth-server
   npm install
   cp .env.template .env
   npm run user:create -- <usuario>
   npm run dev
   ```
   Más detalles en el README de `ova-auth-server`.

## 🚀 Uso

### 🧑‍💻 Desarrollo
```bash
npm run dev
```
El servidor de desarrollo corre en `http://localhost:4321`.

### 🏗️ Construcción
```bash
npm run build
```

### 👁️ Previsualización del build
```bash
npm run preview
```

### 🧹 Lint
```bash
npm run lint
```

### 📝 Commits estandarizados
```bash
npx cz
```
Usa Commitizen con la convención `conventional-changelog`.

Los hooks de Husky se activan solos al ejecutar `npm install` (script `prepare`):
- `commit-msg`: valida el mensaje con commitlint (convención de commits).
- `pre-commit`: con lint-staged formatea (Prettier) y corrige (ESLint) los `.ts`/`.tsx` en staging; un error de ESLint bloquea el commit.

## 📁 Estructura del proyecto

```
src/
├── adapters/       # Transformación de respuestas de la API al modelo interno
├── components/
│   ├── app/        # Componentes específicos de la aplicación (OvaCard, Filter, etc.)
│   └── ui/         # Componentes base reutilizables (Button, Badge, Card, etc.)
├── hooks/          # Hooks personalizados (useAuth, useFilter, useDebounce)
├── pages/          # Páginas de la aplicación (LoginPage, MainPage)
├── plugins/        # Providers globales (TanStack Query)
├── router/         # Configuración del router
├── services/       # Servicios de acceso a la API y autenticación
├── types/          # Tipos e interfaces TypeScript
└── utils/          # Utilidades generales (cookies, clean-string)
```

## ❤️ Hecho con el 💙 en Books&Books

Nos enorgullece desarrollar este proyecto como parte del compromiso de **Books&Books** con la educación y la innovación tecnológica. 🌟🏆💪

Gracias por visitar nuestro proyecto. ¡Juntos podemos hacer del aprendizaje una experiencia increíble! 🥳✨🎉🚀  
