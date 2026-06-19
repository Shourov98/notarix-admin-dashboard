import { createSlice, nanoid } from "@reduxjs/toolkit";

const MAX_ITEMS = 25;

const initialState = {
  items: [],
  unread: 0,
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    pushNotification: {
      reducer(state, action) {
        const item = action.payload;
        state.items = [item, ...state.items].slice(0, MAX_ITEMS);
        state.unread = state.unread + 1;
      },
      prepare(payload) {
        return {
          payload: {
            id: payload?.id || nanoid(),
            title: payload?.title || "Update",
            body: payload?.body || "",
            level: payload?.level || "info",
            createdAt: payload?.createdAt || new Date().toISOString(),
            ...payload,
          },
        };
      },
    },
    markAllRead(state) {
      state.unread = 0;
    },
    clearNotifications(state) {
      state.items = [];
      state.unread = 0;
    },
  },
});

export const { pushNotification, markAllRead, clearNotifications } =
  notificationsSlice.actions;
export const notificationsReducer = notificationsSlice.reducer;
export const selectNotifications = (state) => state.notifications;
