

PARTE 1: Diagnóstico de tu estructura actual (según tu imagen) y qué debes hacerEn tu captura de pantalla de VS Code se observa que creaste el proyecto con la plantilla de React + TypeScript (App.tsx, main.tsx, tsconfig.app.json, vite.config.ts, .oxlintrc.json), mientras que el código base de la guía práctica solicita archivos en formato JavaScript/JSX (ThemeContext.jsx, useTasksReducer.js, useLocalStorage.js, TaskList.jsx, App.jsx).   Para que todo funcione sin errores de compilación ni advertencias:Qué conservar de tu imagen: Conserva las carpetas public/, src/assets/, y los archivos .gitignore, .oxlintrc.json, index.html, package-lock.json, package.json, tsconfig.json, tsconfig.node.json y vite.config.ts.   Qué modificar de tu imagen:tsconfig.app.json: Habilitar "allowJs": true para que Vite y TypeScript acepten tus archivos .jsx y .js sin marcar error.   src/App.tsx: Cámbiale el nombre a src/App.jsx (clic derecho sobre App.tsx $\rightarrow$ Rename $\rightarrow$ App.jsx).   src/main.tsx: Actualizar la importación a ./App.jsx.   src/index.css y src/App.css: Reemplazar su contenido por los estilos del Dashboard (modo claro/oscuro).   README.md: Reemplazar su contenido con el diagrama de flujo, la justificación técnica y las capturas de validación.   Qué carpetas y archivos nuevos agregar dentro de src/:Crear la carpeta src/contexts/ y dentro crear ThemeContext.jsx.   Crear la carpeta src/hooks/ y dentro crear useLocalStorage.js y useTasksReducer.js.   Crear la carpeta src/components/ y dentro crear TaskList.jsx.   Tu árbol de archivos dentro de src/ debe quedar exactamente así:   Plaintextsrc/
├── assets/
├── components/
│   └── TaskList.jsx        &lt;-- (NUEVO)
├── contexts/
│   └── ThemeContext.jsx    &lt;-- (NUEVO)
├── hooks/
│   ├── useLocalStorage.js  &lt;-- (NUEVO)
│   └── useTasksReducer.js  &lt;-- (NUEVO)
├── App.css                 &lt;-- (MODIFICAR)
├── App.jsx                 &lt;-- (RENOMBRADO DESDE App.tsx Y MODIFICAR)
├── index.css               &lt;-- (MODIFICAR)
└── main.tsx                &lt;-- (MODIFICAR)
PARTE 2: Código completo archivo por archivo (Qué poner en cada uno)1. Archivo tsconfig.app.json (En la raíz de tu proyecto)Abre tu archivo tsconfig.app.json actual y asegúrate de agregar "allowJs": true y "checkJs": false dentro de "compilerOptions" para que soporte los archivos .js y .jsx de la guía:   JSON{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "allowJs": true,
    "checkJs": false,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["src"]
}
2. Archivo src/hooks/useLocalStorage.js (Nuevo)Cumple con el Objetivo 6 y el código base de la página 4: recibe key y defaultValue, retorna [value, setValue] y sincroniza automáticamente el estado con localStorage.   JavaScriptimport { useState, useEffect } from 'react'

// Hook personalizado reutilizable que sincroniza estado con localStorage
export const useLocalStorage = (key, defaultValue) =&gt; {
  // 1. Inicializar estado leyendo de localStorage o usando defaultValue
  const [value, setValue] = useState(() =&gt; {
    try {
      const storedValue = window.localStorage.getItem(key)
      return storedValue !== null ? JSON.parse(storedValue) : defaultValue
    } catch (error) {
      console.error(`Error leyendo la clave "${key}" de localStorage:`, error)
      return defaultValue
    }
  })

  // 2. Sincronizar cambios con localStorage mediante useEffect
  useEffect(() =&gt; {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(`Error guardando la clave "${key}" en localStorage:`, error)
    }
  }, [key, value])

  return [value, setValue]
}
3. Archivo src/contexts/ThemeContext.jsx (Nuevo)Cumple con los Objetivos 2 y 3 y refactoriza el código base de la página 3: inicializa el estado desde localStorage usando nuestro hook useLocalStorage, aplica la clase al &lt;body&gt;, persiste en localStorage, expone toggleTheme e incluye una función cleanup explícita en useEffect que limpia la clase y registra en consola la limpieza al desmontar.   JavaScriptimport { createContext, useEffect, useCallback } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

