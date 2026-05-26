import { useState, useRef, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import AuthCard from "../../../Components/Auth/AuthCard";
import AuthShell from "../../../Components/Auth/AuthShell";
import { resendAdminForgotOtp, verifyAdminForgotOtp } from "../../../services/authApi";

const ADMIN_RESET_EMAIL_KEY = "adminResetEmail";

const VerifyCode = () => {
  const [code, setCode] = useState(["", "", "", ""]);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const emailFromState = location.state?.email;
  const email = emailFromState || sessionStorage.getItem(ADMIN_RESET_EMAIL_KEY) || "";

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 4);
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
      toast.error("Missing reset email. Please start again.");
      navigate("/forgate-password", { replace: true });
      return;
    }

    try {
      const payload = await resendAdminForgotOtp({ email });
      toast.success(payload?.message || "Verification code resent.");
    } catch (error) {
      toast.error(error?.message || "Unable to resend verification code.");
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const verificationCode = code.join("");
    if (verificationCode.length < 4) {
      toast.error("Please enter the 4-digit code.");
      return;
    }

    if (!email) {
      toast.error("Missing reset email. Please start again.");
      navigate("/forgate-password", { replace: true });
      return;
    }

    try {
      await verifyAdminForgotOtp({ email, otp: verificationCode });
      navigate("/new-password", {
        state: {
          email,
          otpVerified: true,
        },
      });
    } catch (error) {
      toast.error(error?.message || "Verification failed.");
    }
  };

  return (
    <AuthShell compact>
      <AuthCard
        title="Verify Code"
        description={`We sent an OTP code to your email ${email || ""}. Enter the code below to verify.`}
      >
        <form onSubmit={handleVerify}>
          <div className="mb-8 flex flex-wrap justify-center gap-5">
            {[0, 1, 2, 3].map((index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                aria-label={`Verification digit ${index + 1}`}
                type="text"
                value={code[index]}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="h-[72px] w-[72px] rounded-[16px] border border-[#b8bcc7] bg-white text-center text-[2rem] font-bold text-[#404247] focus:border-[#ff4d4f] focus:ring-2 focus:ring-[#ffd6d6]"
                maxLength={1}
                inputMode="numeric"
                autoComplete="one-time-code"
              />
            ))}
          </div>

          <button
            type="submit"
            className="h-14 w-full rounded-[14px] bg-[#4056f4] text-xl font-semibold text-white transition hover:bg-[#3148eb]"
          >
            Next
          </button>

          <div className="mt-6 text-center text-lg text-[#222222]">
            Don&apos;t receive OTP?{" "}
            <button
              type="button"
              onClick={handleResend}
              className="font-medium text-[#e05b43] transition hover:text-[#c84a33]"
            >
              Resend again
            </button>
          </div>

          <button
            type="button"
            onClick={() => navigate("/sign-in")}
            className="mt-8 inline-flex w-full items-center justify-center gap-2 text-lg font-medium text-[#111111] transition hover:text-[#4056f4]"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Login
          </button>
        </form>
      </AuthCard>
    </AuthShell>
  );
};

export default VerifyCode;
