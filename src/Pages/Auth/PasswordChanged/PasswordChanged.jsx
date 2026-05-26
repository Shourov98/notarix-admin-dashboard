import { Check } from "lucide-react";
import { Link } from "react-router-dom";
import AuthCard from "../../../Components/Auth/AuthCard";
import AuthShell from "../../../Components/Auth/AuthShell";

const PasswordChanged = () => {
  return (
    <AuthShell compact>
      <AuthCard
        title="Password Changed!"
        description="Return to the login page to enter your account with your new password"
        showBrand={false}
      >
        <div className="flex flex-col items-center">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#eef2ff] text-[#3f57f2]">
            <Check className="h-10 w-10 stroke-[3]" />
          </div>

          <Link
            to="/sign-in"
            className="inline-flex h-14 w-full items-center justify-center rounded-[14px] bg-[#4056f4] px-5 text-lg font-semibold text-white transition hover:bg-[#3148eb]"
          >
            Back To Login
          </Link>
        </div>
      </AuthCard>
    </AuthShell>
  );
};

export default PasswordChanged;
