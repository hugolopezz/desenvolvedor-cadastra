import { Product } from "../ts/Product"

export interface MinicartContextData {
  productsInCart: Product[]
  handleAddToCart: (productId: number) => void
  handleRemoveFromCart: (productId: number) => void
  isCartEmpty: boolean
  totalCartValue: number
  totalItemsInCart: number
  toggleMinicartVisibility: (open?: boolean) => void;
  isMinicartOpen: boolean
}
