import React from 'react';

const PROJECT_NAME = '{{ PROJECT_NAME }}';

const HomePage: React.FC = () => {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-6">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-[-10rem] left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-red-700/20 blur-3xl" />

        <div className="absolute right-[-8rem] bottom-[-10rem] h-[24rem] w-[24rem] rounded-full bg-red-950/40 blur-3xl" />

        <div className="absolute top-1/2 left-[-10rem] h-[20rem] w-[20rem] -translate-y-1/2 rounded-full bg-white/5 blur-3xl" />
      </div>

      <section className="relative z-10 flex w-full max-w-4xl flex-col items-center text-center">
        <div className="animate-launchpad-float mb-10">
          <div className="relative">
            <div className="absolute inset-0 scale-125 rounded-full bg-[#BB2026]/20 blur-3xl" />

            <img
              src="https://static.gmkdynamics.com/general/gmk-logo-red.webp"
              alt="GMK Dynamics"
              className="relative w-56 sm:w-64 md:w-72"
            />
          </div>
        </div>

        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium tracking-[0.2em] text-white/60 uppercase backdrop-blur">
          Powered by GMK Launchpad
        </div>

        <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
          {PROJECT_NAME}
        </h1>

        <p className="mt-6 max-w-xl text-base leading-7 text-white/50 sm:text-lg">
          Your project is ready. Start building something great.
        </p>

        <div className="mt-10 h-px w-24 bg-gradient-to-r from-transparent via-[#BB2026] to-transparent" />

        <p className="mt-8 text-sm text-white/30">
          Built with React, Vite, TypeScript and GMK Launchpad.
        </p>
      </section>
    </main>
  );
};

export default HomePage;
