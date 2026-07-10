import {
  clearAdminSession,
  getAdminSession,
  setAdminSession,
  isTokenExpired,
} from "../utils/auth";

const DEFAULT_API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.trim() || "http://localhost:5191";
const DEFAULT_API_PREFIX = "/api/v1";

const API_BASE_URL = DEFAULT_API_BASE_URL;
const API_PREFIX = import.meta.env.VITE_API_PREFIX?.trim() || DEFAULT_API_PREFIX;
export class ApiError extends Error {
  constructor(message, status, payload) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

export const buildApiUrl = (path, { skipPrefix = false, withToken = false } = {}) => {
  if (!path) {
    return API_BASE_URL.replace(/\/+$/, "");
  }

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const prefixedPath = skipPrefix || normalizedPath.startsWith("/api/")
    ? normalizedPath
    : `${API_PREFIX.replace(/\/+$/, "")}${normalizedPath}`;

  // Backend proxy routes are loaded by the browser via <img>/<iframe>, which
  // doesn't attach the Authorization header. Append the access token via the
  // `token` query string when the caller asks for it.
  const isFileProxy = prefixedPath.startsWith("/api/v1/files/") && withToken;
  if (isFileProxy && typeof window !== "undefined") {
    const session = getAdminSession();
    if (session?.accessToken) {
      const separator = prefixedPath.includes("?") ? "&" : "?";
      return `${API_BASE_URL.replace(/\/+$/, "")}${prefixedPath}${separator}token=${encodeURIComponent(
        session.accessToken
      )}`;
    }
  }

  return `${API_BASE_URL.replace(/\/+$/, "")}${prefixedPath}`;
};

export const createPath = (template, params = {}) => {
  return Object.entries(params).reduce((acc, [key, value]) => {
    const encoded = encodeURIComponent(String(value));
    return acc.replaceAll(`:${key}`, encoded);
  }, template);
};

const appendQuery = (path, query = {}) => {
  const searchParams = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    if (Array.isArray(value)) {
      value.forEach((entry) => {
        searchParams.append(key, String(entry));
      });
      return;
    }

    searchParams.append(key, String(value));
  });

  const queryString = searchParams.toString();
  if (!queryString) return path;
  return `${path}${path.includes("?") ? "&" : "?"}${queryString}`;
};

const parseResponse = async (response) => {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();
  return text ? { message: text } : {};
};

const redirectToSignIn = () => {
  if (typeof window === "undefined") return;
  if (window.location.pathname !== "/sign-in") {
    window.location.replace("/sign-in");
  }
};

const extractAuthPayload = (payload) => payload?.data || payload || {};

const persistSessionFromAuthPayload = (payload, fallbackSession = null) => {
  const data = extractAuthPayload(payload);
  if (!data?.access_token) {
    throw new ApiError(
      extractApiErrorMessage(payload) || "Authentication failed",
      401,
      payload
    );
  }

  const email = data?.email || fallbackSession?.email || "";
  setAdminSession({
    email,
    accessToken: data.access_token,
    refreshToken: data.refresh_token || fallbackSession?.refreshToken || null,
    profile: {
      uid: data?.uid,
      email,
      role: data?.role,
      isVerified: data?.is_verified,
    },
  });

  return getAdminSession();
};

export const refreshAdminSession = async () => {
  const session = getAdminSession();
  const refreshToken = session?.refreshToken;

  if (!refreshToken) {
    clearAdminSession();
    throw new ApiError("Unauthorized. Please sign in again.", 401, {
      message: "Missing refresh token",
    });
  }

  const response = await fetch(buildApiUrl("/admin/auth/refresh"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken }),
  });

  const payload = await parseResponse(response);

  if (!response.ok) {
    if (response.status === 401) {
      clearAdminSession();
      redirectToSignIn();
    }

    throw new ApiError(
      extractApiErrorMessage(payload) || "Session refresh failed",
      response.status,
      payload
    );
  }

  return persistSessionFromAuthPayload(payload, session);
};