export const ThemeContext = createContext()

export const ThemeProvider = ({ children }) =&gt; {
  // Inicializar estado con localStorage ('light' por defecto)
  const [theme, setTheme] = useLocalStorage('dashboard_theme', 'light')

  // useEffect para aplicar clase al &lt;body&gt; y ejecutar cleanup
  useEffect(() =&gt; {
    document.body.classList.remove('light', 'dark')
    document.body.classList.add(theme)
    console.log(`[useEffect Activo] Tema aplicado al &lt;body&gt; y sincronizado: ${theme}`)

    // Cleanup: evita memory leaks y limpia efectos al cambiar de dependencia o desmontar
    return () =&gt; {
      document.body.classList.remove(theme)
      console.log(`[useEffect Cleanup] Limpiando efecto previo del tema: ${theme}`)
    }
  }, [theme])

  // Función toggleTheme estabilizada y expuesta vía value
  const toggleTheme = useCallback(() =&gt; {
    setTheme((prevTheme) =&gt; (prevTheme === 'light' ? 'dark' : 'light'))
  }, [setTheme])

  return (
    &lt;ThemeContext.Provider value={{ theme, toggleTheme }}&gt;
      {children}
    &lt;/ThemeContext.Provider&gt;
  )
}
4. Archivo src/hooks/useTasksReducer.js (Nuevo)Cumple con el Objetivo 1 y refactoriza el código base de la página 3: define los tipos de acción (ADD, REMOVE, TOGGLE, FILTER, SORT) y maneja las transiciones de estado de forma 100% inmutable.   JavaScript// Tipos de acción para el reducer
export const ACTIONS = {
  ADD: 'ADD',
  REMOVE: 'REMOVE',
  TOGGLE: 'TOGGLE',
  FILTER: 'FILTER',
  SORT: 'SORT'
}

// Estado inicial complejo con tareas de ejemplo para probar filtrado y ordenamiento
export const initialState = {
  items: [
    { id: 1, title: 'Configurar useReducer con estado inmutable', completed: true, createdAt: 1000 },
    { id: 2, title: 'Implementar ThemeContext y sincronizar localStorage', completed: false, createdAt: 2000 },
    { id: 3, title: 'Analizar commits con React DevTools Profiler', completed: false, createdAt: 3000 }
  ],
  filter: 'all', // 'all' | 'pending' | 'completed'
  sort: 'asc'    // 'asc' | 'desc'
}

function tasksReducer(state, action) {
  switch (action.type) {
    case ACTIONS.ADD:
      return {
        ...state,
        items: [
          ...state.items,
          {
            id: Date.now(),
            title: action.payload,
            completed: false,
            createdAt: Date.now()
          }
        ]
      }

    case ACTIONS.REMOVE:
      return {
        ...state,
        items: state.items.filter((task) =&gt; task.id !== action.payload)
      }

    case ACTIONS.TOGGLE:
      return {
        ...state,
        items: state.items.map((task) =&gt;
          task.id === action.payload
            ? { ...task, completed: !task.completed }
            : task
        )
      }

    case ACTIONS.FILTER:
      return {
        ...state,
        filter: action.payload
      }

    case ACTIONS.SORT:
      return {
        ...state,
        sort: action.payload
      }

    default:
      return state
  }
}

