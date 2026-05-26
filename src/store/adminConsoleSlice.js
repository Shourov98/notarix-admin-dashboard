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

export const fetchAdminRequests = createAsyncThunk(
  "adminConsole/fetchAdminRequests",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const payload = await apiRequest("/admin/requests", {
        query: filters,
      });
      return payload?.data || payload || [];
    } catch (error) {
      return rejectWithValue(error?.message || "Unable to load access requests.");
    }
  }
);

export const approveAdminRequest = createAsyncThunk(
  "adminConsole/approveAdminRequest",
  async (requestId, { dispatch, rejectWithValue }) => {
    try {
      await apiRequest(`/admin/requests/${requestId}/approve`, {
        method: "PATCH",
      });
      await dispatch(fetchAdminRequests());
      return requestId;
    } catch (error) {
      return rejectWithValue(error?.message || "Unable to approve request.");
    }
  }
);

export const rejectAdminRequest = createAsyncThunk(
  "adminConsole/rejectAdminRequest",
  async ({ requestId, reason }, { dispatch, rejectWithValue }) => {
    try {
      await apiRequest(`/admin/requests/${requestId}/reject`, {
        method: "PATCH",
        body: { reason },
      });
      await dispatch(fetchAdminRequests());
      return requestId;
    } catch (error) {
      return rejectWithValue(error?.message || "Unable to reject request.");
    }
  }
);

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

export const createNotary = createAsyncThunk(
  "adminConsole/createNotary",
  async (notaryPayload, { dispatch, rejectWithValue }) => {
    try {
      const { documentUploads = [], ...createBody } = notaryPayload;
      const payload = await apiRequest("/admin/users/notary", {
        method: "POST",
        body: createBody,
      });

      const createdNotary = payload?.data || payload;
      if (createdNotary?.userId && documentUploads.length > 0) {
        const formData = new FormData();
        documentUploads.forEach((item) => {
          formData.append("documents", item.file);
          formData.append("documentTitles", item.title);
        });

        await apiRequest(`/admin/users/${createdNotary.userId}/documents`, {
          method: "POST",
          body: formData,
          contentType: null,
        });
      }

      await dispatch(fetchAdminConsole());
      return createdNotary;
    } catch (error) {
      return rejectWithValue(error?.message || "Unable to create notary.");
    }
  }
);

export const fetchAdmins = createAsyncThunk(
  "adminConsole/fetchAdmins",
  async (_, { rejectWithValue }) => {
    try {
      const payload = await apiRequest("/admin/admins");
      return payload?.data || payload || [];
    } catch (error) {
      return rejectWithValue(error?.message || "Unable to load admin list.");
    }
  }
);

export const createAdmin = createAsyncThunk(
  "adminConsole/createAdmin",
  async (adminPayload, { dispatch, rejectWithValue }) => {
    try {
      const payload = await apiRequest("/admin/users/admin", {
        method: "POST",
        body: adminPayload,
      });

      await Promise.all([dispatch(fetchAdmins()), dispatch(fetchAdminConsole())]);
      return payload?.data || payload;
    } catch (error) {
      return rejectWithValue(error?.message || "Unable to create admin.");
    }
  }
);

export const suspendAdmin = createAsyncThunk(
  "adminConsole/suspendAdmin",
  async (adminId, { dispatch, rejectWithValue }) => {
    try {
      await apiRequest(`/admin/admins/${adminId}/suspend`, {
        method: "PATCH",
      });

      await Promise.all([dispatch(fetchAdmins()), dispatch(fetchAdminConsole())]);
      return adminId;
    } catch (error) {
      return rejectWithValue(error?.message || "Unable to suspend admin.");
    }
  }
);

