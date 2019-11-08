import { SET_APP_LOADING, LOAD_NOTES, ADD_NOTE, EDIT_NOTE, DELETE_NOTE } from './constants';

const initialState = {
  notes: [],
  appLoading: false
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_APP_LOADING: {
      return {
        ...state,
        appLoading: action.payload
      };
    }
    case LOAD_NOTES: {
      return {
        ...state,
        notes: [...action.payload]
      };
    }
    case ADD_NOTE: {
      return {
        ...state,
        notes: [...state.notes, action.payload]
      };
    }
    default:
      return state;
  }
}

export default reducer;