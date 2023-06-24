import { ICartProduct, IOrderDetail, IShippingAddress } from '@/interfaces';
import { createContext } from 'react';

export interface CartProps {
  isLoaded: boolean;
  cart: ICartProduct[];
  details: IOrderDetail;
  shippingAddress?: IShippingAddress,
  addProduct: ( product: ICartProduct ) => void;
  updateCartQuantity: ( product: ICartProduct ) => void;
  removeProduct: ( product: ICartProduct ) => void;
  updateAddress: (address: IShippingAddress) => void;
  createOrder: () =>  Promise<{ hasError: boolean; message: string }>;
}
export const CartContext = createContext({} as CartProps);