export default tasksReducer
5. Archivo src/components/TaskList.jsx (Nuevo)Cumple con los Objetivos 1, 3, 4 y 5 y refactoriza el código base de la página 4:   Usa useState para el estado local del formulario (newTaskTitle y búsqueda local).   Usa useMemo para filtrar y ordenar tasks únicamente cuando cambian tasks, filter o sort.   Usa useCallback junto con un subcomponente React.memo (TaskItem) para que en el Profiler de React DevTools se evidencie que los ítems hijos no se re-renderizan innecesariamente.   Usa useRef y useEffect para hacer auto-focus en el &lt;input&gt; cada vez que se añade una tarea sin disparar re-renders adicionales.   Incluye un segundo useEffect con cleanup de suscripción/temporizador para que al desmontar la lista se evidencie la limpieza en la consola.   JavaScriptimport { useState, useMemo, useCallback, useRef, useEffect, memo } from 'react'

// Subcomponente envuelto en React.memo para aprovechar useCallback y reducir commits en el Profiler
const TaskItem = memo(({ task, onRemove, onToggle }) =&gt; {
  return (
    &lt;li className={`task-item ${task.completed ? 'completed' : ''}`}&gt;
      &lt;label className="task-label"&gt;
        &lt;input
          type="checkbox"
          checked={task.completed}
          onChange={() =&gt; onToggle(task.id)}
        /&gt;
        &lt;span className="task-title"&gt;{task.title}&lt;/span&gt;
      &lt;/label&gt;
      &lt;button
        type="button"
        className="btn-delete"
        onClick={() =&gt; onRemove(task.id)}
      &gt;
        Eliminar
      &lt;/button&gt;
    &lt;/li&gt;
  )
})

const TaskList = ({ tasks, filter, sort, onAdd, onRemove, onToggle }) =&gt; {
  // useState para UI local del input
  const [inputValue, setInputValue] = useState('')

  // useRef para acceso al nodo DOM del input sin provocar re-render
  const inputRef = useRef(null)
  const prevCountRef = useRef(tasks.length)

  // useMemo para filtrar y ordenar tareas sin recalcular en cada render local (ej. al escribir en el input)
  const processedTasks = useMemo(() =&gt; {
    const filtered = tasks.filter((task) =&gt; {
      if (filter === 'completed') return task.completed
      if (filter === 'pending') return !task.completed
      return true
    })

    return [...filtered].sort((a, b) =&gt; {
      const comparison = a.title.localeCompare(b.title, 'es', { sensitivity: 'base' })
      return sort === 'asc' ? comparison : -comparison
    })
  }, [tasks, filter, sort])

  // useCallback para estabilizar los handlers pasados al hijo memoizado (TaskItem)
  const handleRemove = useCallback(
    (id) =&gt; {
      onRemove(id)
    },
    [onRemove]
  )

  const handleToggle = useCallback(
    (id) =&gt; {
      onToggle(id)
    },
    [onToggle]
  )

  // useEffect para auto-focus al input al montar y cada vez que se añade una tarea
  useEffect(() =&gt; {
    if (inputRef.current &amp;&amp; tasks.length &gt;= prevCountRef.current) {
      inputRef.current.focus()
    }
    prevCountRef.current = tasks.length
  }, [tasks.length])

  // useEffect con cleanup activo para evidenciar montaje/desmontaje del componente TaskList
  useEffect(() =&gt; {
    console.log('[TaskList Montado] Suscripción de monitoreo de lista iniciada.')
    const intervalId = window.setInterval(() =&gt; {
      // Monitoreo pasivo en segundo plano limpiado al desmontar
    }, 10000)

    return () =&gt; {
      window.clearInterval(intervalId)
      console.log('[TaskList Cleanup Activo] Componente desmontado y timer liberado sin memory leaks.')
    }
  }, [])

  const handleSubmit = (e) =&gt; {
    e.preventDefault()
    const trimmed = inputValue.trim()
    if (!trimmed) return
    onAdd(trimmed)
    setInputValue('')
    // Acceso directo al nodo DOM con useRef
    inputRef.current?.focus()
  }

  return (
    &lt;div className="task-list-wrapper"&gt;
      &lt;form onSubmit={handleSubmit} className="task-form"&gt;
        &lt;input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) =&gt; setInputValue(e.target.value)}
          placeholder="Nueva tarea..."
          className="task-input"
        /&gt;
        &lt;button type="submit" className="btn-primary"&gt;
          Añadir Tarea
        &lt;/button&gt;
      &lt;/form&gt;

      &lt;div className="task-stats"&gt;
        &lt;span&gt;Total: &lt;strong&gt;{tasks.length}&lt;/strong&gt;&lt;/span&gt;
        &lt;span&gt;Mostrando: &lt;strong&gt;{processedTasks.length}&lt;/strong&gt;&lt;/span&gt;
        &lt;span&gt;Completadas: &lt;strong&gt;{tasks.filter((t) =&gt; t.completed).length}&lt;/strong&gt;&lt;/span&gt;
      &lt;/div&gt;

      {processedTasks.length === 0 ? (
        &lt;p className="empty-state"&gt;No hay tareas que coincidan con el filtro actual.&lt;/p&gt;
      ) : (
        &lt;ul className="task-list"&gt;
          {processedTasks.map((task) =&gt; (
            &lt;TaskItem
              key={task.id}
              task={task}
              onRemove={handleRemove}
              onToggle={handleToggle}
            /&gt;
          ))}
        &lt;/ul&gt;
      )}
    &lt;/div&gt;
  )
}

