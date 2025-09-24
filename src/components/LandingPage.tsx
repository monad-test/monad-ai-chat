import React from "react";

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black-cyan-gradient">
      <div className="max-w-2xl text-center p-8 rounded-3xl bg-black/80 border border-cyan-700 shadow-2xl">
        <img src="/vite.svg" alt="Monad AI" className="mx-auto mb-6 w-20 h-20" />
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-cyan-400 to-cyan-700 text-transparent bg-clip-text mb-4 drop-shadow-lg">
          Welcome to Monad AI Chat
        </h1>
        <p className="text-cyan-200 text-lg mb-8">
          Chat with Monad AI, swap tokens, and experience seamless streaming AI responses. Start a new chat or continue your conversations anytime.
        </p>
        <button
          className="bg-gradient-to-br from-cyan-600 to-cyan-400 hover:from-cyan-700 hover:to-cyan-500 text-white px-8 py-3 rounded-xl text-lg font-bold shadow-cyan-400/30 transition-all duration-200"
          onClick={onGetStarted}
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
