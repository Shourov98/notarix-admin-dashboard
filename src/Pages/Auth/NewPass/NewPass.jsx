import { Eye, EyeOff } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import AuthCard from "../../../Components/Auth/AuthCard";
import AuthField from "../../../Components/Auth/AuthField";
import AuthShell from "../../../Components/Auth/AuthShell";
import { resetAdminPassword } from "../../../services/authApi";

const ADMIN_RESET_EMAIL_KEY = "adminResetEmail";

const NewPass = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const email = location.state?.email || sessionStorage.getItem(ADMIN_RESET_EMAIL_KEY) || "";
  const otpVerified = Boolean(location.state?.otpVerified);

  useEffect(() => {
    if (!email) {
      navigate("/forgate-password", { replace: true });
    }
  }, [email, navigate]);

  useEffect(() => {
    const notice = location.state?.notice;
    if (!notice?.message) return;

    if (notice.type === "success") {
      toast.success(notice.message);
    } else {
      toast.error(notice.message);
    }
  }, [location.state]);

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
      toast.error("Passwords do not match.");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    if (!otpVerified) {
      toast.error("OTP verification is required before continuing.");
      navigate("/verify-code", { state: { email } });
      return;
    }

    setLoading(true);

    try {
      const payload = await resetAdminPassword({
        email,
        newPassword,
      });

      sessionStorage.removeItem(ADMIN_RESET_EMAIL_KEY);
      toast.success(payload?.message || "Password has been reset successfully.");
      navigate("/password-changed", {
        replace: true,
      });
    } catch (error) {
      toast.error(error?.message || "Unable to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell compact>
      <AuthCard title="Set new password" description="Set a new password and continue your journey">
        <form onSubmit={onSubmit} className="w-full">
          <AuthField
            label="Set Password"
            name="newPassword"
            type={showPassword ? "text" : "password"}
            required
            minLength={8}
            placeholder="Type a strong password"
            className="mb-7"
            trailing={
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="text-[#42444c]"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            }
          />

          <AuthField
            label="Confirm password"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            required
            minLength={8}
            placeholder="Re-type password"
            className="mb-6"
            trailing={
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="text-[#42444c]"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            }
          />

          <button
            className="h-14 w-full rounded-[14px] bg-[#4056f4] text-xl font-semibold text-white transition hover:bg-[#3148eb] disabled:cursor-not-allowed disabled:opacity-70"
            type="submit"
            disabled={loading}
          >
            {loading ? "Saving..." : "Continue"}
          </button>
        </form>
      </AuthCard>
    </AuthShell>
  );
};

export default NewPass;
