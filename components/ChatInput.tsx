
import React, { useState } from 'react';
import SendIcon from './icons/SendIcon';

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    onSendMessage(content);
    setContent('');
  };

  return (
    <div className="px-6 py-4 bg-gray-800/50 backdrop-blur-sm border-t border-gray-700">
      <form onSubmit={handleSubmit} className="flex items-center gap-3">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Ask a question..."
          className="flex-1 w-full bg-gray-700 text-gray-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !content.trim()}
          className="bg-blue-600 text-white rounded-lg p-2 hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
             <div className="w-6 h-6 border-2 border-gray-400 border-t-white rounded-full animate-spin"></div>
          ) : (
             <SendIcon className="w-6 h-6" />
          )}
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
