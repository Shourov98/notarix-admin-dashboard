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

const preferLiveCollection = (fallbackItems, liveItems) =>
  Array.isArray(liveItems) && liveItems.length > 0 ? liveItems : fallbackItems;

const emptyPagination = {
  page: 1,
  pageSize: 10,
  totalItems: 0,
  totalPages: 1,
  hasPreviousPage: false,
  hasNextPage: false,
};

const extractPaginatedResult = (payload) => {
  const data = payload?.data || payload || {};
  return {
    items:
      data.items ||
      data.payments ||
      [],
    pagination: data.pagination || emptyPagination,
    summary: data.summary || null,
  };
};

const normalizeConsoleData = (payload) => ({
  currentAdmin:
    payload?.currentAdmin && Object.keys(payload.currentAdmin).length > 0
      ? payload.currentAdmin
      : fallbackCurrentAdmin,
  dashboardStats: preferLiveCollection(fallbackDashboardStats, payload?.dashboardStats),
  recentOrders: preferLiveCollection(fallbackRecentOrders, payload?.recentOrders),
  users: preferLiveCollection(fallbackUsers, payload?.users),
  orders: preferLiveCollection(fallbackOrders, payload?.orders),
  notaries: preferLiveCollection(fallbackNotaries, payload?.notaries),
  documents: preferLiveCollection(fallbackDocuments, payload?.documents),
  payments: preferLiveCollection(fallbackPayments, payload?.payments),
  messages: preferLiveCollection(fallbackMessages, payload?.messages),
  supportTickets: preferLiveCollection(fallbackSupportTickets, payload?.supportTickets),
  adminRows: preferLiveCollection(fallbackAdminRows, payload?.adminRows),
  metrics:
    payload?.metrics && Object.keys(payload.metrics).length > 0
      ? payload.metrics
      : {},
  reportSummary:
    payload?.reportSummary && Object.keys(payload.reportSummary).length > 0
      ? payload.reportSummary
      : null,
});

const baseState = normalizeConsoleData(null);

export const fetchAdminRequests = createAsyncThunk(
  "adminConsole/fetchAdminRequests",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const payload = await apiRequest("/admin/requests", {
        query: filters,
      });
      return extractPaginatedResult(payload);
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

export const fetchAdminOrders = createAsyncThunk(
  "adminConsole/fetchAdminOrders",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const payload = await apiRequest("/admin/orders", {
        query: filters,
      });
      return extractPaginatedResult(payload);
    } catch (error) {
      return rejectWithValue(error?.message || "Unable to load orders.");
    }
  }
);

export const fetchAdminUsers = createAsyncThunk(
  "adminConsole/fetchAdminUsers",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const payload = await apiRequest("/admin/users", {
        query: filters,
      });
      return extractPaginatedResult(payload);
    } catch (error) {
      return rejectWithValue(error?.message || "Unable to load users.");
    }
  }
);

export const fetchAdminDocuments = createAsyncThunk(
  "adminConsole/fetchAdminDocuments",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const payload = await apiRequest("/admin/documents", {
        query: filters,
      });
      return extractPaginatedResult(payload);
    } catch (error) {
      return rejectWithValue(error?.message || "Unable to load documents.");
    }
  }
);

export const fetchAdminOrder = createAsyncThunk(
  "adminConsole/fetchAdminOrder",
  async (orderId, { rejectWithValue }) => {
    try {
      const payload = await apiRequest(`/admin/orders/${orderId}`);
      return payload?.data || payload;
    } catch (error) {
      return rejectWithValue(error?.message || "Unable to load order details.");
    }
  }
);

export const fetchEligibleNotaries = createAsyncThunk(
  "adminConsole/fetchEligibleNotaries",
  async (orderId, { rejectWithValue }) => {
    try {
      const payload = await apiRequest(`/admin/orders/${orderId}/eligible-notaries`);
      return payload?.data || payload || [];
    } catch (error) {
      return rejectWithValue(error?.message || "Unable to load eligible notaries.");
    }
  }
);

export const acceptAdminOrder = createAsyncThunk(
  "adminConsole/acceptAdminOrder",
  async (orderId, { dispatch, rejectWithValue }) => {
    try {
      const payload = await apiRequest(`/admin/orders/${orderId}/accept`, {
        method: "PATCH",
      });
      const nextOrder = payload?.data || payload;
      await Promise.all([dispatch(fetchAdminConsole()), dispatch(fetchAdminOrders())]);
      return nextOrder;
    } catch (error) {
      return rejectWithValue(error?.message || "Unable to accept order.");
    }
  }
);

