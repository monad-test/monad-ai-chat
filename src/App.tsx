import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useSignMessage } from "wagmi";
import { useState } from "react";
import axios from "axios";

function App() {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");

  const sendMessage = async () => {
    if (!address) return;

    // Sign in with wallet
    const signature = await signMessageAsync({
      message: "Sign in to Monad Swap",
    });

    // Send to backend
    const res = await axios.post("http://localhost:3000/swap", {
      user: address,
      message,
      signature,
    });

    setResponse(`Reward: ${res.data.reward}, Tx: ${res.data.txHash}`);
  };

  return (
    <div className="p-4">
      <h1>Monad AI Swap</h1>
      <ConnectButton />

      {isConnected && (
        <div className="mt-4">
          <textarea
            placeholder="Type your health message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="border p-2 w-full"
          />
          <button
            onClick={sendMessage}
            className="bg-blue-500 text-white px-4 py-2 mt-2 rounded"
          >
            Send
          </button>
        </div>
      )}

      {response && <p className="mt-4">{response}</p>}
    </div>
  );
}

export default App;
