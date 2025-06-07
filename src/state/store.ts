import { configureStore } from "@reduxjs/toolkit";
import loadingReducer from "./loading/loading";
import authReducer from "./auth/auth";
import modalReducer from "./modal/modal";

export const store = configureStore({
  reducer: {
    loading: loadingReducer,
    auth: authReducer,
    modal: modalReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