export const rejectAdminOrder = createAsyncThunk(
  "adminConsole/rejectAdminOrder",
  async ({ orderId, reason }, { dispatch, rejectWithValue }) => {
    try {
      const payload = await apiRequest(`/admin/orders/${orderId}/reject`, {
        method: "PATCH",
        body: { reason },
      });
      const nextOrder = payload?.data || payload;
      await Promise.all([dispatch(fetchAdminConsole()), dispatch(fetchAdminOrders())]);
      return nextOrder;
    } catch (error) {
      return rejectWithValue(error?.message || "Unable to reject order.");
    }
  }
);

export const assignAdminOrderNotary = createAsyncThunk(
  "adminConsole/assignAdminOrderNotary",
  async (
    { orderId, notaryId, notaryOfferAmount, payoutReleaseDays, assignmentNotes },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const payload = await apiRequest(`/admin/orders/${orderId}/assign-notary`, {
        method: "PATCH",
        body: { notaryId, notaryOfferAmount, payoutReleaseDays, assignmentNotes },
      });
      const nextOrder = payload?.data || payload;
      await Promise.all([
        dispatch(fetchAdminConsole()),
        dispatch(fetchAdminOrders()),
        dispatch(fetchAdminOrder(orderId)),
      ]);
      return nextOrder;
    } catch (error) {
      return rejectWithValue(error?.message || "Unable to assign notary.");
    }
  }
);