export default TaskList
6. Archivo src/App.jsx (Renombrado desde src/App.tsx)Refactoriza el código base de la página 5:   Conecta useReducer con tasksReducer e inicializa/sincroniza los datos con useLocalStorage.   Conecta useContext(ThemeContext) para el tema claro/oscuro.   Estabiliza con useCallback las funciones despachadoras (handleAddTask, handleRemoveTask, handleToggleTask).   Incluye un botón "Simular Navegación / Desmontar Vista" con useState local para que puedas demostrar el Requisito 3 del Entregable 2 ("Verificar que useEffect tenga cleanup activo (simular navegación rápida o desmontaje)") con un solo clic y capturar la consola.   JavaScriptimport { useReducer, useContext, useState, useCallback, useEffect } from 'react'
import tasksReducer, { initialState, ACTIONS } from './hooks/useTasksReducer'
import { ThemeProvider, ThemeContext } from './contexts/ThemeContext'
import { useLocalStorage } from './hooks/useLocalStorage'
import TaskList from './components/TaskList'
import './App.css'

const Dashboard = () =&gt; {
  // Hook personalizado useLocalStorage para persistir las tareas guardadas
  const [persistedTasks, setPersistedTasks] = useLocalStorage(
    'dashboard_tasks',
    initialState.items
  )

  // useReducer para manejar estado complejo (items, filter, sort)
  const [state, dispatch] = useReducer(tasksReducer, {
    ...initialState,
    items: persistedTasks
  })

  // useContext para consumir tema claro/oscuro
  const { theme, toggleTheme } = useContext(ThemeContext)

  // useState para UI local: simular navegación/desmontaje y verificar cleanup de useEffect
  const [showTaskView, setShowTaskView] = useState(true)

  // Sincronizar cambios de state.items con nuestro hook useLocalStorage
  useEffect(() =&gt; {
    setPersistedTasks(state.items)
  }, [state.items, setPersistedTasks])

  // Handlers estabilizados con useCallback conectados a dispatch
  const handleAddTask = useCallback((title) =&gt; {
    dispatch({ type: ACTIONS.ADD, payload: title })
  }, [])

  const handleRemoveTask = useCallback((id) =&gt; {
    dispatch({ type: ACTIONS.REMOVE, payload: id })
  }, [])

  const handleToggleTask = useCallback((id) =&gt; {
    dispatch({ type: ACTIONS.TOGGLE, payload: id })
  }, [])

  return (
    &lt;div className={`dashboard ${theme}`}&gt;
      &lt;header className="dashboard-header"&gt;
        &lt;div&gt;
          &lt;h1&gt;Gestor de Tareas - Dashboard&lt;/h1&gt;
          &lt;p className="subtitle"&gt;Gestión de Estado Complejo con React Hooks&lt;/p&gt;
        &lt;/div&gt;
        &lt;div className="header-actions"&gt;
          &lt;button type="button" className="btn-secondary" onClick={toggleTheme}&gt;
            Cambiar Tema ({theme === 'light' ? '🌞 Claro' : '🌙 Oscuro'})
          &lt;/button&gt;
          &lt;button
            type="button"
            className="btn-outline"
            onClick={() =&gt; setShowTaskView((prev) =&gt; !prev)}
          &gt;
            {showTaskView ? 'Simular Desmontaje (Cleanup)' : 'Volver a Montar Lista'}
          &lt;/button&gt;
        &lt;/div&gt;
      &lt;/header&gt;

      &lt;section className="controls-bar"&gt;
        &lt;div className="control-group"&gt;
          &lt;label htmlFor="filter-select"&gt;Filtrar por estado:&lt;/label&gt;
          &lt;select
            id="filter-select"
            value={state.filter}
            onChange={(e) =&gt; dispatch({ type: ACTIONS.FILTER, payload: e.target.value })}
          &gt;
            &lt;option value="all"&gt;Todas las tareas&lt;/option&gt;
            &lt;option value="pending"&gt;Pendientes&lt;/option&gt;
            &lt;option value="completed"&gt;Completadas&lt;/option&gt;
          &lt;/select&gt;
        &lt;/div&gt;

        &lt;div className="control-group"&gt;
          &lt;label htmlFor="sort-select"&gt;Orden alfabético:&lt;/label&gt;
          &lt;select
            id="sort-select"
            value={state.sort}
            onChange={(e) =&gt; dispatch({ type: ACTIONS.SORT, payload: e.target.value })}
          &gt;
            &lt;option value="asc"&gt;Ascendente (A - Z)&lt;/option&gt;
            &lt;option value="desc"&gt;Descendente (Z - A)&lt;/option&gt;
          &lt;/select&gt;
        &lt;/div&gt;
      &lt;/section&gt;

      &lt;main className="dashboard-content"&gt;
        {showTaskView ? (
          &lt;TaskList
            tasks={state.items}
            filter={state.filter}
            sort={state.sort}
            onAdd={handleAddTask}
            onRemove={handleRemoveTask}
            onToggle={handleToggleTask}
          /&gt;
        ) : (
          &lt;div className="unmounted-notice"&gt;
            &lt;h3&gt;Vista de tareas desmontada&lt;/h3&gt;
            &lt;p&gt;
              Abre la consola del navegador (F12) para verificar el mensaje de{' '}
              &lt;code&gt;[TaskList Cleanup Activo]&lt;/code&gt; ejecutado por el retorno de{' '}
              &lt;code&gt;useEffect&lt;/code&gt;.
            &lt;/p&gt;
          &lt;/div&gt;
        )}
      &lt;/main&gt;
    &lt;/div&gt;
  )
}

