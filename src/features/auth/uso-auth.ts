import { useContext } from 'react'
import { ContextoAuth } from './ctx'

export function useAuth() {
  return useContext(ContextoAuth)
}
