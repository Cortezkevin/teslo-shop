import { FC, ReactElement, useEffect, useReducer } from 'react';
import { AuthContext, authReducer } from './';
import { IUser } from '@/interfaces';
import { tesloApi } from '@/api';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useSession, signOut } from 'next-auth/react';

interface Props {
  children: ReactElement | ReactElement[];
}

export interface AuthState {
  isLoaded: boolean;
  isLogged: boolean;
  user?: IUser;
}

const Auth_INITIAL_STATE: AuthState = {
  isLoaded: false,
  isLogged: false,
  user: undefined
}

const API_PATH = '/user'

export const AuthProvider: FC<Props> = ({ children }) => {

  const { data: session, status } = useSession();
  const [ state, dispatch ] = useReducer( authReducer , Auth_INITIAL_STATE );

  useEffect(() => {
    if( status==='authenticated' ){
      dispatch({
        type: '[Auth] - Login',
        payload: session?.user as IUser
      });
    }
  },[ status, session ]);

  /* useEffect(() => {
    verifyToken();
  }, []);
 */
  const verifyToken = async () => {
    try {
      const { data: { token, user } } = await tesloApi.get(`${API_PATH}/validate-token`);
      Cookies.set('token', token);
      dispatch({
        type: '[Auth] - Login',
        payload: user
      });
    } catch (error) {
      Cookies.remove('token');
      dispatch({
        type: '[Auth] - Logout'
      })
    }
  }

  const loginUser = async ( email: string, password: string): Promise<boolean> => {
    try {
      const { data: { token, user } } = await tesloApi.post(`${API_PATH}/login`, { email, password });
      Cookies.set('token', token);
      dispatch({
        type: '[Auth] - Login',
        payload: user
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  const registerUser = async ( name: string, email: string, password: string): Promise<{ hasError: boolean, message?: string}> => {
    try {
      const { data: { token, user } } = await tesloApi.post(`${API_PATH}/register`, { name, email, password });
      Cookies.set('token', token);
      dispatch({
        type: '[Auth] - Login',
        payload: user
      });
      return {
        hasError: false
      }
    } catch (error) {
      if( axios.isAxiosError(error) ){
        return {
          hasError: true,
          message: error.response?.data.message
        }
      }
      return {
        hasError: true,
        message: 'Could not create user'
      }
    }
  }

  const logout = () => {
    //Cookies.remove('token');
    Cookies.remove('cart');
    Cookies.remove('address');

    signOut();
    //router.reload(); //reinicia la pagina
  }

  return (
    <AuthContext.Provider value={{
      ...state,
      loginUser,
      registerUser,
      logout
    }} >
      { children }
    </AuthContext.Provider>
  )
}