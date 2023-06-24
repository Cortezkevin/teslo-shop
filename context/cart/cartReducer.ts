import { ICartProduct, IOrderDetail, IShippingAddress } from '@/interfaces';
import { CartState } from './'

type CartAction = 
|  { 
      type: '[Cart] - Load Cart from cookies | storage', 
      payload: ICartProduct[] 
   }
|  {
      type: '[Cart] - Update products in cart',
      payload: ICartProduct[]
   }
|  {
    type: '[Cart] - Change cart quantity',
    payload: ICartProduct
   }
|  {
    type: '[Cart] - Remove product in cart',
    payload: ICartProduct
   }
|  {
    type: '[Cart] - Update order summary',
    payload: IOrderDetail
   }
|  { 
    type: '[Cart] - Load Shipping Address from cookies', 
    payload: IShippingAddress
  }
| {
    type: '[Cart] - Update Address',
    payload: IShippingAddress
  }
| {
    type: '[Cart] - Order Complete'
  };


export const cartReducer = ( state: CartState, action: CartAction ): CartState => {
  switch( action.type ) {
    case '[Cart] - Load Cart from cookies | storage':
      return {
        ...state,
        isLoaded: true,
        cart: [
          ...action.payload
        ],
      };
    case '[Cart] - Update products in cart':
      return {
        ...state,
        cart: [ 
          ...action.payload
        ],
      }
    case '[Cart] - Change cart quantity':
      return {
        ...state,
        cart: state.cart.map( product => {
          if( product._id !== action.payload._id ) return product;
          if( product.size !== action.payload.size ) return product;
          return action.payload;
        })
      }
    case '[Cart] - Remove product in cart':
      return {
        ...state,
        cart: state.cart.filter( product => !(product._id === action.payload._id && product.size === action.payload.size) )
      }
    case '[Cart] - Update order summary':
      return {
        ...state,
        details: {
          ...action.payload,
        }
      }
    case '[Cart] - Update Address':
    case '[Cart] - Load Shipping Address from cookies':
      return {
        ...state,
        shippingAddress: action.payload
      }
    case '[Cart] - Order Complete':
      return {
        ...state,
        cart: [],
        details: {
          numberOfItems: 0,
          subTotal: 0,
          tax: 0,
          total: 0
        }
      }
    default:
      return state;
  }
}