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
  selectPond: "",
  selectFactor: "",
  isFarmLoaded: false,
  isPondLoaded: false,
  isFactorLoaded: false,
  isBookingRefresh: false,
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
    case actionTypes.ISFARMLOADED_INNAVBAR:
      return {
        ...state,
        isFarmLoaded: action.isFarmLoaded,
      };
    case actionTypes.ISPONDLOADED_INDASHBOARD:
      return {
        ...state,
        isPondLoaded: action.isPondLoaded,
      };
    case actionTypes.ISFACTORLOADED_INNOTE:
      return {
        ...state,
        isFactorLoaded: action.isFactorLoaded,
      };
    case actionTypes.SETBOOKING_REFRESH:
      console.log(state);
      return {
        ...state,
        isBookingRefresh: action.isBookingRefresh,
      };

    default:
      // console.log(state);
      return state;
  }
};

export default reducer;
