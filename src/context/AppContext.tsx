'use client'

import { createContext, useContext, useReducer, ReactNode } from 'react'
import { AppState, Category, ProductType, Design, TshirtColor, CartItem } from '@/types'

type AppAction = 
  | { type: 'SET_CATEGORY'; payload: Category }
  | { type: 'SET_PRODUCT_TYPE'; payload: ProductType }
  | { type: 'SET_DESIGN'; payload: Design }
  | { type: 'SET_COLOR'; payload: TshirtColor }
  | { type: 'SET_DESIGN_WITH_COLOR'; payload: { design: Design; color: TshirtColor } }
  | { type: 'ADD_TO_CART'; payload: CartItem }
  | { type: 'RESET' }

const initialState: AppState = {
  cart: [],
  color: 'white'
}

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_CATEGORY':
      return { ...state, category: action.payload }
    case 'SET_PRODUCT_TYPE':
      return { ...state, productType: action.payload }
    case 'SET_DESIGN':
      return { ...state, design: action.payload }
    case 'SET_COLOR':
      return { ...state, color: action.payload }
    case 'SET_DESIGN_WITH_COLOR':
      return { ...state, design: action.payload.design, color: action.payload.color }
    case 'ADD_TO_CART':
      return { ...state, cart: [...state.cart, action.payload] }
    case 'RESET':
      return { ...initialState, cart: state.cart }
    default:
      return state
  }
}

const AppContext = createContext<{
  state: AppState
  dispatch: React.Dispatch<AppAction>
} | null>(null)

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(appReducer, initialState)

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}