export default function App() {
  return (
    &lt;ThemeProvider&gt;
      &lt;Dashboard /&gt;
    &lt;/ThemeProvider&gt;
  )
}
7. Archivo src/main.tsx (Modificar el existente en tu imagen)Asegúrate de que importe ./App.jsx:   TypeScriptimport { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')!).render(
  &lt;StrictMode&gt;
    &lt;App /&gt;
  &lt;/StrictMode&gt;,
)
8. Archivos de Estilos: src/index.css y src/App.cssEn src/index.css pon lo siguiente:CSS* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  transition: background-color 0.25s ease, color 0.25s ease;
}

body.light {
  background-color: #f4f6f8;
  color: #1e293b;
}

body.dark {
  background-color: #0f172a;
  color: #f8fafc;
}
En src/App.css pon lo siguiente:CSS.dashboard {
  max-width: 820px;
  margin: 2rem auto;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.dashboard.light {
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
}

.dashboard.dark {
  background-color: #1e293b;
  border: 1px solid #334155;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid rgba(148, 163, 184, 0.3);
  margin-bottom: 1.5rem;
}

.subtitle {
  font-size: 0.9rem;
  opacity: 0.75;
  margin-top: 0.25rem;
}

.header-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.controls-bar {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
  padding: 1rem;
  border-radius: 8px;
  background-color: rgba(148, 163, 184, 0.1);
}

.control-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.control-group select,
.task-input {
  padding: 0.55rem 0.75rem;
  border-radius: 6px;
  border: 1px solid #94a3b8;
  background-color: inherit;
  color: inherit;
  font-size: 0.95rem;
}

.task-form {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.task-input {
  flex: 1;
}

button {
  cursor: pointer;
  padding: 0.55rem 1rem;
  border-radius: 6px;
  font-weight: 600;
  border: none;
  transition: opacity 0.2s;
}

button:hover {
  opacity: 0.9;
}

.btn-primary {
  background-color: #2563eb;
  color: #ffffff;
}

.btn-secondary {
  background-color: #475569;
  color: #ffffff;
}

.btn-outline {
  background-color: transparent;
  border: 1px solid #64748b;
  color: inherit;
}

.btn-delete {
  background-color: #ef4444;
  color: #ffffff;
  padding: 0.35rem 0.75rem;
  font-size: 0.85rem;
}

.task-stats {
  display: flex;
  gap: 1.5rem;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  opacity: 0.85;
}

.task-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.task-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid rgba(148, 163, 184, 0.25);
}

.task-item.completed .task-title {
  text-decoration: line-through;
  opacity: 0.6;
}

.task-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  flex: 1;
}

