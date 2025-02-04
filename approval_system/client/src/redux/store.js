import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice";
import authReducer from "./features/auth/authSlice";
import ticketReducer from "./features/ticket/ticketSlice";
import deptReducer from "./features/dept/deptSlice";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  auth: authReducer,
  ticket: ticketReducer,
  dept: deptReducer
})

const persistConfig = {
  key: 'root',
  storage,
  version: 1
}

const persistedReducer = persistReducer(persistConfig,rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      }}).concat(apiSlice.middleware),
    devTools: true,
})

export const persistor = persistStore(store)