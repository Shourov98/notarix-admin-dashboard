import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { isAdminAuthenticated, setAdminSession } from "../../../utils/auth";
import { loginAdmin } from "../../../services/authApi";
import AuthCard from "../../../Components/Auth/AuthCard";
import AuthField from "../../../Components/Auth/AuthField";
import AuthShell from "../../../Components/Auth/AuthShell";

const SignIn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const redirectPath = location.state?.from?.pathname || "/dashboard";

  const togglePasswordVisibility = () => {
    setShowPassword((current) => !current);
  };

  useEffect(() => {
    if (isAdminAuthenticated()) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    const notice = location.state?.notice;
    if (!notice?.message) return;

    if (notice.type === "success") {
      toast.success(notice.message);
    } else {
      toast.error(notice.message);
    }
  }, [location.state]);

  const onSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "").trim().toLowerCase();
    const password = String(formData.get("password") || "");

    if (!email || !password) {
      toast.error("Please enter your email and password.");
      return;
    }

    setLoading(true);

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
      toast.error(error.message || "Unable to login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell compact>
      <AuthCard title="Welcome Back!" description="To login, enter your email address">
        <form onSubmit={onSubmit} className="w-full">
          <AuthField
            label="Email"
            name="email"
            type="email"
            icon={Mail}
            autoComplete="username"
            placeholder="Enter email"
            required
            className="mb-6"
          />

          <AuthField
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            icon={LockKeyhole}
            autoComplete="current-password"
            minLength={6}
            placeholder="Enter password"
            required
            className="mb-3"
            trailing={
              <button
                onClick={togglePasswordVisibility}
                type="button"
                className="text-[#42444c]"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            }
          />

          <Link
            to="/forgate-password"
            className="mb-7 block text-right text-lg font-semibold text-[#e05b43] transition hover:text-[#c84a33]"
          >
            Forgot password?
          </Link>

          <button
            className="h-14 w-full rounded-[14px] bg-[#4056f4] text-[1.9rem] font-medium text-white transition hover:bg-[#3148eb] disabled:cursor-not-allowed disabled:opacity-70"
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </AuthCard>
    </AuthShell>
  );
};

export default SignIn;
