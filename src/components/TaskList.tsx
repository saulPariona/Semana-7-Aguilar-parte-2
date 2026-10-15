import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ArrowDownAZ, ArrowUpAZ, Check, Circle, ListFilter, Trash2 } from 'lucide-react'
import type { Task, TaskState } from '../hooks/useTasksReducer'

type Props = {
  tasks: Task[]
  filter: TaskState['filter']
  sort: TaskState['sort']
  onAdd: (title: string) => void
  onRemove: (id: string) => void
  onToggle: (id: string) => void
  onFilterChange: (filter: TaskState['filter']) => void
  onSortChange: (sort: TaskState['sort']) => void
}

export function TaskList({ tasks, filter, sort, onAdd, onRemove, onToggle, onFilterChange, onSortChange }: Props) {
  const [inputValue, setInputValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const prevCountRef = useRef(tasks.length)
  const processedTasks = useMemo(() => [...tasks]
    .filter((task) => filter === 'all' || (filter === 'completed' ? task.completed : !task.completed))
    .sort((a, b) => sort === 'asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)), [tasks, filter, sort])

  useEffect(() => {
    if (tasks.length > prevCountRef.current) inputRef.current?.focus()
    prevCountRef.current = tasks.length
  }, [tasks.length])

  useEffect(() => {
    const timer = window.setInterval(() => console.info('TaskList activo: esperando cambios'), 30000)
    return () => {
      window.clearInterval(timer)
      console.info('TaskList desmontado: timer liberado')
    }
  }, [])

  const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const title = inputValue.trim()
    if (!title) return
    onAdd(title)
    setInputValue('')
  }, [inputValue, onAdd])

  return <div className="task-list">
    <form className="task-form" onSubmit={handleSubmit}>
      <input ref={inputRef} className="task-input" value={inputValue} onChange={(event) => setInputValue(event.target.value)} placeholder="¿Qué necesitas hacer?" aria-label="Nueva tarea" />
      <button className="add-button" type="submit">Agregar tarea</button>
    </form>
    <div className="toolbar">
      <div className="filter-group"><ListFilter size={16} /><button className={filter === 'all' ? 'active' : ''} onClick={() => onFilterChange('all')}>Todas</button><button className={filter === 'pending' ? 'active' : ''} onClick={() => onFilterChange('pending')}>Pendientes</button><button className={filter === 'completed' ? 'active' : ''} onClick={() => onFilterChange('completed')}>Completadas</button></div>
      <button className="sort-button" onClick={() => onSortChange(sort === 'asc' ? 'desc' : 'asc')}>{sort === 'asc' ? <ArrowDownAZ size={16} /> : <ArrowUpAZ size={16} />} {sort === 'asc' ? 'A-Z' : 'Z-A'}</button>
    </div>
    <div className="items">
      {processedTasks.length === 0 ? <div className="empty-state"><Circle size={24} /><p>No hay tareas en esta vista.</p></div> : processedTasks.map((task) => <TaskItem key={task.id} task={task} onRemove={onRemove} onToggle={onToggle} />)}
    </div>
  </div>
}

const TaskItem = ({ task, onRemove, onToggle }: { task: Task; onRemove: (id: string) => void; onToggle: (id: string) => void }) => (
  <div className={`task-item ${task.completed ? 'completed' : ''}`}>
    <button className="check-button" onClick={() => onToggle(task.id)} aria-label={task.completed ? 'Marcar como pendiente' : 'Marcar como completada'}>{task.completed ? <Check size={16} /> : <Circle size={19} />}</button>
    <span>{task.title}</span>
    <button className="delete-button" onClick={() => onRemove(task.id)} aria-label="Eliminar tarea"><Trash2 size={17} /></button>
  </div>
)
