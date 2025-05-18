"use client";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { RiSendPlaneFill } from "react-icons/ri";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { nightOwl } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { HiOutlineClipboardCopy, HiCheck } from "react-icons/hi";
import { FaGift, FaTag, FaCalendarAlt, FaStream, FaDollarSign, FaMapMarkerAlt } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const GiftIdea = () => {
  const [input, setInput] = useState("");
  const [occasion, setOccasion] = useState("");
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState("");
  const [giftHistory, setGiftHistory] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedMessage, setStreamedMessage] = useState("");
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const [copiedCode, setCopiedCode] = useState({
    messageIndex: null,
    codeIndex: null,
  });

  const occasionOptions = [
    "Birthday", 
    "Anniversary", 
    "Wedding", 
    "Graduation", 
    "Housewarming", 
    "Baby Shower", 
    "Christmas", 
    "Valentine's Day",
    "Mother's Day",
    "Father's Day",
    "Other"
  ];

  const { mutate, isLoading } = useMutation({
    mutationFn: async (request) => {
      setIsStreaming(true);
      setStreamedMessage("");

      try {
        const response = await fetch("/api/coding/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            message: request.message, 
            chatHistory: request.chatHistory,
            stream: true
          }),
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let done = false;
        let accumulatedMessage = "";

        while (!done) {
          const { value, done: doneReading } = await reader.read();
          done = doneReading;
          if (done) break;
          
          const chunk = decoder.decode(value, { stream: true });
          accumulatedMessage += chunk;
          setStreamedMessage(accumulatedMessage);
        }

        return { message: accumulatedMessage };
      } catch (error) {
        console.error("Streaming error:", error);
        throw error;
      } finally {
        setIsStreaming(false);
      }
    },
    onSuccess: (response, request) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: request.message, type: "user" },
        { text: response.message, type: "bot" }
      ]);
      setGiftHistory((prevHistory) => [
        ...prevHistory,
        { role: "user", content: request.message },
        { role: "assistant", content: response.message },
      ]);
      setInput("");
      setStreamedMessage("");
    },
    onError: () => {
      toast.error("Failed to generate gift ideas.");
      setIsStreaming(false);
      setStreamedMessage("");
    },
  });

  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!occasion) {
      toast.error("Please select an occasion");
      return;
    }

    const message = `Generate gift ideas for ${occasion} occasion with the following preferences: ${input || "no specific preferences"}${tags.length > 0 ? `. Tags: ${tags.join(", ")}` : ""}`;
    
    mutate({
      message,
      chatHistory: giftHistory
    });
  };

  // Automatically scroll to the bottom when messages update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, streamedMessage]);

  const copyToClipboard = (code, messageIndex, codeIndex) => {
    navigator.clipboard.writeText(code);
    setCopiedCode({ messageIndex, codeIndex });

    setTimeout(() => {
      setCopiedCode({ messageIndex: null, codeIndex: null });
    }, 1500);
  };

  // Function to render structured gift ideas
  const renderStructuredGiftIdea = (text) => {
    // Match gift idea patterns
    const giftRegex = /(\d+)\.\s+(.*?)(?=\n\d+\.|$)/gs;
    const matches = [...text.matchAll(giftRegex)];
    
    if (matches.length === 0) {
      return renderMessage(text);
    }
    
    return (
      <div className="space-y-4">
        {matches.map((match, idx) => {
          const fullMatch = match[0];
          const number = match[1];
          const content = match[2].trim();
          
          // Try to identify parts of each gift idea
          const titleMatch = content.match(/^(.*?)(?:\n|:)/);
          const title = titleMatch ? titleMatch[1].trim() : content.split('\n')[0];
          
          const priceMatch = content.match(/\*\*(.*?)\*\*/);
          const price = priceMatch ? priceMatch[1] : content.match(/\$\d+(?:-\$\d+)?/) ? content.match(/\$\d+(?:-\$\d+)?/)[0] : null;
          
          return (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border-l-4 border-pink-500"
            >
              <div className="flex items-center gap-2 font-bold text-lg text-pink-600 dark:text-pink-400 mb-2">
                <span className="bg-pink-100 dark:bg-pink-900 text-pink-600 dark:text-pink-300 rounded-full w-6 h-6 flex items-center justify-center text-sm">
                  {number}
                </span>
                <h3>{title}</h3>
              </div>
              
              <div className="mt-1 space-y-2 text-gray-700 dark:text-gray-300">
                {content.split('\n').map((line, lineIdx) => {
                  if (lineIdx === 0) return null; // Skip title line
                  
                  // Check if line contains price information
                  if (line.includes('$') || line.toLowerCase().includes('price')) {
                    return (
                      <div key={lineIdx} className="flex items-center gap-2">
                        <FaDollarSign className="text-green-500 flex-shrink-0" />
                        <span className="font-medium">
                          {line.replace(/\*\*/g, '')}
                        </span>
                      </div>
                    );
                  }
                  
                  // Check if line contains where to buy information
                  else if (line.toLowerCase().includes('find') || line.toLowerCase().includes('available') || line.toLowerCase().includes('store') || line.toLowerCase().includes('website')) {
                    return (
                      <div key={lineIdx} className="flex items-center gap-2">
                        <FaMapMarkerAlt className="text-blue-500 flex-shrink-0" />
                        <span>{line}</span>
                      </div>
                    );
                  }
                  
                  // Regular description
                  else if (line.trim()) {
                    return <p key={lineIdx}>{line}</p>;
                  }
                  
                  return null;
                })}
              </div>
            </motion.div>
          );
        })}
        
        {/* Render any content after the gift ideas */}
        {text.split(/\d+\.\s+.*?(?=\n\d+\.|$)/gs).pop().trim() && (
          <p className="mt-4 text-gray-700 dark:text-gray-300 italic">
            {text.split(/\d+\.\s+.*?(?=\n\d+\.|$)/gs).pop().trim()}
          </p>
        )}
      </div>
    );
  };

  const renderMessage = (msgText, messageIndex) => {
    const codeBlockRegex = /```([\s\S]*?)```/g;
    let parts = msgText.split(codeBlockRegex);

    return parts.map((part, codeIndex) => {
      if (codeIndex % 2 === 1) {
        const lines = part.trim().split("\n");
        const language = lines[0].trim();
        const code = lines.slice(1).join("\n");

        return (
          <div key={codeIndex} className="relative code-block mb-4">
            <div className="absolute top-0 left-0 right-0 bg-gray-800 px-4 py-2 rounded-t-lg flex justify-between items-center">
              <span className="text-gray-300 text-sm">{language}</span>
              <button
                className={`p-1.5 rounded-md transition ${
                  copiedCode.messageIndex === messageIndex &&
                  copiedCode.codeIndex === codeIndex
                    ? "bg-green-500 hover:bg-green-400"
                    : "bg-gray-700 hover:bg-gray-600"
                } text-white`}
                onClick={() => copyToClipboard(code, messageIndex, codeIndex)}
              >
                {copiedCode.messageIndex === messageIndex &&
                copiedCode.codeIndex === codeIndex ? (
                  <HiCheck className="text-lg" />
                ) : (
                  <HiOutlineClipboardCopy className="text-lg" />
                )}
              </button>
            </div>
            <div className="pt-10">
              <SyntaxHighlighter
                language={language.toLowerCase()}
                style={nightOwl}
                customStyle={{ borderRadius: "0.5rem", padding: "1rem" }}
                wrapLongLines={true}
              >
                {code}
              </SyntaxHighlighter>
            </div>
          </div>
        );
      } else {
        // Handle bold text
        const boldRegex = /\*\*(.*?)\*\*/g;
        const textWithFormattedBold = part.replace(boldRegex, (match, content) => {
          return `<span class="font-bold">${content}</span>`;
        });
        
        return (
          <div 
            key={codeIndex} 
            className="text-md"
            dangerouslySetInnerHTML={{ __html: textWithFormattedBold }}
          />
        );
      }
    });
  };

  return (
    <div className="min-h-[calc(100vh-6rem)] grid grid-rows-[auto,1fr,auto] p-4 max-w-5xl mx-auto">
      <header className="mb-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl font-bold mb-2 flex items-center justify-center bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600">
            <div className="mr-3">
              <FaGift className="text-pink-500" />
            </div>
            GIVORA
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Personalized gift recommendations that delight and inspire
          </p>
        </motion.div>
      </header>
      
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-hidden flex flex-col relative mb-4 bg-gray-50 dark:bg-gray-900 rounded-2xl shadow-lg"
      >
        <div className="flex-1 overflow-y-auto px-4 py-6 custom-scrollbar">
          {messages.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center h-full text-gray-400 space-y-6"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-pink-400 rounded-full opacity-20 animate-ping"></div>
                <FaGift className="text-6xl text-pink-500 relative z-10" />
              </div>
              <div className="text-center max-w-md space-y-4">
                <h3 className="text-xl font-medium text-gray-600 dark:text-gray-300">Welcome to GIVORA!</h3>
                <p className="text-gray-500 dark:text-gray-400">Select an occasion and add optional tags to discover the perfect gift ideas for your special someone.</p>
              </div>
              <div className="grid grid-cols-3 gap-4 max-w-md">
                {['Birthday', 'Wedding', 'Christmas'].map(quickOccasion => (
                  <button 
                    key={quickOccasion}
                    onClick={() => setOccasion(quickOccasion)}
                    className="px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-all border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-pink-50 dark:hover:bg-gray-700"
                  >
                    {quickOccasion}
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <div className="flex flex-col gap-6">
              <AnimatePresence>
                {messages.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`max-w-[80%] p-4 rounded-2xl w-fit shadow-md ${
                      msg.type === "user"
                        ? "self-end bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-tr-none"
                        : "self-start bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-none"
                    }`}
                  >
                    {msg.type === "bot" ? renderStructuredGiftIdea(msg.text) : renderMessage(msg.text, index)}
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {/* Streaming message indicator */}
              {isStreaming && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-[80%] p-4 rounded-2xl w-fit shadow-md self-start bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-none"
                >
                  {streamedMessage ? (
                    renderStructuredGiftIdea(streamedMessage)
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                        <FaStream className="mr-2 text-purple-500" /> Generating ideas...
                      </span>
                    </div>
                  )}
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>
      
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        onSubmit={handleSubmit}
        className="w-full mx-auto py-5 px-6 rounded-xl bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-700"
      >
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <div className="flex items-center mb-2">
              <FaCalendarAlt className="mr-2 text-purple-500" />
              <label className="font-medium text-gray-700 dark:text-gray-300">Occasion</label>
            </div>
            <select
              value={occasion}
              onChange={(e) => setOccasion(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              required
            >
              <option value="">Select an occasion</option>
              {occasionOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
          
          <div>
            <div className="flex items-center mb-2">
              <FaTag className="mr-2 text-purple-500" />
              <label className="font-medium text-gray-700 dark:text-gray-300">Tags (optional)</label>
            </div>
            <div className="flex">
              <input
                type="text"
                placeholder="e.g., tech, outdoors, eco-friendly"
                className="flex-grow p-3 border border-gray-300 dark:border-gray-600 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="bg-purple-500 text-white px-4 rounded-r-lg hover:bg-purple-600 transition-colors"
              >
                Add
              </button>
            </div>
          </div>
        </div>
        
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            <AnimatePresence>
              {tags.map((tag) => (
                <motion.span 
                  key={tag}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-3 py-1 rounded-full flex items-center group hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors"
                >
                  {tag}
                  <button 
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-2 text-sm text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200 opacity-70 group-hover:opacity-100 transition-opacity"
                  >
                    ✕
                  </button>
                </motion.span>
              ))}
            </AnimatePresence>
          </div>
        )}
        
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Additional details (e.g., budget, age, interests...)"
            className="flex-grow p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          
          <button
            className={`bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-6 py-3 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-400 flex items-center justify-center transition duration-200 min-w-[160px] ${isLoading || isStreaming ? 'opacity-70 cursor-not-allowed' : ''}`}
            type="submit"
            disabled={isLoading || isStreaming}
          >
            {isLoading || isStreaming ? (
              <div className="animate-spin mr-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" strokeDasharray="30 60" />
                </svg>
              </div>
            ) : null}
            {isLoading || isStreaming ? 'Thinking...' : 'Get Gift Ideas'}
            {!isLoading && !isStreaming && <RiSendPlaneFill className="ml-2 text-xl" />}
          </button>
        </div>
      </motion.form>
      
      {/* Custom CSS for scrollbar */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(156, 39, 176, 0.3);
          border-radius: 20px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(156, 39, 176, 0.5);
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
};

export default GiftIdea;