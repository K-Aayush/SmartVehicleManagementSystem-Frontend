import { createContext, useContext } from "react"
import type { Product } from "../lib/types"

// Define cart item type (extends Product with quantity)
export interface CartItem extends Product {
  quantity: number
}

// Define cart context type
interface CartContextType {
  cartItems: CartItem[]
  addToCart: (product: Product) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  cartCount: number
  cartTotal: number
}

// Create context with default values
const CartContext = createContext<CartContextType>({
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  cartCount: 0,
  cartTotal: 0,
})

// Custom hook to use cart context
export const useCart = () => useContext(CartContext)
