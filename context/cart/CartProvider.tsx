import { FC, useEffect, useReducer, useState } from 'react';
import { CartContext, cartReducer } from './';
import { ICartProduct, IOrder, IOrderDetail, IShippingAddress } from '@/interfaces';
import Cookies from 'js-cookie';
import { tesloApi } from '@/api';
import axios from 'axios';

interface Props {
  children: React.ReactNode;
}

export interface CartState {
  isLoaded: boolean;
  cart: ICartProduct[];
  details: IOrderDetail;
  shippingAddress?: IShippingAddress,
}

const CART_INITIAL_STATE: CartState = {
  isLoaded: false,
  cart: [],
  details: {
    numberOfItems: 0,
    tax: 0.0,
    subTotal: 0.0,
    total: 0.0
  },
  shippingAddress: undefined
}

export const CartProvider: FC<Props> = ({ children }) => {

  const [ state, dispatch ] = useReducer( cartReducer , CART_INITIAL_STATE );
  const [isUpdated, setIsUpdated] = useState(false);

  useEffect(() => {
    try {
      const cookieProducts = Cookies.get('cart') ? JSON.parse(Cookies.get('cart')!) : [];
      dispatch({
        type: '[Cart] - Load Cart from cookies | storage',
        payload: cookieProducts
      })
    } catch (error) {
      dispatch({
        type: '[Cart] - Load Cart from cookies | storage',
        payload: []
      })
    }
  }, []);

  useEffect(() => {
    if( isUpdated ){
      Cookies.set('cart',JSON.stringify(state.cart));
    }
    setIsUpdated(true);
  }, [ state.cart ]);

  useEffect(() => {

    const numberOfItems = state.cart.reduce( ( prev, current ) => current.quantity + prev , 0);
    const subTotal = state.cart.reduce( ( prev, current ) => current.price * current.quantity + prev , 0);
    const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);

    const orderSummary: IOrderDetail = {
      numberOfItems,
      subTotal,
      tax: subTotal * taxRate,
      total: subTotal * ( taxRate + 1 )
    }

    dispatch({
      type: '[Cart] - Update order summary',
      payload: orderSummary
    })
  }, [ state.cart ]);

  useEffect(() => {
    if( Cookies.get('address') !== undefined ) {

      const address = JSON.parse( Cookies.get('address')! ) ;
      const shippingAddress = {
        name: address.name || '',
        lastName: address.lastName || '',
        address: address.address || '',
        address_2: address.address_2 || '',
        postalCode: address.postalCode || '',
        city: address.city || '',
        country:  address.country || '',
        phone: address.phone || '',
      };
      dispatch({
        type: '[Cart] - Load Shipping Address from cookies',
        payload: shippingAddress
      });
    }
  }, []);

  const addProduct = ( newProduct: ICartProduct ) => {
    const cart = state.cart;

    const existsInCart = cart.some( p => p._id === newProduct._id );

    if( !existsInCart ){
      return dispatch({
        type: '[Cart] - Update products in cart',
        payload: [ ...cart, newProduct ]
      });
    }

    const productInCartButDifferentSize = cart.some( p => p._id === newProduct._id && p.size === newProduct.size );
    if( !productInCartButDifferentSize ){
      return dispatch({
        type: '[Cart] - Update products in cart',
        payload: [ ...cart, newProduct ]
      });
    }

    return dispatch({
      type: '[Cart] - Update products in cart',
      payload: cart.map( p => {
        if( p._id !== newProduct._id ) return p;
        if( p.size !== newProduct.size ) return p;
      
        p.quantity += newProduct.quantity;
        return p;
      })
    });
  }

  const updateCartQuantity = ( product: ICartProduct ) => {
    dispatch({
      type: '[Cart] - Change cart quantity',
      payload: product
    })
  }

  const removeProduct = ( product: ICartProduct ) => {
    dispatch({
      type: '[Cart] - Remove product in cart',
      payload: product
    })
  }


  const updateAddress = ( address: IShippingAddress ) => {
    Cookies.set('address', JSON.stringify( address ) );
    dispatch({
      type: '[Cart] - Update Address',
      payload: address
    })
  }

  const createOrder = async (): Promise<{ hasError: boolean; message: string }> => {
    if( !state.shippingAddress ){
      throw new Error('Cannot be shipping address');
    }
    const body: IOrder = {
      orderItems: state.cart.map( p => ({ ...p, size: p.size! })),
      shippingAddress: state.shippingAddress,
      numberOfItems: state.details.numberOfItems,
      subTotal: state.details.subTotal,
      tax: state.details.tax,
      total: state.details.total,
      isPaid: false
    }
    try {
      const { data } = await tesloApi.post<IOrder>('/orders', body);
      dispatch({ type: '[Cart] - Order Complete' });
      return {
        message: data._id!,
        hasError: false
      }; 
    } catch (error: any) {
      if(axios.isAxiosError(error)){
        return {
          message: error.response?.data.message,
          hasError: true
        }; 
      }
      return {
        message: 'Error not controller',
        hasError: true
      }; 
    }
  }

  return (
    <CartContext.Provider value={{
        ...state,
        addProduct,
        updateCartQuantity,
        removeProduct,
        updateAddress,
        createOrder
    }} >
      { children }
    </CartContext.Provider>
  )
}