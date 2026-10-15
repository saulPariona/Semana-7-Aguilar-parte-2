# Semana 07 - Dashboard de Gestión con React Hooks

**Alumno:** Pariona Ramos Saul Anibal  
**Universidad:** Universidad Nacional del Centro del Perú (UNCP)  
**Facultad:** Ingeniería de Sistemas  
**Asignatura:** Desarrollo de Aplicaciones Web (IS093A)  
**Guía práctica:** Semana 07 - Segunda parte

## Repositorio

Repositorio en GitHub:

<https://github.com/saulPariona/Semana-7-Aguilar-parte-2.git>

## 1. Diagrama de flujo de estado y ciclo de render

```text
<App />
└── <ThemeProvider> (ThemeContext.tsx)
    ├── useLocalStorage('dashboard_theme', 'light')
    ├── useEffect: aplica la clase del tema al <body> y ejecuta cleanup
    └── useCallback: estabiliza toggleTheme()
        │
        ▼
    <Dashboard> (App.tsx)
    ├── useContext(ThemeContext): consume el tema global
    ├── useLocalStorage('dashboard_tasks'): persiste la lista
    ├── useReducer(tasksReducer, initialTaskState)
    │   ├── Estado: { items: [], filter: 'all', sort: 'asc' }
    │   └── Acciones: ADD, REMOVE, TOGGLE, FILTER y SORT
    ├── useCallback: estabiliza las acciones de tareas
    └── useState(showTaskView): simula desmontaje y cleanup
        │
        ▼
    <TaskList> (TaskList.tsx)
    ├── useState: controla el texto del formulario
    ├── useRef: conserva referencias y aplica auto-focus
    ├── useEffect: enfoca el input y libera el timer al desmontar
    ├── useMemo: filtra y ordena la lista procesada
    └── useCallback: estabiliza el envío del formulario
        │
        ▼
    <TaskItem>
    └── recibe la tarea y handlers mediante props
```

El flujo es unidireccional: el usuario genera una acción, el reducer produce un nuevo estado, `App` persiste los datos y `TaskList` recibe las props actualizadas para renderizar la vista correspondiente.

## 2. Justificación técnica de cada hook utilizado

### ¿Por qué no utilizar solamente `useState`?

`useState` es adecuado para estados simples, pero este dashboard administra una estructura relacionada con tres partes: tareas, filtro y orden. Además, varias operaciones dependen del estado anterior y deben conservar actualizaciones inmutables. Un único `useState` produciría lógica dispersa en varios handlers y aumentaría el riesgo de actualizar una parte sin sincronizar las demás.

Por ese motivo se utiliza `useReducer` para centralizar las transiciones y `useState` únicamente donde resuelve estados locales sencillos, como el texto del formulario y la visibilidad temporal de la lista.

### `useReducer`

Administra el estado complejo `{ items, filter, sort }` mediante las acciones `ADD`, `REMOVE`, `TOGGLE`, `FILTER` y `SORT`. Centraliza la lógica de negocio en una función pura, facilita la trazabilidad y evita mutaciones accidentales.

### `useContext`

Comparte `theme` y `toggleTheme` entre los componentes sin pasar propiedades manualmente por cada nivel del árbol. Esto evita prop drilling para una configuración global de la interfaz.

### `useEffect`

Ejecuta operaciones externas al render puro: sincronización con `localStorage`, actualización de la clase del `body` y creación del timer de `TaskList`. Sus funciones de cleanup eliminan clases y timers cuando cambian las dependencias o se desmonta la vista.

### `useMemo`

Memoriza `processedTasks`, que filtra y ordena las tareas. Así no se repite el cálculo cada vez que el usuario escribe una letra en el input si las tareas, el filtro y el orden no cambiaron.

### `useCallback`

Conserva las referencias de `addTask`, `removeTask`, `toggleTask` y `handleSubmit`. Esto evita crear funciones nuevas innecesariamente y permite que los componentes hijos reciban handlers estables.

### `useRef`

Mantiene la referencia del input y el conteo anterior de tareas sin provocar renders adicionales. Después de agregar una tarea permite devolver el foco directamente al campo de texto.

### `useLocalStorage`

Encapsula la lectura inicial y la escritura persistente con `JSON.parse`, `JSON.stringify` y manejo explícito de errores. Se reutiliza para guardar el tema y las tareas sin duplicar lógica.

## Descripción

Este proyecto es un dashboard de gestión de tareas desarrollado con React, TypeScript, Vite y React Hooks. Permite crear, completar, eliminar, filtrar y ordenar tareas. También incluye persistencia con `localStorage`, cambio de tema claro y noche, auto-focus del formulario y alertas visibles para las acciones principales.

## Tecnologías utilizadas

- React 19
- TypeScript
- Vite
- React Hooks
- Lucide React
- CSS
- LocalStorage del navegador

## Clonar y ejecutar el proyecto