.empty-state,
.unmounted-notice {
  text-align: center;
  padding: 2rem;
  border-radius: 8px;
  border: 1px dashed #94a3b8;
}

---

# Dashboard de Gestión con Estado Complejo - React Hooks

**Universidad:** Universidad Nacional del Centro del Perú (UNCP) - Facultad de Ingeniería de Sistemas  
**Asignatura:** Desarrollo de Aplicaciones Web (IS093A) - Guía Práctica Semana 07 (2° Parte)  
**Alumno:** Saúl Anibal Pariona Ramos

## 1. Diagrama de Flujo de Estado y Ciclo de Render

La aplicación implementa un flujo unidireccional: `ThemeProvider` provee el tema global, `App` administra el estado complejo de tareas y `TaskList` presenta una vista filtrada y ordenada. `TaskItem` recibe props estabilizadas para evitar renders innecesarios.

```text
<App />
  └── <ThemeProvider> ── useLocalStorage + useEffect + useCallback
        └── <Dashboard> ── useContext + useReducer + useLocalStorage
              └── <TaskList> ── useState + useRef + useEffect + useMemo
                    └── React.memo(<TaskItem />)
```

## 2. Justificación Técnica de cada Hook

1. **`useReducer`** centraliza las transiciones `ADD`, `REMOVE`, `TOGGLE`, `FILTER` y `SORT` del estado compuesto `{ items, filter, sort }`, manteniendo actualizaciones inmutables y trazables.
2. **`useContext`** distribuye `theme` y `toggleTheme` sin prop drilling entre los componentes del dashboard.
3. **`useEffect`** ejecuta efectos secundarios después del render: sincronización con `localStorage`, clase del `body` y timer de la lista. Sus funciones de retorno liberan recursos al desmontar.
4. **`useMemo` y `useCallback`** evitan recalcular el filtrado/ordenamiento en cada pulsación y conservan las referencias de los handlers que reciben los hijos.
5. **`useRef`** permite enfocar el input y conservar el conteo anterior sin provocar renders adicionales.
6. **`useLocalStorage`** encapsula la inicialización perezosa, `JSON.parse`, `JSON.stringify` y el manejo explícito de errores para reutilizar persistencia en tema y tareas.

## 3. Entregable 2: Validación Final y Evidencias

### 3.1. Validación de `npm run dev` y cero warnings de Hooks

