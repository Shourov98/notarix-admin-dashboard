const AuthShell = ({ children, compact = false }) => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f7f7fb] px-4 py-10 md:px-6 md:py-16">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-8%] top-[8%] h-64 w-64 rounded-full bg-[#d9e4ff] opacity-50 blur-3xl" />
        <div className="absolute bottom-[8%] right-[-6%] h-72 w-72 rounded-full bg-[#ece7ff] opacity-60 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#ffffff_0%,#f7f7fb_52%,#eef2fb_100%)]" />
      </div>

      <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center justify-center">
        <div
          className={`w-full overflow-hidden rounded-[22px] border border-[#d7dae4] bg-white/95 px-4 py-8 shadow-[0_20px_60px_rgba(37,69,88,0.10)] backdrop-blur md:px-10 md:py-10 ${
            compact ? "max-w-[660px]" : "max-w-[760px]"
          }`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthShell;
