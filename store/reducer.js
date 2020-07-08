import * as actionTypes from "./actions";

const initialState = {
  isLogin: false,
  token: "",
  farm: {},
  pond: {},
  name: "",
  surname: "",
  email: "",
  selectFarm: "",
  factorList: {},
  isPondLoaded: false,
  selectPond: "",
  selectFactor: "",
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.AUTHEN:
      return {
        ...state,
        isLogin: action.authen,
        token: action.token,
      };
    case actionTypes.FARM:
      return {
        ...state,
        farm: action.FarmData,
      };
    case actionTypes.POND:
      return {
        ...state,
        pond: action.PondData,
      };
    case actionTypes.FACTOR:
      return {
        ...state,
        factorList: action.factorList,
      };
    case actionTypes.FARM_SELECT:
      return {
        ...state,
        selectFarm: action.selectFarm,
      };
    case actionTypes.SELECT_PONDID:
      return {
        ...state,
        selectPond: action.selectPond,
      };
    case actionTypes.SELECT_FACTOR:
      return {
        ...state,
        selectFactor: action.selectFactor,
      };

    default:
      // console.log(state);
      return state;
  }
};

export default reducer;
