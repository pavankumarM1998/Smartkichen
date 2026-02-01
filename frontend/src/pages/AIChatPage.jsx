import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, Loader } from 'lucide-react';
import apiService from '../services/apiService';
import { toast } from 'react-hot-toast';

export default function AIChatPage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'Hey there! 👋 I\'m your AI cooking assistant. I can help you with recipe suggestions, cooking tips, ingredient substitutions, nutrition info, meal planning, and much more. What can I help you with today?'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputValue
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setLoading(true);

    try {
      const response = await apiService.chatWithAI({
        message: inputValue
      });

      const botMessage = {
        id: messages.length + 2,
        type: 'bot',
        content: response.data.reply
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      toast.error('Failed to get response from AI');
      const errorMessage = {
        id: messages.length + 2,
        type: 'bot',
        content: 'Sorry, I encountered an error. Please try again.'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestedQuestions = [
    'How do I make a vegetarian lasagna?',
    'What can I substitute for eggs in baking?',
    'Give me a healthy dinner idea',
    'How do I reduce food waste?',
    'What\'s a quick 30-minute meal?',
    'Can you suggest recipes for pumpkin?'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto h-screen flex flex-col">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <MessageCircle className="w-8 h-8 text-purple-600" />
            <h1 className="text-4xl font-bold text-gray-900">AI Chef Assistant</h1>
          </div>
          <p className="text-lg text-gray-600">Your personal cooking companion, available 24/7</p>
        </div>

        {/* Chat Container */}
        <div className="flex-1 bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-3 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-purple-600 text-white rounded-br-none'
                      : 'bg-gray-100 text-gray-900 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-900 px-4 py-3 rounded-lg rounded-bl-none flex items-center gap-2">
                  <Loader className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Chef is thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 p-4 space-y-3">
            {/* Suggested Questions */}
            {messages.length === 1 && (
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2">Try asking:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {suggestedQuestions.slice(0, 4).map((question, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setInputValue(question);
                      }}
                      className="text-left text-sm p-2 rounded border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition text-gray-700"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Field */}
            <div className="flex gap-2">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about cooking, recipes, ingredients..."
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                rows="3"
              />
              <button
                onClick={handleSendMessage}
                disabled={loading || !inputValue.trim()}
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold p-3 rounded-lg transition disabled:opacity-50 flex items-center justify-center"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-500 text-center">
              Press Shift+Enter for new line, or Enter to send
            </p>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="mt-6 grid md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <p className="font-semibold text-blue-900 mb-1">💡 Tips</p>
            <p className="text-xs text-blue-800">Ask about cooking techniques, ingredient properties, or dietary needs.</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <p className="font-semibold text-green-900 mb-1">🥘 Recipes</p>
            <p className="text-xs text-green-800">Request recipe suggestions based on ingredients, cuisine, or dietary preferences.</p>
          </div>
          <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
            <p className="font-semibold text-orange-900 mb-1">⚡ Quick Help</p>
            <p className="text-xs text-orange-800">Get instant answers about substitutions, cooking times, and food safety.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
