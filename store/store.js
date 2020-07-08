import { createStore, combineReducers, applyMiddleware } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { composeWithDevTools } from "redux-devtools-extension";
import ReduxThunk from "redux-thunk";
import reducer from "./reducer";

const persistConfig = {
  key: "root",
  storage,
};

const rootReducer = combineReducers({
  user: reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default () => {
  let store = createStore(
    persistedReducer,
    composeWithDevTools(applyMiddleware(ReduxThunk))
  );
  let persistor = persistStore(store);
  return { store, persistor };
};

//redux persist bug then use localstorage call store

// import { createStore, combineReducers } from "redux";
// import reducer from "./reducer";
// import { loadState, saveState } from "../store/locale/localStorage";

// const rootReducer = combineReducers({
//   user: reducer,
// });
// const persistStore = loadState();

// const store = createStore(rootReducer, persistStore);

// store.subscribe(() => {
//   saveState(store.getState());
// });

// export default store;
