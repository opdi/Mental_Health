import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  MessageCircle,
  Calendar,
  Users,
  BookOpen,
  Shield,
  Menu,
  X,
  Mic,
  Send,
  Smile,
  TrendingUp,
  Activity,
  Clock,
  AlertTriangle,
} from "lucide-react";

const colorClasses = {
  blue: {
    from: "from-blue-50",
    to: "to-blue-100",
    border: "border-blue-200",
    text: "text-blue-600",
    bg: "bg-blue-500",
  },
  green: {
    from: "from-green-50",
    to: "to-green-100",
    border: "border-green-200",
    text: "text-green-600",
    bg: "bg-green-500",
  },
  purple: {
    from: "from-purple-50",
    to: "to-purple-100",
    border: "border-purple-200",
    text: "text-purple-600",
    bg: "bg-purple-500",
  },
};

const StatCard = ({ icon: Icon, title, value, subtitle, color = "blue" }) => {
  const c = colorClasses[color];
  return (
    <div
      className={`bg-gradient-to-br ${c.from} ${c.to} p-6 rounded-2xl border ${c.border}`}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2 ${c.bg} text-white rounded-lg`}>
          <Icon size={20} />
        </div>
        <h3 className="font-semibold text-gray-800">{title}</h3>
      </div>
      <div className={`text-2xl font-bold ${c.text} mb-1`}>{value}</div>
      <div className="text-sm text-gray-600">{subtitle}</div>
    </div>
  );
};

const ChatMessage = ({ message, isUser }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className={`flex ${isUser ? "justify-end" : "justify-start"}`}
  >
    <div
      className={`max-w-[70%] p-4 rounded-2xl shadow-sm text-sm leading-relaxed whitespace-pre-line 
        ${isUser ? "bg-blue-500 text-white rounded-br-none" : "bg-white border border-gray-200 text-gray-800 rounded-bl-none"}
      `}
    >
      {message}
    </div>
  </motion.div>
);

const TypingIndicator = () => (
  <div className="flex gap-1 p-3">
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></div>
  </div>
);

const Navigation = ({ active, setActive }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuItems = [
    { icon: Home, label: "Dashboard" },
    { icon: MessageCircle, label: "Chat" },
    { icon: Calendar, label: "Sessions" },
    { icon: Users, label: "Community" },
    { icon: BookOpen, label: "Resources" },
    { icon: Shield, label: "Emergency" },
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
        aria-label="Open menu"
      >
        <Menu size={24} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
          >
            <div
              className="bg-white w-72 h-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4"
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-blue-100 rounded-full"></div>
                <div>
                  <h2 className="font-semibold">Mira AI</h2>
                  <p className="text-sm text-gray-500">Your companion</p>
                </div>
              </div>
              <nav className="space-y-2">
                {menuItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      setActive(item.label);
                      setIsOpen(false);
                    }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full text-left transition-colors 
                      ${active === item.label ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"}`}
                  >
                    <item.icon size={20} />
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="hidden lg:flex flex-col w-72 h-screen bg-white border-r border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-12 h-12 bg-blue-100 rounded-full"></div>
          <div>
            <h2 className="font-semibold">Mira AI</h2>
            <p className="text-sm text-gray-500">Your companion</p>
          </div>
        </div>
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => setActive(item.label)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full text-left transition-colors 
                ${active === item.label ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"}`}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </>
  );
};

const App = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [chatMessages, setChatMessages] = useState([
    "Hello, how are you feeling today?",
  ]);
  const [userMessages, setUserMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [moodScore] = useState(72);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, userMessages, isTyping]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const newUserMessages = [...userMessages, input];
    setUserMessages(newUserMessages);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      setChatMessages([
        ...chatMessages,
        `I understand you're feeling ${input.toLowerCase()}. Can you tell me more about that?`,
      ]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Navigation active={activeTab} setActive={setActiveTab} />

      <main className="flex-1 p-6 lg:p-10 overflow-auto">
        {activeTab === "Dashboard" && (
          <div className="space-y-8">
            <h1 className="text-2xl font-bold text-gray-800">Welcome back</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard
                icon={Smile}
                title="Mood Score"
                value={`${moodScore}%`}
                subtitle="Based on recent check-ins"
                color="blue"
              />
              <StatCard
                icon={Activity}
                title="Weekly Check-ins"
                value="5"
                subtitle="2 more than last week"
                color="green"
              />
              <StatCard
                icon={Clock}
                title="Upcoming Session"
                value="Tomorrow"
                subtitle="with Dr. Smith"
                color="purple"
              />
            </div>
          </div>
        )}

        {activeTab === "Chat" && (
          <div className="flex flex-col h-[calc(100vh-4rem)] max-w-3xl mx-auto">
            <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-gray-100 rounded-2xl">
              {chatMessages.map((msg, idx) => (
                <ChatMessage key={`ai-${idx}`} message={msg} isUser={false} />
              ))}
              {userMessages.map((msg, idx) => (
                <ChatMessage key={`user-${idx}`} message={msg} isUser />
              ))}
              {isTyping && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>
            <div className="mt-4 flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                className="flex-1 p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type a message..."
              />
              <button
                onClick={sendMessage}
                className="p-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
                aria-label="Send message"
              >
                <Send size={20} />
              </button>
              <button
                className="p-3 bg-gray-200 rounded-xl hover:bg-gray-300"
                aria-label="Record voice message"
              >
                <Mic size={20} />
              </button>
            </div>
          </div>
        )}

        {activeTab === "Sessions" && (
          <div>
            <h2 className="text-xl font-bold mb-4">Your Sessions</h2>
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <p className="text-gray-600">No sessions scheduled yet.</p>
            </div>
          </div>
        )}

        {activeTab === "Community" && (
          <div>
            <h2 className="text-xl font-bold mb-4">Community Board</h2>
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-2xl border">
                <p className="text-gray-700">
                  "You're not alone in this. Remember to take things one step at a
                  time."
                </p>
              </div>
              <div className="bg-white p-4 rounded-2xl border">
                <p className="text-gray-700">
                  "Meditation has really helped me cope with anxiety. Highly
                  recommend!"
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "Resources" && (
          <div>
            <h2 className="text-xl font-bold mb-4">Wellness Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl border">
                <h3 className="font-semibold mb-2">Mindfulness Exercises</h3>
                <p className="text-gray-600 text-sm">
                  Guided practices to help you stay present and reduce stress.
                </p>
              </div>
              <div className="bg-white p-6 rounded-2xl border">
                <h3 className="font-semibold mb-2">Coping Strategies</h3>
                <p className="text-gray-600 text-sm">
                  Practical techniques for managing anxiety and negative thoughts.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "Emergency" && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-red-50 border border-red-200 p-6 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="text-red-500" />
                <h2 className="text-xl font-bold text-red-700">
                  Emergency Support
                </h2>
              </div>
              <p className="text-gray-700 mb-4">
                If you are in immediate danger or thinking of harming yourself,
                please call your local emergency number right away.
              </p>
              <div className="space-y-2">
                <a
                  href="tel:988"
                  className="block p-3 bg-red-500 text-white rounded-xl text-center hover:bg-red-600"
                >
                  Call Suicide Prevention Lifeline (988)
                </a>
                <a
                  href="tel:911"
                  className="block p-3 bg-gray-800 text-white rounded-xl text-center hover:bg-gray-900"
                >
                  Call Emergency Services (911)
                </a>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
