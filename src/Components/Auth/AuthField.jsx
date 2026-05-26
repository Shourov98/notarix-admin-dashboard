const AuthField = ({
  label,
  icon: Icon,
  trailing,
  className = "",
  inputClassName = "",
  ...props
}) => {
  return (
    <label className={`block ${className}`}>
      {label ? (
        <span className="mb-3 block text-[1.05rem] font-semibold text-[#202020]">{label}</span>
      ) : null}
      <div className="relative flex items-center">
        {Icon ? (
          <span className="pointer-events-none absolute left-4 text-[#42444c]">
            <Icon className="h-5 w-5" />
          </span>
        ) : null}
        <input
          {...props}
          className={`h-14 w-full rounded-[14px] border border-[#cfd3dc] bg-[#fcfcfe] text-lg text-[#191919] placeholder:text-[#868892] focus:border-[#3f57f2] focus:ring-2 focus:ring-[#dce3ff] ${Icon ? "pl-12" : "pl-4"} ${
            trailing ? "pr-14" : "pr-4"
          } ${inputClassName}`}
        />
        {trailing ? <div className="absolute right-4">{trailing}</div> : null}
      </div>
    </label>
  );
};

export default AuthField;
