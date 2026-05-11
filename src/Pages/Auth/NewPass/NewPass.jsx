import { Eye, EyeOff } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import AuthShell from "../../../Components/Auth/AuthShell";
import AuthNotice from "../../../Components/Auth/AuthNotice";
import { resetAdminPassword } from "../../../services/authApi";

const ADMIN_RESET_EMAIL_KEY = "adminResetEmail";

const NewPass = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState(location.state?.notice || null);
  const email = location.state?.email || sessionStorage.getItem(ADMIN_RESET_EMAIL_KEY) || "";
  const otpVerified = Boolean(location.state?.otpVerified);

  useEffect(() => {
    if (!email) {
      navigate("/forgate-password", { replace: true });
    }
  }, [email, navigate]);

  const togglePasswordVisibility = () => {
    setShowPassword((current) => !current);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((current) => !current);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newPassword = String(formData.get("newPassword") || "");
    const confirmPassword = String(formData.get("confirmPassword") || "");

    if (newPassword !== confirmPassword) {
      setNotice({ type: "error", message: "Passwords do not match." });
      return;
    }

    if (newPassword.length < 8) {
      setNotice({ type: "error", message: "Password must be at least 8 characters." });
      return;
    }

    if (!otpVerified) {
      setNotice({ type: "error", message: "OTP verification is required before continuing." });
      navigate("/verify-code", { state: { email } });
      return;
    }

    setLoading(true);
    setNotice(null);

    try {
      const payload = await resetAdminPassword({
        email,
        newPassword,
      });

      sessionStorage.removeItem(ADMIN_RESET_EMAIL_KEY);
      navigate("/sign-in", {
        replace: true,
        state: {
          notice: {
            type: "success",
            message: payload?.message || "Password has been reset successfully.",
          },
        },
      });
    } catch (error) {
      setNotice({
        type: "error",
        message: error?.message || "Unable to reset password. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell compact>
      <form onSubmit={onSubmit} className="w-full">
        <div className="mb-8">
          <h2 className="mb-3 text-4xl font-bold tracking-tight text-white">
            Create New Password
          </h2>
          <p className="text-lg text-white/85">
            Set a new password for {email || "your account"}.
          </p>
        </div>

        <AuthNotice notice={notice} />

        <label className="mb-7 block">
          <span className="mb-2 block text-[18px] font-semibold text-white">New Password</span>
          <div className="relative flex items-center">
            <input
              name="newPassword"
              type={showPassword ? "text" : "password"}
              required
              minLength={8}
              className="h-16 rounded-xl border-0 bg-white px-5 pr-14 text-lg text-slate-900 shadow-none"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-4 text-lg text-slate-500"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </label>

        <label className="mb-10 block">
          <span className="mb-2 block text-[18px] font-semibold text-white">Confirm Password</span>
          <div className="relative flex items-center">
            <input
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              required
              minLength={8}
              className="h-16 rounded-xl border-0 bg-white px-5 pr-14 text-lg text-slate-900 shadow-none"
            />
            <button
              type="button"
              onClick={toggleConfirmPasswordVisibility}
              className="absolute right-4 text-lg text-slate-500"
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </label>

        <button
          className="h-14 w-full rounded-lg bg-white text-xl font-semibold text-[var(--color-brand-primary)] hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-70"
          type="submit"
          disabled={loading}
        >
          {loading ? "Resetting..." : "Update Password"}
        </button>
      </form>
    </AuthShell>
  );
};

export default NewPass;
