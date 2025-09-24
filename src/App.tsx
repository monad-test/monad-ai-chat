import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useSignMessage } from "wagmi";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FiSend, FiLoader } from "react-icons/fi"; // Icons for send, loading

function App() {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<{ role: "user" | "ai"; text: string }[]>([]);
  // removed swapDone state, now using react-hot-toast
  const [isLoading, setIsLoading] = useState(false); // New state for loading indicator
  const chatEndRef = useRef<HTMLDivElement>(null); // Ref to scroll to the bottom of the chat

  // Scroll to the latest message whenever chat updates
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const sendMessage = async () => {
    if (!address || !message.trim() || isLoading) return;

    const userMessage = message;
    setMessage("");
    setIsLoading(true);
    setChat((prev) => [...prev, { role: "user", text: userMessage }]);

    try {
      const signature = await signMessageAsync({
        message: "Sign in to Monad Swap",
      });
      const res = await axios.post("http://localhost:3000/swap", {
        user: address,
        message: userMessage,
        signature,
      });
      const aiText = `Reward: ${res.data.reward}\nTx Hash: ${res.data.txHash}`;
      setChat((prev) => [...prev, { role: "ai", text: aiText }]);
      if (res.data.txHash) {
        toast.success("🎉 Swap successful! Congratulations!", {
          style: {
            background: 'linear-gradient(135deg, #000 0%, #06b6d4 100%)',
            color: '#fff',
            border: '1px solid #06b6d4',
          },
          iconTheme: {
            primary: '#06b6d4',
            secondary: '#000',
          },
        });
      }
    } catch (error) {
      console.error("Error sending message or signing:", error);
      setChat((prev) => [
        ...prev,
        {
          role: "ai",
          text: "Oops! Something went wrong. Please try again.",
        },
      ]);
      toast.error("Something went wrong. Please try again.", {
        style: {
          background: 'linear-gradient(135deg, #000 0%, #06b6d4 100%)',
          color: '#fff',
          border: '1px solid #06b6d4',
        },
        iconTheme: {
          primary: '#06b6d4',
          secondary: '#000',
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent new line
      sendMessage();
    }
  };

  const chatVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const messageVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
  };

  return (
    <div className="min-h-screen bg-black bg-black-cyan-gradient flex flex-col items-center justify-between p-4 md:p-8 font-sans">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full flex justify-between items-center max-w-4xl mb-8"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-cyan-400 to-cyan-700 text-transparent bg-clip-text drop-shadow-lg tracking-tight">
          Monad AI Swap
        </h1>
        <ConnectButton />
      </motion.header>

      {/* Main Chat Area */}
      <AnimatePresence mode="wait">
        {isConnected ? (
          <motion.div
            key="chat-interface"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={chatVariants}
            className="flex-grow w-full max-w-4xl bg-black/80 shadow-2xl rounded-3xl flex flex-col overflow-hidden transition-all duration-500 ease-in-out border border-cyan-700 backdrop-blur-lg"
          >
            {/* Chat Messages */}
            <div className="flex-grow p-4 md:p-6 overflow-y-auto space-y-4 custom-scrollbar">
              {chat.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-col items-center justify-center h-full text-cyan-300 text-lg"
                >
                  <p>Start chatting with Monad AI!</p>
                  <p>Ask it to swap tokens for you.</p>
                </motion.div>
              )}
              {chat.map((c, i) => (
                <motion.div
                  key={i}
                  initial="hidden"
                  animate="visible"
                  variants={messageVariants}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className={`flex ${
                    c.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`p-3 md:p-4 rounded-xl shadow-md max-w-[80%] whitespace-pre-wrap ${
                      c.role === "user"
                        ? "bg-gradient-to-br from-black via-cyan-900 to-cyan-700 text-cyan-100 rounded-br-none border border-cyan-700 shadow-cyan-700/30"
                        : "bg-gradient-to-br from-cyan-100 via-cyan-200 to-cyan-300 text-black rounded-bl-none border border-cyan-400 shadow-cyan-400/20"
                    }`}
                  >
                    {c.text}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={messageVariants}
                  className="flex justify-start"
                >
                  <div className="p-3 md:p-4 rounded-xl shadow-md bg-cyan-100 text-cyan-900 rounded-bl-none flex items-center space-x-2">
                    <FiLoader className="animate-spin" />
                    <span>AI is thinking...</span>
                  </div>
                </motion.div>
              )}
              <div ref={chatEndRef} /> {/* Scroll target */}
            </div>

            {/* Input Area */}
            <div className="border-t border-cyan-700 p-4 bg-black/80">
              <div className="flex items-center space-x-3">
                <textarea
                  placeholder={
                    isConnected ? "Type your message..." : "Connect wallet to chat"
                  }
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-grow border border-cyan-700 bg-black/60 text-cyan-100 rounded-xl p-3 resize-none focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-200 text-base custom-scrollbar placeholder:text-cyan-400"
                  rows={1}
                  style={{ maxHeight: "100px", minHeight: "48px" }} // Limit textarea height
                  disabled={!isConnected || isLoading}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={sendMessage}
                  className={`bg-gradient-to-br from-cyan-600 to-cyan-400 hover:from-cyan-700 hover:to-cyan-500 text-white p-3 rounded-xl flex items-center justify-center transition-colors duration-200 shadow-cyan-400/30 ${
                    !isConnected || !message.trim() || isLoading
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  disabled={!isConnected || !message.trim() || isLoading}
                >
                  {isLoading ? (
                    <FiLoader className="animate-spin text-xl" />
                  ) : (
                    <FiSend className="text-xl" />
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="connect-prompt"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className="flex-grow flex items-center justify-center text-center text-cyan-200 text-xl md:text-2xl"
          >
            <p>
              Connect your wallet to start chatting with Monad AI and make
              swaps!
            </p>
          </motion.div>
        )}
      </AnimatePresence>

  {/* Swap confirmation handled by react-hot-toast */}

      {/* Footer (optional, for branding or links) */}
      <motion.footer
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full text-center mt-8 text-cyan-300 text-sm drop-shadow"
      >
        Powered by Monad AI
      </motion.footer>

      {/* Custom Scrollbar Styles (can be moved to a CSS file) */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db; /* gray-300 */
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a1a1aa; /* gray-400 */
        }
        /* For Firefox */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #d1d5db #f1f1f1;
        }
      `}</style>
    </div>
  );
}

export default App;