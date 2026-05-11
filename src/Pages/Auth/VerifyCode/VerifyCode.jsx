import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthShell from "../../../Components/Auth/AuthShell";
import AuthNotice from "../../../Components/Auth/AuthNotice";
import { resendAdminForgotOtp, verifyAdminForgotOtp } from "../../../services/authApi";

const ADMIN_RESET_EMAIL_KEY = "adminResetEmail";

const VerifyCode = () => {
  const [code, setCode] = useState(["", "", "", ""]);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [notice, setNotice] = useState(location.state?.notice || null);
  const emailFromState = location.state?.email;
  const email = emailFromState || sessionStorage.getItem(ADMIN_RESET_EMAIL_KEY) || "";

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 4);
    if (!email) {
      navigate("/forgate-password", { replace: true });
    }
  }, [email, navigate]);

  const handleChange = (index, value) => {
    if (value && !/^\d+$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.slice(0, 1);
    setCode(newCode);

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = async (e) => {
    e.preventDefault();

    if (!email) {
      setNotice({ type: "error", message: "Missing reset email. Please start again." });
      navigate("/forgate-password", { replace: true });
      return;
    }

    try {
      const payload = await resendAdminForgotOtp({ email });
      setNotice({
        type: "success",
        message: payload?.message || "Verification code resent.",
      });
    } catch (error) {
      setNotice({
        type: "error",
        message: error?.message || "Unable to resend verification code.",
      });
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const verificationCode = code.join("");
    if (verificationCode.length < 4) {
      setNotice({ type: "error", message: "Please enter the 4-digit code." });
      return;
    }

    if (!email) {
      setNotice({ type: "error", message: "Missing reset email. Please start again." });
      navigate("/forgate-password", { replace: true });
      return;
    }

    try {
      const payload = await verifyAdminForgotOtp({ email, otp: verificationCode });
      navigate("/new-password", {
        state: {
          email,
          otpVerified: true,
          notice: {
            type: "success",
            message: payload?.message || "Verification successful.",
          },
        },
      });
    } catch (error) {
      setNotice({
        type: "error",
        message: error?.message || "Verification failed.",
      });
    }
  };

  return (
    <AuthShell compact>
      <div className="text-white">
        <h1 className="mb-8 text-4xl font-bold tracking-tight">Verify OTP</h1>
        <p className="mb-10 max-w-[640px] text-lg leading-8 text-white/85">
          Please check your email. We have sent a code to {email || "your email address"}.
        </p>

        <AuthNotice notice={notice} />

        <form onSubmit={handleVerify}>
          <div className="mb-5 flex flex-wrap justify-center gap-5 md:justify-start">
            {[0, 1, 2, 3].map((index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                aria-label={`Verification digit ${index + 1}`}
                type="text"
                value={code[index]}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="h-20 w-20 rounded-xl border border-white/70 bg-white/10 text-center text-4xl font-semibold text-white focus:border-white focus:ring-2 focus:ring-white/60"
                maxLength={1}
                inputMode="numeric"
                autoComplete="one-time-code"
              />
            ))}
          </div>

          <div className="mb-16 flex flex-col gap-3 text-lg md:flex-row md:items-center md:justify-between">
            <p className="text-white/90">Didn’t receive code?</p>
            <button
              type="button"
              onClick={handleResend}
              className="w-fit bg-transparent p-0 text-lg font-medium text-white underline underline-offset-4"
            >
              Resend
            </button>
          </div>

          <button
            type="submit"
            className="h-14 w-full rounded-lg bg-white text-xl font-semibold text-[var(--color-brand-primary)] hover:bg-blue-50"
          >
            Verify OTP
          </button>
        </form>
      </div>
    </AuthShell>
  );
};

export default VerifyCode;
