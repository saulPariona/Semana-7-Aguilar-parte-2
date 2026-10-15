import { useCallback, useState } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const value = window.localStorage.getItem(key)
      return value ? (JSON.parse(value) as T) : initialValue
    } catch (error) {
      console.error(`No se pudo leer ${key} desde localStorage`, error)
      return initialValue
    }
  })

  const setValue = useCallback((value: T | ((current: T) => T)) => {
    setStoredValue((current) => {
      const nextValue = value instanceof Function ? value(current) : value
      try {
        window.localStorage.setItem(key, JSON.stringify(nextValue))
      } catch (error) {
        console.error(`No se pudo guardar ${key} en localStorage`, error)
      }
      return nextValue
    })
  }, [key])

  return [storedValue, setValue] as const
}
