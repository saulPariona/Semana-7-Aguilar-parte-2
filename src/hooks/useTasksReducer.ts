export type Task = { id: string; title: string; completed: boolean; createdAt: number }
export type TaskState = { items: Task[]; filter: 'all' | 'pending' | 'completed'; sort: 'asc' | 'desc' }
export const initialTaskState: TaskState = { items: [], filter: 'all', sort: 'asc' }

export type TaskAction =
  | { type: 'ADD'; title: string }
  | { type: 'REMOVE'; id: string }
  | { type: 'TOGGLE'; id: string }
  | { type: 'FILTER'; filter: TaskState['filter'] }
  | { type: 'SORT'; sort: TaskState['sort'] }

export function tasksReducer(state: TaskState, action: TaskAction): TaskState {
  switch (action.type) {
    case 'ADD':
      return { ...state, items: [...state.items, { id: crypto.randomUUID(), title: action.title, completed: false, createdAt: Date.now() }] }
    case 'REMOVE':
      return { ...state, items: state.items.filter((task) => task.id !== action.id) }
    case 'TOGGLE':
      return { ...state, items: state.items.map((task) => task.id === action.id ? { ...task, completed: !task.completed } : task) }
    case 'FILTER':
      return { ...state, filter: action.filter }
    case 'SORT':
      return { ...state, sort: action.sort }
    default:
      return state
  }
}
