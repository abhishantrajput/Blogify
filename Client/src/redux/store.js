import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import themeReducer from "../redux/theme/themeSlice.js"
import userReducer from "../redux/user/userSlice.js";

const rootReducer = combineReducers({
  user: userReducer,
  theme:themeReducer
});

const persistconfig = {
  key: "root",
  storage,
  version: 1,
};

const persistedReducer = persistReducer(persistconfig, rootReducer);

export const store = configureStore({
  reducer: 
    persistedReducer
  ,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
