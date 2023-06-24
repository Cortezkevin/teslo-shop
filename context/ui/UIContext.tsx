import { createContext } from 'react';

export interface UIProps {
  isMenuOpen: boolean;
  toggleSideMenu: (show: boolean) => void;
}

export const UIContext = createContext({} as UIProps);