export const reassignAdminOrderNotary = createAsyncThunk(
  "adminConsole/reassignAdminOrderNotary",
  async (
    { orderId, notaryId, notaryOfferAmount, payoutReleaseDays, assignmentNotes },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const payload = await apiRequest(`/admin/orders/${orderId}/reassign-notary`, {
        method: "PATCH",
        body: { notaryId, notaryOfferAmount, payoutReleaseDays, assignmentNotes },
      });
      const nextOrder = payload?.data || payload;
      await Promise.all([
        dispatch(fetchAdminConsole()),
        dispatch(fetchAdminOrders()),
        dispatch(fetchAdminOrder(orderId)),
      ]);
      return nextOrder;
    } catch (error) {
      return rejectWithValue(error?.message || "Unable to reassign notary.");
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
      const { documentUploads = [], profilePhoto = null, ...createBody } = notaryPayload;
      const payload = await apiRequest("/admin/users/notary", {
        method: "POST",
        body: createBody,
      });

      const createdNotary = payload?.data || payload;
      if (createdNotary?.userId && profilePhoto) {
        const formData = new FormData();
        formData.append("profilePhoto", profilePhoto);

        await apiRequest(`/admin/users/${createdNotary.userId}/profile-photo`, {
          method: "POST",
          body: formData,
          contentType: null,
        });
      }

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
  async (filters = {}, { rejectWithValue }) => {
    try {
      const payload = await apiRequest("/admin/admins", {
        query: filters,
      });
      return extractPaginatedResult(payload);
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
    requestsPagination: emptyPagination,
    requestsStatus: "idle",
    requestsError: null,
    requestActionStatus: "idle",
    ordersStatus: "idle",
    ordersError: null,
    ordersPagination: emptyPagination,
    usersStatus: "idle",
    usersError: null,
    usersPagination: emptyPagination,
    documentsStatus: "idle",
    documentsError: null,
    documentsPagination: emptyPagination,
    activeOrder: null,
    activeOrderStatus: "idle",
    activeOrderError: null,
    eligibleNotaries: [],
    eligibleNotariesStatus: "idle",
    eligibleNotariesError: null,
    orderActionStatus: "idle",
    orderActionError: null,
    admins: [],
    adminsPagination: emptyPagination,
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
        state.requests = Array.isArray(action.payload?.items) ? action.payload.items : [];
        state.requestsPagination = action.payload?.pagination || emptyPagination;
        state.requestsStatus = "ready";
        state.requestsError = null;
      })
      .addCase(fetchAdminRequests.rejected, (state, action) => {
        state.requestsStatus = "error";
        state.requestsError = action.payload || "Unable to load access requests.";
      })
      .addCase(fetchAdminOrders.pending, (state) => {
        state.ordersStatus = "loading";
        state.ordersError = null;
      })
      .addCase(fetchAdminOrders.fulfilled, (state, action) => {
        state.orders = Array.isArray(action.payload?.items) ? action.payload.items : [];
        state.ordersPagination = action.payload?.pagination || emptyPagination;
        state.ordersStatus = "ready";
        state.ordersError = null;
      })
      .addCase(fetchAdminOrders.rejected, (state, action) => {
        state.ordersStatus = "error";
        state.ordersError = action.payload || "Unable to load orders.";
      })
      .addCase(fetchAdminUsers.pending, (state) => {
        state.usersStatus = "loading";
        state.usersError = null;
      })
      .addCase(fetchAdminUsers.fulfilled, (state, action) => {
        state.users = Array.isArray(action.payload?.items) ? action.payload.items : [];
        state.usersPagination = action.payload?.pagination || emptyPagination;
        state.usersStatus = "ready";
        state.usersError = null;
      })
      .addCase(fetchAdminUsers.rejected, (state, action) => {
        state.usersStatus = "error";
        state.usersError = action.payload || "Unable to load users.";
      })
      .addCase(fetchAdminDocuments.pending, (state) => {
        state.documentsStatus = "loading";
        state.documentsError = null;
      })
      .addCase(fetchAdminDocuments.fulfilled, (state, action) => {
        state.documents = Array.isArray(action.payload?.items) ? action.payload.items : [];
        state.documentsPagination = action.payload?.pagination || emptyPagination;
        state.documentsStatus = "ready";
        state.documentsError = null;
      })
      .addCase(fetchAdminDocuments.rejected, (state, action) => {
        state.documentsStatus = "error";
        state.documentsError = action.payload || "Unable to load documents.";
      })
      .addCase(fetchAdminOrder.pending, (state) => {
        state.activeOrderStatus = "loading";
        state.activeOrderError = null;
      })
      .addCase(fetchAdminOrder.fulfilled, (state, action) => {
        state.activeOrder = action.payload || null;
        state.activeOrderStatus = "ready";
        state.activeOrderError = null;
      })
      .addCase(fetchAdminOrder.rejected, (state, action) => {
        state.activeOrder = null;
        state.activeOrderStatus = "error";
        state.activeOrderError = action.payload || "Unable to load order details.";
      })
      .addCase(fetchEligibleNotaries.pending, (state) => {
        state.eligibleNotariesStatus = "loading";
        state.eligibleNotariesError = null;
      })
      .addCase(fetchEligibleNotaries.fulfilled, (state, action) => {
        state.eligibleNotaries = Array.isArray(action.payload) ? action.payload : [];
        state.eligibleNotariesStatus = "ready";
        state.eligibleNotariesError = null;
      })
      .addCase(fetchEligibleNotaries.rejected, (state, action) => {
        state.eligibleNotaries = [];
        state.eligibleNotariesStatus = "error";
        state.eligibleNotariesError = action.payload || "Unable to load eligible notaries.";
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
      .addCase(acceptAdminOrder.pending, (state) => {
        state.orderActionStatus = "loading";
        state.orderActionError = null;
      })
      .addCase(acceptAdminOrder.fulfilled, (state, action) => {
        state.orderActionStatus = "ready";
        state.orderActionError = null;
        state.activeOrder = action.payload || state.activeOrder;
      })
      .addCase(acceptAdminOrder.rejected, (state, action) => {
        state.orderActionStatus = "error";
        state.orderActionError = action.payload || "Unable to accept order.";
      })
      .addCase(rejectAdminOrder.pending, (state) => {
        state.orderActionStatus = "loading";
        state.orderActionError = null;
      })
      .addCase(rejectAdminOrder.fulfilled, (state, action) => {
        state.orderActionStatus = "ready";
        state.orderActionError = null;
        state.activeOrder = action.payload || state.activeOrder;
      })
      .addCase(rejectAdminOrder.rejected, (state, action) => {
        state.orderActionStatus = "error";
        state.orderActionError = action.payload || "Unable to reject order.";
      })
      .addCase(assignAdminOrderNotary.pending, (state) => {
        state.orderActionStatus = "loading";
        state.orderActionError = null;
      })
      .addCase(assignAdminOrderNotary.fulfilled, (state, action) => {
        state.orderActionStatus = "ready";
        state.orderActionError = null;
        state.activeOrder = action.payload || state.activeOrder;
      })
      .addCase(assignAdminOrderNotary.rejected, (state, action) => {
        state.orderActionStatus = "error";
        state.orderActionError = action.payload || "Unable to assign notary.";
      })
      .addCase(reassignAdminOrderNotary.pending, (state) => {
        state.orderActionStatus = "loading";
        state.orderActionError = null;
      })
      .addCase(reassignAdminOrderNotary.fulfilled, (state, action) => {
        state.orderActionStatus = "ready";
        state.orderActionError = null;
        state.activeOrder = action.payload || state.activeOrder;
      })
      .addCase(reassignAdminOrderNotary.rejected, (state, action) => {
        state.orderActionStatus = "error";
        state.orderActionError = action.payload || "Unable to reassign notary.";
      })
      .addCase(fetchAdmins.pending, (state) => {
        state.adminsStatus = "loading";
        state.adminsError = null;
      })
      .addCase(fetchAdmins.fulfilled, (state, action) => {
        state.admins = Array.isArray(action.payload?.items) ? action.payload.items : [];
        state.adminsPagination = action.payload?.pagination || emptyPagination;
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
