export type Category = 'male' | 'female' | 'kid'
export type ProductType = 'tshirt' | 'hoodie' | 'sweatshirt'
export type TshirtColor = 'white' | 'black' | 'navy' | 'gray' | 'red' | 'blue' | 'green' | 'purple' | 'yellow' | 'orange' | 'pink' | 'brown' | 'maroon' | 'forest' | 'teal'

export interface Design {
  id: string
  prompt: string
  imageUrl?: string
  style: string
}

export interface CartItem {
  id: string
  category: Category
  productType: ProductType
  design: Design
  color: TshirtColor
  price: number
}

export interface AppState {
  category?: Category
  productType?: ProductType
  design?: Design
  color?: TshirtColor
  cart: CartItem[]
}