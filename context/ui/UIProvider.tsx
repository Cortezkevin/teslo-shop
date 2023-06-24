import { FC, ReactElement, useReducer } from 'react';
import { UIContext, uiReducer } from './';


interface Props {
  children: ReactElement | ReactElement[];
}
export interface UIState {
  isMenuOpen: boolean;
}

const UI_INITIAL_STATE: UIState = {
  isMenuOpen: false
}

export const UIProvider: FC<Props> = ({ children }) => {

  const [ state, dispatch ] = useReducer( uiReducer , UI_INITIAL_STATE );

  const toggleSideMenu = ( show: boolean ) => {
    dispatch({
      type: '[UI] - ToggleMenu',
      payload: show
    })
  }

  return (
    <UIContext.Provider value={{
      ...state,
      toggleSideMenu
    }} >
      { children }
    </UIContext.Provider>
  )
}