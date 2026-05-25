import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  adminRows as fallbackAdminRows,
  currentAdmin as fallbackCurrentAdmin,
  dashboardStats as fallbackDashboardStats,
  documents as fallbackDocuments,
  messages as fallbackMessages,
  notaries as fallbackNotaries,
  orders as fallbackOrders,
  payments as fallbackPayments,
  recentOrders as fallbackRecentOrders,
  supportTickets as fallbackSupportTickets,
  users as fallbackUsers,
} from "../admin/data/notarixData";
import { apiRequest } from "../services/httpClient";
import { isAdminAuthenticated } from "../utils/auth";

const mergeBy = (fallbackItems, liveItems, key) => {
  if (!Array.isArray(liveItems) || liveItems.length === 0) {
    return fallbackItems;
  }

  return fallbackItems.map((fallbackItem) => {
    const liveMatch = liveItems.find((item) => item[key] === fallbackItem[key]);
    return liveMatch ? { ...fallbackItem, ...liveMatch } : fallbackItem;
  });
};

const normalizeConsoleData = (payload) => ({
  currentAdmin: { ...fallbackCurrentAdmin, ...(payload?.currentAdmin || {}) },
  dashboardStats: mergeBy(fallbackDashboardStats, payload?.dashboardStats, "label"),
  recentOrders: mergeBy(fallbackRecentOrders, payload?.recentOrders, "id"),
  users: payload?.users?.length ? payload.users : fallbackUsers,
  orders: payload?.orders?.length ? payload.orders : fallbackOrders,
  notaries: payload?.notaries?.length ? payload.notaries : fallbackNotaries,
  documents: payload?.documents?.length ? payload.documents : fallbackDocuments,
  payments: payload?.payments?.length ? payload.payments : fallbackPayments,
  messages: payload?.messages?.length ? payload.messages : fallbackMessages,
  supportTickets: payload?.supportTickets?.length ? payload.supportTickets : fallbackSupportTickets,
  adminRows: payload?.adminRows?.length ? payload.adminRows : fallbackAdminRows,
  metrics: payload?.metrics || {},
  reportSummary: payload?.reportSummary || null,
});

const baseState = normalizeConsoleData(null);

export const fetchAdminConsole = createAsyncThunk(
  "adminConsole/fetchAdminConsole",
  async (_, { rejectWithValue }) => {
    if (!isAdminAuthenticated()) {
      return normalizeConsoleData(null);
    }

    try {
      const payload = await apiRequest("/admin/console");
      return normalizeConsoleData(payload?.data || payload);
    } catch (error) {
      return rejectWithValue(error?.message || "Unable to load admin console.");
    }
  }
);

export const createClient = createAsyncThunk(
  "adminConsole/createClient",
  async (clientPayload, { dispatch, rejectWithValue }) => {
    try {
      const { documentUploads = [], ...createBody } = clientPayload;
      const payload = await apiRequest("/admin/users/client", {
        method: "POST",
        body: createBody,
      });

      const createdClient = payload?.data || payload;
      if (createdClient?.userId && documentUploads.length > 0) {
        const formData = new FormData();
        documentUploads.forEach((item) => {
          formData.append("documents", item.file);
          formData.append("documentTitles", item.title);
        });

        await apiRequest(`/admin/users/${createdClient.userId}/documents`, {
          method: "POST",
          body: formData,
          contentType: null,
        });
      }

      await dispatch(fetchAdminConsole());
      return createdClient;
    } catch (error) {
      return rejectWithValue(error?.message || "Unable to create client.");
    }
  }
);

export const fetchAdminUser = createAsyncThunk(
  "adminConsole/fetchAdminUser",
  async (userId, { rejectWithValue }) => {
    try {
      const payload = await apiRequest(`/admin/users/${userId}`);
      return payload?.data || payload;
    } catch (error) {
      return rejectWithValue(error?.message || "Unable to load user profile.");
    }
  }
);

export const updateUserDocumentStatus = createAsyncThunk(
  "adminConsole/updateUserDocumentStatus",
  async ({ userId, documentId, status }, { dispatch, rejectWithValue }) => {
    try {
      await apiRequest(`/admin/users/${userId}/documents/${documentId}/status`, {
        method: "PATCH",
        body: { status },
      });

      await Promise.all([
        dispatch(fetchAdminUser(userId)),
        dispatch(fetchAdminConsole()),
      ]);

      return { userId, documentId, status };
    } catch (error) {
      return rejectWithValue(error?.message || "Unable to update document status.");
    }
  }
);

const adminConsoleSlice = createSlice({
  name: "adminConsole",
  initialState: {
    ...baseState,
    status: "idle",
    error: null,
    createClientStatus: "idle",
    createClientError: null,
    activeUser: null,
    activeUserStatus: "idle",
    activeUserError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminConsole.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAdminConsole.fulfilled, (state, action) => {
        Object.assign(state, action.payload);
        state.status = "ready";
        state.error = null;
      })
      .addCase(fetchAdminConsole.rejected, (state, action) => {
        Object.assign(state, baseState);
        state.status = "error";
        state.error = action.payload || "Unable to load admin console.";
      })
      .addCase(createClient.pending, (state) => {
        state.createClientStatus = "loading";
        state.createClientError = null;
      })
      .addCase(createClient.fulfilled, (state) => {
        state.createClientStatus = "succeeded";
        state.createClientError = null;
      })
      .addCase(createClient.rejected, (state, action) => {
        state.createClientStatus = "error";
        state.createClientError = action.payload || "Unable to create client.";
      })
      .addCase(fetchAdminUser.pending, (state) => {
        state.activeUserStatus = "loading";
        state.activeUserError = null;
      })
      .addCase(fetchAdminUser.fulfilled, (state, action) => {
        state.activeUser = action.payload;
        state.activeUserStatus = "ready";
        state.activeUserError = null;
      })
      .addCase(fetchAdminUser.rejected, (state, action) => {
        state.activeUser = null;
        state.activeUserStatus = "error";
        state.activeUserError = action.payload || "Unable to load user profile.";
      });
  },
});

export const adminConsoleReducer = adminConsoleSlice.reducer;
export const selectAdminConsole = (state) => state.adminConsole;