### 1. Requisitos

- Node.js instalado.
- npm instalado.
- Git instalado.

### 2. Clonar el repositorio

Abrir una terminal y ejecutar:

```bash
git clone https://github.com/saulPariona/Semana-7-Aguilar-parte-2.git
cd Semana-7-Aguilar-parte-2
```

### 3. Instalar dependencias

```bash
npm install
```

### 4. Iniciar el servidor de desarrollo

```bash
npm run dev
```

Vite mostrará una dirección local. Abrir esa dirección en el navegador.

### 5. Validar el proyecto

Para comprobar el lint:

```bash
npm run lint
```

Para generar la compilación de producción:

```bash
npm run build
```

Para visualizar la compilación:

```bash
npm run preview
```

## Funcionalidades

### Gestión de tareas

1. Escribir una actividad en el campo de texto.
2. Seleccionar `Agregar tarea`.
3. Marcar una tarea como completada.
4. Volver a marcarla como pendiente si es necesario.
5. Eliminar una tarea con el botón correspondiente.
6. Usar los filtros `Todas`, `Pendientes` y `Completadas`.
7. Cambiar el orden entre `A-Z` y `Z-A`.

### Tema claro y tema noche

El botón de tema cambia entre las dos apariencias. La preferencia se guarda en `localStorage` con la clave `dashboard_theme`, por lo que se conserva al recargar la página.

### Alertas

La aplicación muestra una alerta visible cuando:

- Se agrega una tarea.
- Se completa una tarea.
- Una tarea vuelve a quedar pendiente.
- Se elimina una tarea.

Las alertas tienen `role="status"` y desaparecen automáticamente.

## Estructura del proyecto

```text
Semana-7-Aguilar-parte-2/
├── public/
│   ├── AGREGAR_TRABAJO_ALERTA.png
│   ├── THEMA_DIA.png
│   ├── THEMA_NOCHE.png
│   └── TRABAJO COMPLETADO Y ALERTA.png
├── src/
│   ├── components/
│   │   └── TaskList.tsx
│   ├── contexts/
│   │   ├── ThemeContext.tsx
│   │   └── theme-context.ts
│   ├── hooks/
│   │   ├── useLocalStorage.ts
│   │   ├── useTasksReducer.ts
│   │   └── useTheme.ts
│   ├── App.css
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Criterios de implementación

### Criterio 1: estado complejo

Se implementó `useReducer` con acciones inmutables para administrar tareas, filtros y ordenamiento.

### Criterio 2: tema global

Se implementó `ThemeContext` con persistencia de la preferencia claro/noche.

### Criterio 3: efectos y cleanup

Los efectos secundarios se ejecutan con `useEffect`. El timer de `TaskList` se detiene al desmontar la vista y la clase del `body` se limpia correctamente.

### Criterio 4: optimización

El filtrado y ordenamiento usan `useMemo`. Los handlers principales usan `useCallback` y los controles visuales utilizan únicamente iconos de Lucide React.

### Criterio 5: diseño visual

La interfaz utiliza bordes de `2px`, una paleta controlada de colores, tarjetas diferenciadas y un tema noche con alto contraste entre fondo, superficies, textos y controles.

### Criterio 6: alertas de interacción

Cada operación importante informa visualmente al usuario mediante una alerta temporal: agregar, completar, regresar a pendiente y eliminar.

## Evidencias visuales

Las siguientes imágenes están almacenadas en la carpeta `public/` del proyecto.

### Tema claro

![Dashboard en tema claro](./public/THEMA_DIA.png)

### Tema noche

![Dashboard en tema noche](./public/THEMA_NOCHE.png)

### Agregar tarea y alerta

![Alerta al agregar una tarea](./public/AGREGAR_TRABAJO_ALERTA.png)

### Tarea completada y alerta

![Tarea completada con alerta](./public/TRABAJO%20COMPLETADO%20Y%20ALERTA.png)

## Procedimiento de comprobación

1. Clonar el repositorio.
2. Instalar las dependencias con `npm install`.
3. Ejecutar el proyecto con `npm run dev`.
4. Crear una tarea y comprobar la alerta de creación.
5. Completar la tarea y comprobar la alerta correspondiente.
6. Cambiar la tarea nuevamente a pendiente.
7. Eliminar la tarea y comprobar la alerta de eliminación.
8. Cambiar entre tema claro y tema noche.
9. Recargar el navegador y comprobar la persistencia de tareas y tema.
10. Probar los filtros y el ordenamiento.
11. Ejecutar `npm run lint`.
12. Ejecutar `npm run build`.

## Resultado de validación

- Lint: correcto y sin advertencias.
- Build: compilación de producción correcta.
- Persistencia de tareas: funcional mediante `dashboard_tasks`.
- Persistencia del tema: funcional mediante `dashboard_theme`.
- Alertas de interacción: implementadas y visibles.
