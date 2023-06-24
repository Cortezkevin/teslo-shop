import { UIState } from './'

type UIAction = { 
  type: '[UI] - ToggleMenu', 
  payload: any 
};

export const uiReducer = ( state: UIState, action: UIAction ): UIState => {
  switch( action.type ) {
    case '[UI] - ToggleMenu':
      return {
        ...state,
        isMenuOpen: action.payload
      };
    default:
      return state;
  }
}