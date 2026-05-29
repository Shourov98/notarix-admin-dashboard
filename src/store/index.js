import { configureStore } from "@reduxjs/toolkit";
import { adminConsoleReducer } from "./adminConsoleSlice";

export const store = configureStore({
  reducer: {
    adminConsole: adminConsoleReducer,
  },
});
