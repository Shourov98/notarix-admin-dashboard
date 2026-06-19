import { configureStore } from "@reduxjs/toolkit";
import { adminConsoleReducer } from "./adminConsoleSlice";
import { notificationsReducer } from "./notificationsSlice";

export const store = configureStore({
  reducer: {
    adminConsole: adminConsoleReducer,
    notifications: notificationsReducer,
  },
});
