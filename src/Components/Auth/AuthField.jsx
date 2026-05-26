const AuthField = ({
  label,
  icon: Icon,
  trailing,
  className = "",
  inputClassName = "",
  style,
  ...props
}) => {
  const basePaddingStyle = {
    paddingLeft: Icon ? "4rem" : "1rem",
    paddingRight: trailing ? "4rem" : "1rem",
    ...(style || {}),
  };

  return (
    <label className={`block ${className}`}>
      {label ? (
        <span className="mb-3 block text-[1.05rem] font-semibold text-[#202020]">{label}</span>
      ) : null}
      <div className="relative flex items-center">
        {Icon ? (
          <span className="pointer-events-none absolute inset-y-0 left-5 flex items-center text-[#42444c]">
            <Icon className="h-5 w-5" />
          </span>
        ) : null}
        <input
          {...props}
          style={basePaddingStyle}
          className={`h-14 w-full rounded-[14px] border border-[#cfd3dc] bg-[#fcfcfe] text-lg text-[#191919] placeholder:text-[#868892] focus:border-[#3f57f2] focus:ring-2 focus:ring-[#dce3ff] ${inputClassName}`}
        />
        {trailing ? (
          <div className="absolute inset-y-0 right-5 flex items-center">
            {trailing}
          </div>
        ) : null}
      </div>
    </label>
  );
};

export default AuthField;
