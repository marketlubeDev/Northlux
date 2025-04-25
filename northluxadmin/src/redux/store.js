import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import storeReducer from "./features/storeSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["store"],
};

const persistedReducer = persistReducer(persistConfig, storeReducer);

const store = configureStore({
  reducer: {
    store: persistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/REGISTER",
        ],
      },
    }),
});

export const persistor = persistStore(store);

export default store;
