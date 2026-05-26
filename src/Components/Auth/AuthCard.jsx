const AuthCard = ({ title, description, children, align = "center", showBrand = true }) => {
  const isCentered = align === "center";

  return (
    <div className="mx-auto w-full max-w-[630px]">
      {showBrand ? (
        <div className="mb-7 flex flex-col items-center justify-center text-center md:mb-9">
          <img src="/logo.svg" alt="Notarix logo" className="mb-3 h-[110px] w-auto md:h-[126px]" />
          <img src="/text_2.svg" alt="Notarix signing services" className="h-[34px] w-auto md:h-[40px]" />
        </div>
      ) : null}

      <div className={isCentered ? "text-center" : "text-left"}>
        <h1 className="text-[2rem] font-bold leading-tight tracking-[-0.03em] text-[#111111] md:text-[2.25rem]">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 text-base leading-7 text-[#6d6f78] md:text-[1.05rem]">{description}</p>
        ) : null}
      </div>

      <div className="mt-8 md:mt-9">{children}</div>
    </div>
  );
};

export default AuthCard;
