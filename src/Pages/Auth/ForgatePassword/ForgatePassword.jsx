import { useState } from "react";
import { ArrowLeft, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import AuthCard from "../../../Components/Auth/AuthCard";
import AuthField from "../../../Components/Auth/AuthField";
import AuthShell from "../../../Components/Auth/AuthShell";
import { forgotAdminPassword } from "../../../services/authApi";

const ADMIN_RESET_EMAIL_KEY = "adminResetEmail";

const ForgatePassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState(null);

  const onSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "").trim().toLowerCase();

    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }

    setLoading(true);
    setNotice(null);

    try {
      const payload = await forgotAdminPassword({ email });
      sessionStorage.setItem(ADMIN_RESET_EMAIL_KEY, email);
      toast.success(payload?.message || "Verification code sent to your email.");
      navigate("/verify-code", {
        state: {
          email,
        },
      });
    } catch (error) {
      setNotice(error?.message || "Unable to send verification code.");
      toast.error(error?.message || "Unable to send verification code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell compact>
      <AuthCard title="Forgot Password" description="Enter your email to reset password">
        <form onSubmit={onSubmit}>
          <AuthField
            label="Email"
            name="email"
            type="email"
            icon={Mail}
            autoComplete="email"
            placeholder="Enter email"
            required
            className="mb-6"
          />

          {notice ? <p className="mb-6 text-sm text-[#c84a33]">{notice}</p> : null}

          <button
            type="submit"
            className="h-14 w-full rounded-[14px] bg-[#4056f4] text-xl font-semibold text-white transition hover:bg-[#3148eb] disabled:cursor-not-allowed disabled:opacity-70"
            disabled={loading}
          >
            {loading ? "Sending..." : "Next"}
          </button>

          <Link
            to="/sign-in"
            className="mt-8 inline-flex w-full items-center justify-center gap-2 text-lg font-medium text-[#111111] transition hover:text-[#4056f4]"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Login
          </Link>
        </form>
      </AuthCard>
    </AuthShell>
  );
};

export default ForgatePassword;
