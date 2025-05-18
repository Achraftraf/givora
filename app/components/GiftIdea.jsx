"use client";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { RiSendPlaneFill } from "react-icons/ri";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { nightOwl } from "react-syntax-highlighter/dist/cjs/styles/prism"; // Changed from ESM to CJS
import { HiOutlineClipboardCopy, HiCheck } from "react-icons/hi";
import { FaGift, FaTag, FaCalendarAlt } from "react-icons/fa";

const GiftIdea = () => {
  const [input, setInput] = useState("");
  const [occasion, setOccasion] = useState("");
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState("");
  const [giftHistory, setGiftHistory] = useState([]);
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
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
    mutationFn: (request) =>
      fetch("/api/coding/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: request.message, 
          chatHistory: request.chatHistory 
        }),
      }).then((res) => res.json()),
    onSuccess: (response, request) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: request.message, type: "user" },
      ]);
      setGiftHistory((prevHistory) => [
        ...prevHistory,
        { role: "user", content: request.message },
        { role: "assistant", content: response.message },
      ]);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: response.message, type: "bot" },
      ]);
      setInput("");
    },
    onError: () => {
      toast.error("Failed to generate gift ideas.");
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

  useEffect(() => {
    // Add the keyframes for fadeIn animation to the document
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      .animate-fade-in {
        animation: fadeIn 0.5s ease-out forwards;
      }
      
      .animate-pulse {
        animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      }
      
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const copyToClipboard = (code, messageIndex, codeIndex) => {
    navigator.clipboard.writeText(code);
    setCopiedCode({ messageIndex, codeIndex });

    setTimeout(() => {
      setCopiedCode({ messageIndex: null, codeIndex: null });
    }, 500);
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
            <button
              className={`absolute top-2 right-2 p-2 rounded-full transition ${
                copiedCode.messageIndex === messageIndex &&
                copiedCode.codeIndex === codeIndex
                  ? "bg-green-500 hover:bg-green-400"
                  : "bg-gray-800 hover:bg-gray-700"
              } text-white`}
              onClick={() => copyToClipboard(code, messageIndex, codeIndex)}
            >
              {copiedCode.messageIndex === messageIndex &&
              copiedCode.codeIndex === codeIndex ? (
                <HiCheck className="text-xl" />
              ) : (
                <HiOutlineClipboardCopy className="text-xl" />
              )}
            </button>
            <SyntaxHighlighter
              language={language.toLowerCase()}
              style={nightOwl}
              customStyle={{ borderRadius: "0.5rem", padding: "1rem" }}
            >
              {code}
            </SyntaxHighlighter>
          </div>
        );
      } else {
        return (
          <p key={codeIndex} className="text-md">
            {part}
          </p>
        );
      }
    });
  };

  return (
    <div className="min-h-[calc(100vh-6rem)] grid grid-rows-[1fr,auto] p-4">
      <div>
        <h2 className="text-3xl font-bold mb-4 flex items-center">
          <div className="mr-2 animate-pulse">
            <FaGift className="text-pink-500" />
          </div>
          GIVORA: Gift Ideas That Delight!
        </h2>
        <p 
          className="text-gray-600 mb-6 animate-fade-in"
        >
          Tell us about the occasion and preferences to get personalized gift suggestions.
        </p>
        
        <div className="h-[65dvh] overflow-y-auto flex flex-col gap-6 scrollbar-hidden p-4">
          {messages.length === 0 ? (
            <div 
              className="flex flex-col items-center justify-center h-full text-gray-400"
            >
              <div className="animate-bounce">
                <FaGift className="text-5xl mb-4 text-pink-400" />
              </div>
              <p className="text-lg">Select an occasion and optional tags to get started!</p>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`max-w-[75%] p-4 rounded-3xl w-fit shadow-md transition-all duration-300 animate-fade-in ${
                  msg.type === "user"
                    ? "self-end bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-tr-none"
                    : "self-start bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800"
                }`}
                style={{
                  animation: `fadeIn 0.3s ease-out ${index * 0.1}s both`
                }}
              >
                {renderMessage(msg.text, index)}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl mx-auto py-4 px-6 rounded-lg bg-white shadow-md"
      >
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <FaCalendarAlt className="mr-2 text-purple-500" />
            <label className="font-medium">Occasion</label>
          </div>
          <select
            value={occasion}
            onChange={(e) => setOccasion(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4"
            required
          >
            <option value="">Select an occasion</option>
            {occasionOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
        
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <FaTag className="mr-2 text-purple-500" />
            <label className="font-medium">Tags (optional)</label>
          </div>
          <div className="flex">
            <input
              type="text"
              placeholder="e.g., tech, outdoors, eco-friendly"
              className="flex-grow p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="bg-purple-500 text-white px-4 rounded-r-lg hover:bg-purple-600"
            >
              Add
            </button>
          </div>
          
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag, index) => (
                <span 
                  key={tag} 
                  className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full flex items-center hover:scale-105 transition-transform"
                  style={{
                    animation: `fadeIn 0.3s ease-out ${index * 0.1}s both`
                  }}
                >
                  {tag}
                  <button 
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-2 text-sm text-purple-600 hover:text-purple-800"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
        
        <div className="mb-4">
          <input
            type="text"
            placeholder="Additional details (e.g., budget, age, interests...)"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
        
        <div className="flex justify-end">
          <button
            className={`bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-6 py-3 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-400 flex items-center justify-center transition duration-200 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="animate-spin mr-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" strokeDasharray="30 60" />
                </svg>
              </div>
            ) : null}
            {isLoading ? 'Generating Ideas...' : 'Get Gift Ideas'}
            {!isLoading && <RiSendPlaneFill className="ml-2 text-xl" />}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GiftIdea;