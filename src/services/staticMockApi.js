const createMockToken = () => {
  const header = btoa(JSON.stringify({ alg: "none", typ: "JWT" }));
  const payload = btoa(
    JSON.stringify({
      sub: "notarix-admin-001",
      role: "super_admin",
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
    })
  );

  return `${header}.${payload}.notarix-static-signature`;
};

const response = (data, message = "OK") => ({
  success: true,
  message,
  data,
});

const mockRequests = [
  {
    id: "req-1001",
    name: "Marcus Rivera",
    email: "m.rivera@notarix-partner.com",
    companyName: "Rivera Notary Services",
    phone: "+1-555-300-4001",
    contactType: "Notary",
    requestType: "Access Request",
    state: "Florida",
    message: "I would like to join the platform as an approved notary.",
    status: "Pending",
    createdAt: "2026-05-23T10:45:00.000Z",
  },
  {
    id: "req-1002",
    name: "Sarah Connor",
    email: "s.connor@firsttitle.com",
    companyName: "First Title Group",
    phone: "+1-555-300-4002",
    contactType: "Client",
    requestType: "Access Request",
    state: "Texas",
    message: "Need client account access for title operations.",
    status: "Approved",
    createdAt: "2026-05-22T15:12:00.000Z",
  },
  {
    id: "req-1003",
    name: "Darren Miles",
    email: "d.miles@homelink.com",
    companyName: "HomeLink",
    phone: "+1-555-300-4003",
    contactType: "Client",
    requestType: "Access Request",
    state: "California",
    message: "Need onboarding support for a new operations team.",
    status: "Rejected",
    rejectionReason: "Missing compliance documentation.",
    createdAt: "2026-05-21T11:20:00.000Z",
  },
];

const normalize = (path) => path.split("?")[0].replace(/\/+$/, "") || "/";

export const getStaticMockResponse = (path, options = {}) => {
  const method = String(options.method || "GET").toUpperCase();
  const normalizedPath = normalize(path);

  if (normalizedPath === "/admin/auth/login" && method === "POST") {
    const email = options.body?.email || "admin@notarix.io";

    return response(
      {
        uid: "notarix-admin-001",
        email,
        role: "super_admin",
        is_verified: true,
        access_token: createMockToken(),
        refresh_token: createMockToken(),
        expires_in: 86400,
      },
      "Login successful"
    );
  }

  if (
    [
      "/admin/auth/forgot-password",
      "/admin/auth/resend-forgot-otp",
      "/admin/auth/verify-forgot-otp",
      "/admin/auth/reset-password",
      "/admin/change-password",
    ].includes(normalizedPath)
  ) {
    return response({ ok: true }, "Request completed");
  }

  if (normalizedPath === "/admin/requests" && method === "GET") {
    return response(mockRequests);
  }

  if (normalizedPath.startsWith("/admin/requests/") && method === "GET") {
    const id = normalizedPath.split("/").pop();
    return response(mockRequests.find((item) => item.id === id) || null);
  }

  if (normalizedPath.endsWith("/approve") && method === "PATCH") {
    return response({ ok: true }, "Request approved successfully.");
  }

  if (normalizedPath.endsWith("/reject") && method === "PATCH") {
    return response({ ok: true }, "Request rejected successfully.");
  }

  return response({ ok: true, path: normalizedPath, method });
};