export const activateAdmin = createAsyncThunk(
  "adminConsole/activateAdmin",
  async (adminId, { dispatch, rejectWithValue }) => {
    try {
      await apiRequest(`/admin/admins/${adminId}/activate`, {
        method: "PATCH",
      });

      await Promise.all([dispatch(fetchAdmins()), dispatch(fetchAdminConsole())]);
      return adminId;
    } catch (error) {
      return rejectWithValue(error?.message || "Unable to activate admin.");
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
    createNotaryStatus: "idle",
    createNotaryError: null,
    activeUser: null,
    activeUserStatus: "idle",
    activeUserError: null,
    requests: [],
    requestsStatus: "idle",
    requestsError: null,
    requestActionStatus: "idle",
    admins: [],
    adminsStatus: "idle",
    adminsError: null,
    createAdminStatus: "idle",
    createAdminError: null,
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
      .addCase(createNotary.pending, (state) => {
        state.createNotaryStatus = "loading";
        state.createNotaryError = null;
      })
      .addCase(createNotary.fulfilled, (state) => {
        state.createNotaryStatus = "succeeded";
        state.createNotaryError = null;
      })
      .addCase(createNotary.rejected, (state, action) => {
        state.createNotaryStatus = "error";
        state.createNotaryError = action.payload || "Unable to create notary.";
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
      })
      .addCase(fetchAdminRequests.pending, (state) => {
        state.requestsStatus = "loading";
        state.requestsError = null;
      })
      .addCase(fetchAdminRequests.fulfilled, (state, action) => {
        state.requests = Array.isArray(action.payload) ? action.payload : [];
        state.requestsStatus = "ready";
        state.requestsError = null;
      })
      .addCase(fetchAdminRequests.rejected, (state, action) => {
        state.requestsStatus = "error";
        state.requestsError = action.payload || "Unable to load access requests.";
      })
      .addCase(approveAdminRequest.pending, (state) => {
        state.requestActionStatus = "loading";
      })
      .addCase(approveAdminRequest.fulfilled, (state) => {
        state.requestActionStatus = "ready";
      })
      .addCase(approveAdminRequest.rejected, (state, action) => {
        state.requestActionStatus = "error";
        state.requestsError = action.payload || "Unable to approve request.";
      })
      .addCase(rejectAdminRequest.pending, (state) => {
        state.requestActionStatus = "loading";
      })
      .addCase(rejectAdminRequest.fulfilled, (state) => {
        state.requestActionStatus = "ready";
      })
      .addCase(rejectAdminRequest.rejected, (state, action) => {
        state.requestActionStatus = "error";
        state.requestsError = action.payload || "Unable to reject request.";
      })
      .addCase(fetchAdmins.pending, (state) => {
        state.adminsStatus = "loading";
        state.adminsError = null;
      })
      .addCase(fetchAdmins.fulfilled, (state, action) => {
        state.admins = Array.isArray(action.payload) ? action.payload : [];
        state.adminsStatus = "ready";
        state.adminsError = null;
      })
      .addCase(fetchAdmins.rejected, (state, action) => {
        state.adminsStatus = "error";
        state.adminsError = action.payload || "Unable to load admin list.";
      })
      .addCase(createAdmin.pending, (state) => {
        state.createAdminStatus = "loading";
        state.createAdminError = null;
      })
      .addCase(createAdmin.fulfilled, (state) => {
        state.createAdminStatus = "succeeded";
        state.createAdminError = null;
      })
      .addCase(createAdmin.rejected, (state, action) => {
        state.createAdminStatus = "error";
        state.createAdminError = action.payload || "Unable to create admin.";
      })
      .addCase(suspendAdmin.pending, (state) => {
        state.adminsStatus = "loading";
      })
      .addCase(suspendAdmin.fulfilled, (state) => {
        state.adminsStatus = "ready";
      })
      .addCase(suspendAdmin.rejected, (state, action) => {
        state.adminsStatus = "error";
        state.adminsError = action.payload || "Unable to suspend admin.";
      })
      .addCase(activateAdmin.pending, (state) => {
        state.adminsStatus = "loading";
      })
      .addCase(activateAdmin.fulfilled, (state) => {
        state.adminsStatus = "ready";
      })
      .addCase(activateAdmin.rejected, (state, action) => {
        state.adminsStatus = "error";
        state.adminsError = action.payload || "Unable to activate admin.";
      });
  },
});

export const adminConsoleReducer = adminConsoleSlice.reducer;
export const selectAdminConsole = (state) => state.adminConsole;
