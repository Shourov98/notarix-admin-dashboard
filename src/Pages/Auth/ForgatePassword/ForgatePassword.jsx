import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthShell from "../../../Components/Auth/AuthShell";
import AuthNotice from "../../../Components/Auth/AuthNotice";
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
      setNotice({ type: "error", message: "Please enter your email address." });
      return;
    }

    setLoading(true);
    setNotice(null);

    try {
      const payload = await forgotAdminPassword({ email });
      sessionStorage.setItem(ADMIN_RESET_EMAIL_KEY, email);
      navigate("/verify-code", {
        state: {
          email,
          notice: {
            type: "success",
            message: payload?.message || "Verification code sent to your email.",
          },
        },
      });
    } catch (error) {
      setNotice({
        type: "error",
        message: error?.message || "Unable to send verification code.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell compact>
      <div className="text-white">
        <h1 className="mb-6 text-4xl font-bold tracking-tight">Forget Password</h1>
        <p className="mb-8 max-w-[640px] text-lg leading-8 text-white/85">
          Enter your email address to get a verification code for resetting your
          password.
        </p>

        <AuthNotice notice={notice} />

        <form onSubmit={onSubmit}>
          <label className="mb-14 block">
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              className="h-16 rounded-xl border-0 bg-white px-5 text-lg text-slate-900 shadow-none"
            />
          </label>

          <button
            type="submit"
            className="h-14 w-full rounded-lg bg-white text-xl font-semibold text-[var(--color-brand-primary)] hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Code"}
          </button>
        </form>
      </div>
    </AuthShell>
  );
};

export default ForgatePassword;
