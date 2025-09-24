import React from "react";

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-tr from-[#0a0a0f] via-[#05050a] to-[#11111a] p-4">
      <div className="max-w-3xl w-full text-center p-10 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl">
        {/* Main SVG */}
        <img
          src="/file.svg"
          alt="Monad AI"
          className="mx-auto mb-6 w-32 h-32 animate-bounce"
        />

        {/* Title */}
        <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-500 to-indigo-600 text-transparent bg-clip-text mb-4 drop-shadow-lg">
          Welcome to Monad AI
        </h1>

        {/* Description */}
        <p className="text-gray-300 text-lg md:text-xl mb-8 leading-relaxed">
          Chat with AI, swap tokens seamlessly, and get live AI streaming responses.
          Start a new conversation or continue your previous sessions with ease.
        </p>

        {/* Call to Action Button */}
        <button
          className="relative inline-block px-10 py-4 font-semibold text-lg text-white rounded-xl bg-gradient-to-br from-indigo-600 to-blue-500 shadow-lg shadow-indigo-500/30 hover:from-indigo-700 hover:to-blue-600 hover:scale-105 active:scale-95 transition-transform duration-200"
          onClick={onGetStarted}
        >
          Get Started
          <span className="absolute inset-0 rounded-xl border border-white/10 pointer-events-none"></span>
        </button>
      </div>

      {/* Footer */}
      <footer className="mt-12 text-gray-400 text-sm md:text-base opacity-70">
        Powered by <strong>Monad AI</strong> • Seamless blockchain & AI integration
      </footer>
    </div>
  );
};

export default LandingPage;