const ensureFreshAdminSession = async () => {
  const session = getAdminSession();

  if (!session?.accessToken) {
    clearAdminSession();
    redirectToSignIn();
    throw new ApiError("Unauthorized. Please sign in again.", 401, {
      message: "Missing access token",
    });
  }

  if (isTokenExpired(session.accessToken)) {
    return refreshAdminSession();
  }

  return session;
};

// Translate the backend's structured Zod validation errors into short, plain
// English sentences the user can act on. Falls back to the raw message if we
// don't recognize the field path or message.
const ZOD_CODE_MESSAGES = {
  invalid_type: "Please make sure all fields are filled in correctly.",
  too_small: "is too short — please provide a longer value.",
  too_big: "is too long — please shorten the value.",
  invalid_format: "is not a valid format.",
  invalid_string: "is not a valid value.",
  invalid_enum_value: "is not a valid option.",
  unrecognized_keys: "contains unexpected fields.",
  custom: "is invalid.",
};

const FIELD_LABELS = {
  "personalInfo.fullName": "Full Name",
  "personalInfo.email": "Personal Email Address",
  "personalInfo.phone": "Phone Number",
  "loginEmail": "Login Email",
  "primaryContact.name": "Primary Contact Name",
  "primaryContact.email": "Primary Contact Email",
  "primaryContact.phone": "Primary Contact Phone",
  "secondaryContact.name": "Secondary Contact Name",
  "secondaryContact.email": "Secondary Contact Email",
  "address.line1": "Address Line 1",
  "address.city": "City",
  "address.state": "State",
  "address.zip": "ZIP Code",
  "commission.number": "Commission Number",
  "commission.state": "Commission State",
  "commission.expirationDate": "Commission Expiration Date",
  "organization.companyName": "Company Name",
};

const prettyLabel = (path) => {
  if (!path || path === "(root)" || path === "body") return "Some fields";
  // Strip the leading "body." or "body[" prefix.
  const cleaned = String(path).replace(/^body\.?/, "");
  if (FIELD_LABELS[cleaned]) return FIELD_LABELS[cleaned];
  // Convert camelCase / dotted names to title case words.
  return cleaned
    .split(/[._]/)
    .filter(Boolean)
    .map((part) =>
      /^[a-z]+$/.test(part)
        ? part.charAt(0).toUpperCase() + part.slice(1)
        : part
    )
    .join(" ");
};

const translateZodIssue = (issue) => {
  const message = String(issue?.message || "");
  const code = issue?.code;
  const label = prettyLabel(
    Array.isArray(issue?.path) ? issue.path.join(".") : ""
  );

  if (code === "invalid_string" && /invalid email/i.test(message)) {
    return `${label} is not a valid email address.`;
  }
  if (code === "invalid_format" && issue?.format === "email") {
    return `${label} is not a valid email address.`;
  }
  if (code === "too_small" && /email/i.test(message)) {
    return `${label} is not a valid email address.`;
  }
  if (code === "invalid_type" && /received undefined|null/i.test(message)) {
    return `Please fill in ${label}.`;
  }
  if (code === "too_small") {
    return `${label} ${message.includes("array") ? "needs at least one entry" : "is too short"}. Please provide a longer value.`;
  }
  if (code === "too_big") {
    return `${label} is too long. Please shorten the value.`;
  }
  if (code === "invalid_enum_value") {
    return `${label} is not a supported option.`;
  }

  const generic = ZOD_CODE_MESSAGES[code] || "is invalid.";
  return `${label} ${generic}`;
};

