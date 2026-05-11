const toneClasses = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  error: "border-red-200 bg-red-50 text-red-700",
};

const AuthNotice = ({ notice }) => {
  if (!notice?.message) return null;

  const type = notice.type === "success" ? "success" : "error";

  return (
    <div
      role={type === "success" ? "status" : "alert"}
      className={`mb-6 rounded-lg border px-4 py-3 text-sm font-semibold ${toneClasses[type]}`}
    >
      {notice.message}
    </div>
  );
};

export default AuthNotice;
