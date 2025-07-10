import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X, Bot } from "lucide-react";

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [showLauncher, setShowLauncher] = useState(true);
  const [messages, setMessages] = useState([
    { type: "bot", text: "Hi there! How can I assist you today?" },
  ]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMessage = { type: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("https://echo5-chatbot-server-tj2u.onrender.com/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { type: "bot", text: data.reply || "No response from server." },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { type: "bot", text: "Error connecting to server." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence
        onExitComplete={() => {
          if (!isOpen) setShowLauncher(true);
        }}
      >
        {isOpen && (
          <motion.div
            key="chatbox"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="w-80 bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col h-96"
          >
            <div className="bg-gradient-to-r from-yellow-500 to-orange-400 text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5" />
                <h2 className="text-sm font-semibold">Echo5Digital Bot</h2>
              </div>
              <button
                onClick={() => {
                  setShowLauncher(false);
                  setIsOpen(false);
                }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 px-4 py-2 overflow-y-auto text-sm">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`my-1 flex ${
                    msg.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`px-3 py-2 rounded-xl max-w-[70%] ${
                      msg.type === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            <div className="px-3 py-2 border-t flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 border rounded-full px-4 py-1 text-sm focus:outline-none"
                placeholder={loading ? "Waiting for response..." : "Type your message..."}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                disabled={loading}
              />
              <button onClick={handleSend} className="text-blue-500" disabled={loading}>
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showLauncher && !isOpen && (
          <motion.button
            key="launcher"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsOpen(true)}
            className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-500 to-orange-400 shadow-lg flex items-center justify-center text-white"
          >
            <Bot className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