const translateZodIssues = (details) => {
  const zodIssues = Array.isArray(details?.zodIssues)
    ? details.zodIssues
    : null;
  if (zodIssues && zodIssues.length > 0) {
    const translated = zodIssues
      .map(translateZodIssue)
      .filter(Boolean);
    if (translated.length === 1) return translated[0];
    if (translated.length > 1) {
      return `${translated[0]} (and ${translated.length - 1} other field${translated.length === 2 ? "" : "s"} need attention too)`;
    }
  }

  // Fallback to the structured "issues" string array if the backend only
  // serialized summary lines (older payloads).
  const issues = Array.isArray(details?.issues) ? details.issues : [];
  if (issues.length > 0) {
    return "Some fields need attention. Please review the form and try again.";
  }

  return null;
};

export const extractApiErrorMessage = (payload) => {
  // First, try to translate a structured Zod 400 into plain English.
  const details = payload?.error?.details || payload?.details;
  const translated = translateZodIssues(details);
  if (translated) return translated;

  if (Array.isArray(payload?.errors) && payload.errors.length > 0) {
    const first = payload.errors[0]?.message;
    if (first) return first;
  }

  if (typeof payload?.message === "string" && payload.message.trim()) {
    return payload.message;
  }

  if (typeof payload?.error === "string" && payload.error.trim()) {
    return payload.error;
  }

  if (typeof payload?.error?.message === "string" && payload.error.message.trim()) {
    return payload.error.message;
  }

  if (typeof payload?.detail === "string" && payload.detail.trim()) {
    return payload.detail;
  }

  return "Something went wrong. Please try again.";
};

export const apiRequest = async (
  path,
  {
    method = "GET",
    query,
    body,
    headers = {},
    auth = true,
    contentType = "application/json",
  } = {}
) => {
  const finalPath = appendQuery(path, query);
  const requestHeaders = { ...headers };

  const hasFormDataBody = body instanceof FormData;
  if (!hasFormDataBody && body !== undefined && contentType) {
    requestHeaders["Content-Type"] = contentType;
  }

  const performFetch = async (skipPrefix = false, token = null) => {
    if (auth) {
      const freshSession = await ensureFreshAdminSession();
      requestHeaders.Authorization = `Bearer ${freshSession.accessToken}`;
    } else if (token) {
      requestHeaders.Authorization = `Bearer ${token}`;
    }

    return fetch(buildApiUrl(finalPath, { skipPrefix }), {
      method,
      headers: requestHeaders,
      body:
        body === undefined
          ? undefined
          : hasFormDataBody || contentType !== "application/json"
            ? body
            : JSON.stringify(body),
    });
  };

  let response = await performFetch(false);
  let payload = await parseResponse(response);

  // Local backends sometimes expose routes without /api/v1 prefix.
  if (
    !response.ok &&
    response.status === 404 &&
    API_PREFIX &&
    !finalPath.startsWith("/api/")
  ) {
    response = await performFetch(true);
    payload = await parseResponse(response);
  }

  if (!response.ok && response.status === 401 && auth) {
    try {
      const refreshedSession = await refreshAdminSession();
      requestHeaders.Authorization = `Bearer ${refreshedSession.accessToken}`;
      response = await performFetch(false);
      payload = await parseResponse(response);
    } catch (refreshError) {
      if (refreshError instanceof ApiError) {
        throw refreshError;
      }
      throw new ApiError(
        "Session refresh failed",
        401,
        { message: "Session refresh failed" }
      );
    }
  }

  if (!response.ok) {
    if (response.status === 401) {
      clearAdminSession();
      redirectToSignIn();
    }

    throw new ApiError(
      extractApiErrorMessage(payload) || "Request failed",
      response.status,
      payload
    );
  }

  return payload;
};

export const apiRequestWithFallback = async (paths, options = {}) => {
  const candidates = Array.isArray(paths) ? paths : [paths];
  let lastError = null;

  for (const candidate of candidates) {
    try {
      return await apiRequest(candidate, options);
    } catch (error) {
      lastError = error;
      if (error?.status !== 404 && error?.status !== 405) {
        throw error;
      }
    }
  }

  throw lastError || new Error("Request failed");
};
