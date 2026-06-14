const BrandLogo = ({ compact = false }) => {
  return (
    <div className="flex items-center gap-3">
      <img
        src="/logo.svg"
        alt="Notarix logo"
        className="h-12 w-auto shrink-0"
      />
      {!compact ? (
        <img
          src="/text_2.svg"
          alt="Notarix signing services"
          className="h-8 w-auto"
        />
      ) : null}
    </div>
  );
};

export default BrandLogo;
