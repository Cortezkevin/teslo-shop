import { IUser } from '@/interfaces';
import { AuthState } from './'

type AuthAction = 
| { type: '[Auth] - Login', payload: IUser }
| { type: '[Auth] - Logout' };

export const authReducer = ( state: AuthState, action: AuthAction ): AuthState => {
  switch( action.type ) {
    case '[Auth] - Login':
      return {
        ...state,
        isLogged: true,
        user: action.payload
      };
    case '[Auth] - Logout':
      return {
        ...state,
        isLogged: false,
        user: undefined
      }
    default:
      return state;
  }
}