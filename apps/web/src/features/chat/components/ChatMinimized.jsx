import React from 'react';
import { MessageCircle, X } from 'lucide-react';
import { useChat } from '../context/ChatContext';

const ChatMinimized = () => {
  const { maximizeChat, closeChat, unreadCount } = useChat();

  return (
    <div className="fixed bottom-6 right-6 flex items-center space-x-2 z-50">
      {/* Unread Count Badge */}
      {unreadCount > 0 && (
        <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
          {unreadCount} new
        </div>
      )}

      {/* Chat Bubble */}
      <button
        onClick={maximizeChat}
        className="relative bg-gradient-to-r from-primary-500 to-primary-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-shadow"
      >
        <MessageCircle size={24} />
      </button>

      {/* Close Button */}
      <button
        onClick={closeChat}
        className="bg-gray-200 text-gray-600 p-2 rounded-full hover:bg-gray-300 transition-colors"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default ChatMinimized;








