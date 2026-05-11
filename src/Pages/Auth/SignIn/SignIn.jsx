import { Eye, EyeOff } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { isAdminAuthenticated, setAdminSession } from "../../../utils/auth";
import { loginAdmin } from "../../../services/authApi";
import AuthShell from "../../../Components/Auth/AuthShell";
import AuthNotice from "../../../Components/Auth/AuthNotice";

const SignIn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(true);
  const [notice, setNotice] = useState(location.state?.notice || null);
  const redirectPath = location.state?.from?.pathname || "/dashboard";

  const togglePasswordVisibility = () => {
    setShowPassword((current) => !current);
  };

  useEffect(() => {
    if (isAdminAuthenticated()) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  const onSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "").trim().toLowerCase();
    const password = String(formData.get("password") || "");

    if (!email || !password) {
      setNotice({ type: "error", message: "Please enter your email and password." });
      return;
    }

    setLoading(true);
    setNotice(null);

    try {
      const payload = await loginAdmin({
        email,
        password,
      });

      const data = payload?.data || payload;
      const accessToken = data?.access_token;
      const refreshToken = data?.refresh_token;

      if (!accessToken) {
        throw new Error("Login response did not include access token.");
      }

      setAdminSession({
        email: data?.email || email,
        accessToken,
        refreshToken,
        profile: {
          uid: data?.uid,
          email: data?.email || email,
          role: data?.role,
          isVerified: data?.is_verified,
        },
      });

      navigate(redirectPath, { replace: true });
    } catch (error) {
      setNotice({
        type: "error",
        message: error.message || "Unable to login. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell compact>
      <form onSubmit={onSubmit} className="w-full">
        <AuthNotice notice={notice} />

        <label className="mb-8 block">
          <span className="mb-2 block text-[18px] font-semibold text-white">Email</span>
          <input
            name="email"
            type="email"
            autoComplete="username"
            required
            className="h-16 rounded-xl border-0 bg-white px-5 text-lg text-slate-900 shadow-none"
          />
        </label>

        <label className="mb-4 block">
          <span className="mb-2 block text-[18px] font-semibold text-white">Password</span>
          <div className="relative flex items-center">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              minLength={6}
              className="h-16 rounded-xl border-0 bg-white px-5 pr-14 text-lg text-slate-900 shadow-none"
            />
            <button
              onClick={togglePasswordVisibility}
              type="button"
              className="absolute right-4 text-lg text-slate-500"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </label>

        <div className="mb-9 flex flex-col gap-4 text-white md:flex-row md:items-center md:justify-between">
          <label className="flex items-center gap-2 text-[15px] text-white">
            <input
              type="checkbox"
              checked={remember}
              onChange={(event) => setRemember(event.target.checked)}
              className="h-4 w-4 rounded border-white/80 bg-transparent accent-white"
            />
            <span>Remember password</span>
          </label>

          <Link
            to="/forgate-password"
            className="text-[15px] font-medium text-white underline underline-offset-4"
          >
            Forgot password?
          </Link>
        </div>

        <button
          className="h-14 w-full rounded-lg bg-white text-xl font-semibold text-[var(--color-brand-primary)] hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-70"
          type="submit"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </AuthShell>
  );
};

export default SignIn;