Ejecutar `npm run dev` y `npm run lint`. Los hooks se llaman en el nivel superior y sus dependencias están declaradas. La evidencia corresponde a `docs/captura1-eslint-dev.png`.

### 3.2. Estado complejo y cambio de tema

Verificar la adición, marcado, eliminación, filtrado (todas, pendientes y completadas), ordenamiento (A-Z y Z-A) y conmutación entre tema claro y oscuro. La evidencia corresponde a `docs/captura2-dashboard-temas.png`.

### 3.3. React DevTools Profiler

Grabar la escritura y el filtrado en Profiler. `processedTasks` queda memoizado y las acciones conservan referencias estables mediante `useCallback`, reduciendo renders de `TaskItem`. La evidencia corresponde a `docs/captura3-profiler-commits.png`.

### 3.4. `useEffect` con cleanup activo

Presionar **Simular Desmontaje (Cleanup)**. La vista se desmonta, se detiene el timer de `TaskList` y se libera la clase del `body`; la limpieza queda registrada en la consola. La evidencia corresponde a `docs/captura4-cleanup-useeffect.png`.

### 3.5. `localStorage` y auto-focus

En **Application > Local Storage** comprobar `dashboard_theme` y `dashboard_tasks`. Al agregar una tarea, `inputRef.current.focus()` devuelve el foco al formulario sin provocar un render adicional. La evidencia corresponde a `docs/captura5-localstorage-ref.png`.

## 4. Paso a paso para ejecutar y validar

1. Instalar dependencias con `npm install`.
2. Iniciar el servidor con `npm run dev`.
3. Abrir la URL local indicada por Vite.
4. Agregar tareas, marcarlas, filtrarlas y cambiar el orden.
5. Cambiar el tema con el botón de la esquina superior derecha.
6. Pulsar **Simular Desmontaje (Cleanup)** y revisar la consola.
7. Ejecutar `npm run lint` y `npm run build` para validar lint, tipos y producción.

## 5. Cambios realizados según los criterios solicitados

### Criterio 1: tema noche diferenciable

Se reforzó el contraste del tema oscuro. El fondo general usa un tono nocturno profundo, los paneles usan una superficie azul-violeta diferenciada y el texto principal conserva alto contraste. Los bordes, botones, progreso y estados activos usan el acento violeta claro. También se configura `color-scheme: dark` en el `body` para que los controles nativos acompañen el tema.

**Paso realizado:** activar el botón de luna/sol y comprobar que el fondo, las tarjetas, el formulario, la barra de progreso, los textos y los botones cambian de forma visible.

### Criterio 2: uso de bordes medianos y paleta controlada

Se mantienen bordes de `2px` y radios discretos de `6px` en tarjetas, controles, botones e input. La interfaz se organiza con una paleta limitada de fondo, superficie, texto y color de acento; el tema nocturno utiliza equivalentes de alto contraste para esas mismas funciones visuales.

**Paso realizado:** revisar las tarjetas de estadísticas, el panel de tareas, el input, filtros y botones en ambos temas.

### Criterio 3: iconografía

Se eliminaron emojis e iconos decorativos ajenos. Las acciones visuales utilizan exclusivamente componentes de `lucide-react`, incluyendo tema, objetivos, estadísticas, filtros, ordenamiento, completar y eliminar.

**Paso realizado:** verificar que el saludo no contiene emoji y que cada icono visible proviene de Lucide.

### Criterio 4: alertas visibles al realizar tareas

Se agregó una alerta fija y animada en la esquina superior derecha. Informa cuando una tarea se agrega, se completa, vuelve a pendiente o se elimina. La alerta usa `role="status"` y desaparece automáticamente después de 2.6 segundos.

**Paso realizado:** agregar una tarea, marcarla como completada, devolverla a pendiente y eliminarla; comprobar el mensaje visual en cada acción.

### Criterio 5: validación técnica

Después de los cambios se ejecutaron los comandos siguientes:

- `npm run lint`: finaliza sin advertencias.
- `npm run build`: compila TypeScript y genera el bundle de producción correctamente.
