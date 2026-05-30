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

  return response({ ok: true, path: normalizedPath, method });
};
