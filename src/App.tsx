import { useCallback, useEffect, useMemo, useReducer, useState } from 'react'
import { CheckCircle2, Moon, Plus, RotateCcw, Sun, Target, Zap } from 'lucide-react'
import { useTheme } from './hooks/useTheme'
import { useLocalStorage } from './hooks/useLocalStorage'
import { initialTaskState, tasksReducer, type Task, type TaskState } from './hooks/useTasksReducer'
import { TaskList } from './components/TaskList'
import './App.css'

function App() {
  const { theme, toggleTheme } = useTheme()
  const [storedTasks, setStoredTasks] = useLocalStorage<Task[]>('dashboard_tasks', [])
  const [state, dispatch] = useReducer(tasksReducer, {
    ...initialTaskState,
    items: storedTasks,
  })
  const [showTaskView, setShowTaskView] = useState(true)
  const [alertMessage, setAlertMessage] = useState('')

  useEffect(() => {
    setStoredTasks(state.items)
  }, [setStoredTasks, state.items])

  const notify = useCallback((message: string) => {
    setAlertMessage(message)
    window.setTimeout(() => setAlertMessage(''), 2600)
  }, [])

  const addTask = useCallback((title: string) => {
    dispatch({ type: 'ADD', title })
    notify(`Tarea agregada: ${title}`)
  }, [notify])

  const removeTask = useCallback((id: string) => {
    dispatch({ type: 'REMOVE', id })
    notify('Tarea eliminada correctamente')
  }, [notify])

  const toggleTask = useCallback((id: string) => {
    dispatch({ type: 'TOGGLE', id })
    const task = state.items.find((item) => item.id === id)
    notify(task?.completed ? 'Tarea marcada como pendiente' : 'Tarea completada')
  }, [notify, state.items])

  const setFilter = useCallback((filter: TaskState['filter']) => {
    dispatch({ type: 'FILTER', filter })
  }, [])

  const setSort = useCallback((sort: TaskState['sort']) => {
    dispatch({ type: 'SORT', sort })
  }, [])

  const completedCount = useMemo(
    () => state.items.filter((task) => task.completed).length,
    [state.items],
  )
  const progress = state.items.length
    ? Math.round((completedCount / state.items.length) * 100)
    : 0

  return (
    <main className={`app-shell ${theme}`}>
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark"><Target size={22} /></div>
          <div>
            <strong>FocusBoard</strong>
            <span>Gestión de tareas</span>
          </div>
        </div>
        <button className="icon-button" type="button" onClick={toggleTheme} aria-label="Cambiar tema">
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </header>

      <section className="welcome">
        <div>
          <p className="eyebrow">MI ESPACIO DE TRABAJO</p>
          <h1>Hola, Saúl</h1>
          <p className="muted">Organiza tus objetivos y convierte tus planes en progreso.</p>
        </div>
        <div className="date-card">
          <span>PROGRESO TOTAL</span>
          <strong>{progress}%</strong>
          <div className="progress-track"><div style={{ width: `${progress}%` }} /></div>
        </div>
      </section>

      <section className="stats-grid">
        <div className="stat-card"><div className="stat-icon purple"><Zap size={19} /></div><span>Total de tareas</span><strong>{state.items.length}</strong></div>
        <div className="stat-card"><div className="stat-icon"><CheckCircle2 size={19} /></div><span>Completadas</span><strong>{completedCount}</strong></div>
        <div className="stat-card"><div className="stat-icon"><RotateCcw size={19} /></div><span>Pendientes</span><strong>{state.items.length - completedCount}</strong></div>
      </section>

      <section className="tasks-panel">
        <div className="panel-heading">
          <div><h2>Mis tareas</h2><p className="muted">Gestiona tus actividades del día</p></div>
          <button className="primary-button" type="button" onClick={() => document.querySelector<HTMLInputElement>('.task-input')?.focus()}><Plus size={18} /> Nueva tarea</button>
        </div>
        {showTaskView && (
          <TaskList
            tasks={state.items}
            filter={state.filter}
            sort={state.sort}
            onAdd={addTask}
            onRemove={removeTask}
            onToggle={toggleTask}
            onFilterChange={setFilter}
            onSortChange={setSort}
          />
        )}
        <button className="cleanup-button" type="button" onClick={() => setShowTaskView((visible) => !visible)}>
          {showTaskView ? 'Simular Desmontaje (Cleanup)' : 'Mostrar lista de tareas'}
        </button>
      </section>

      {alertMessage && <div className="task-alert" role="status"><CheckCircle2 size={20} /> <span>{alertMessage}</span></div>}
      <footer><span>Desarrollo de Aplicaciones Web · Semana 07</span><span>Construido con React Hooks</span></footer>
    </main>
  )
}

export default App
