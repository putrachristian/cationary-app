import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Send, Sparkles } from "lucide-react";
import { Button } from "../components/ui/button";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import momochikoImg from "../assets/images/momochiko.jpeg";
import { generateChatResponse } from "../utils/geminiApi";

const WELCOME_MESSAGES = [
  "Halo! Saya Momochiko, asisten AI untuk Cationary 🐱",
  "Saya siap membantu Anda dengan segala pertanyaan tentang kucing - mulai dari ras, perawatan, kesehatan, hingga perilaku!",
  "Ada yang ingin Anda tanyakan tentang kucing hari ini?",
];

// Helper function to render markdown bold (**text**) as HTML bold
const renderMessageText = (text) => {
  // Split by newlines first to preserve line breaks
  const lines = text.split("\n");
  return lines.map((line, lineIndex) => {
    // Convert markdown bold (**text**) to HTML bold
    const parts = line.split(/(\*\*.*?\*\*)/g);
    const renderedParts = parts.map((part, partIndex) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        const boldText = part.slice(2, -2);
        return <strong key={`${lineIndex}-${partIndex}`}>{boldText}</strong>;
      } else if (part.startsWith("*") && part.endsWith("*")) {
        const italicText = part.slice(1, -1);
        return <i key={`${lineIndex}-${partIndex}`}>{italicText}</i>;
      }
      return <span key={`${lineIndex}-${partIndex}`}>{part}</span>;
    });
    
    // Add line break if not the last line
    return (
      <span key={lineIndex}>
        {renderedParts}
        {lineIndex < lines.length - 1 && <br />}
      </span>
    );
  });
};

export const ChatPage = ({ onNavigate }) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Initialize with welcome messages
  useEffect(() => {
    const initialMessages = WELCOME_MESSAGES.map((text, index) => ({
      id: `welcome-${index}`,
      text,
      sender: "ai",
      timestamp: new Date(Date.now() - (WELCOME_MESSAGES.length - index) * 1000),
    }));
    setMessages(initialMessages);
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessageText = inputText.trim();

    // Add user message
    const userMessage = {
      id: `user-${Date.now()}`,
      text: userMessageText,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    
    // Show typing indicator
    setIsTyping(true);

    try {
      // Get conversation history (last 10 messages for context)
      const conversationHistory = messages
        .slice(-10)
        .map((msg) => ({
          sender: msg.sender,
          text: msg.text,
        }));

      // Generate AI response using Gemini
      const aiResponseText = await generateChatResponse(
        userMessageText,
        conversationHistory
      );

      const aiMessage = {
        id: `ai-${Date.now()}`,
        text: aiResponseText,
        sender: "ai",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error getting AI response:", error);
      toast.error("Maaf, terjadi kesalahan saat memproses pesan. Silakan coba lagi.");
      
      // Fallback response
      const fallbackMessage = {
        id: `ai-${Date.now()}`,
        text: "Maaf, saya mengalami kesalahan. Silakan coba lagi atau cek halaman Breeds dan Tips untuk informasi lebih lanjut.",
        sender: "ai",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background pb-16">
      {/* Header */}
      <div className="bg-white border-b border-border px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        {/* <button
          onClick={() => onNavigate("home")}
          className="p-2 rounded-xl hover:bg-muted transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button> */}
        <div className="flex items-center gap-3 flex-1">
          {/* AI Avatar */}
          <div className="w-11 h-11 rounded-full overflow-hidden flex-shrink-0 shadow-soft ring-2 ring-primary/20">
            <img src={momochikoImg} alt="Momochiko" className="w-full h-full object-cover" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h1 className="text-foreground truncate">Momochiko</h1>
            <p className="text-xs text-muted-foreground">AI Assistant • Always Active</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`flex gap-2 max-w-[80%] ${message.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
                {/* Avatar for AI only */}
                {message.sender === "ai" && (
                  <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 shadow-soft ring-2 ring-primary/10">
                    <img src={momochikoImg} alt="Momochiko" className="w-full h-full object-cover" />
                  </div>
                )}

                {/* Message Bubble */}
                <div
                  className={`rounded-2xl px-4 py-3 ${
                    message.sender === "user"
                      ? "bg-primary text-white rounded-tr-sm"
                      : "bg-muted text-foreground rounded-tl-sm"
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                    {renderMessageText(message.text)}
                  </p>
                  <p className={`text-xs mt-1 ${
                    message.sender === "user" ? "text-white/70" : "text-muted-foreground"
                  }`}>
                    {message.timestamp.toLocaleTimeString("id-ID", { 
                      hour: "2-digit", 
                      minute: "2-digit" 
                    })}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="flex gap-2 max-w-[80%]">
              <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 shadow-soft ring-2 ring-primary/10">
                <img src={momochikoImg} alt="Momochiko" className="w-full h-full object-cover" />
              </div>
              <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex gap-1">
                  <motion.div
                    className="w-2 h-2 rounded-full bg-muted-foreground/40"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                  />
                  <motion.div
                    className="w-2 h-2 rounded-full bg-muted-foreground/40"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                  />
                  <motion.div
                    className="w-2 h-2 rounded-full bg-muted-foreground/40"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-border px-4 py-3">
        <div className="flex items-end gap-2">
          <div className="flex-1 bg-muted rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Tanya tentang kucing..."
              className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
            />
          </div>
          
          <Button
            onClick={handleSendMessage}
            disabled={!inputText.trim()}
            size="icon"
            className="h-12 w-12 rounded-2xl flex-shrink-0"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>

        {/* Quick Suggestions */}
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
          {[
            "Ras kucing apa yang cocok untuk pemula?",
            "Bagaimana cara merawat kucing Persia?",
            "Tips memilih makanan kucing",
          ].map((suggestion, index) => (
            <button
              key={index}
              onClick={() => setInputText(suggestion)}
              className="px-3 py-2 bg-muted hover:bg-muted/80 rounded-xl text-xs text-muted-foreground whitespace-nowrap transition-all"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

