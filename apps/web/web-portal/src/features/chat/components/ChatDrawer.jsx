// D:\taxvault-canada\web-portal\src\components\chat\ChatDrawer.jsx
import React from 'react';
import { X, Minus, MessageCircle } from 'lucide-react';
import { useChat } from '../context/ChatContext';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';
import ChatMinimized from './ChatMinimized';

const ChatDrawer = ({ isOpen, onClose }) => {
  // Safely get chat context with default values
  let chatContext;
  try {
    chatContext = useChat() || {};
  } catch (error) {
    console.warn('Chat context not available');
    chatContext = {};
  }
  
  const {
    minimized = false,
    activeConversation = null,
    unreadCount = 0,
    closeChat,
    minimizeChat,
    maximizeChat,
  } = chatContext;

  // Handle close - call both context close and prop onClose
  const handleClose = () => {
    if (closeChat) closeChat();
    if (onClose) onClose();
  };

  // Handle minimize
  const handleMinimize = () => {
    if (minimizeChat) minimizeChat();
  };

  // Handle maximize (when minimized)
  const handleMaximize = () => {
    if (maximizeChat) maximizeChat();
  };

  if (!isOpen) return null;

  if (minimized) {
    return <ChatMinimized onMaximize={handleMaximize} />;
  }

  return (
    <div className="fixed bottom-0 right-6 w-96 h-[600px] bg-white rounded-t-xl shadow-2xl border border-gray-200 flex flex-col z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-xl">
        <div className="flex items-center space-x-2">
          <MessageCircle size={20} />
          <h3 className="font-semibold">Messages</h3>
          {unreadCount > 0 && (
            <span className="bg-white text-blue-600 text-xs px-2 py-0.5 rounded-full">
              {unreadCount} new
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleMinimize}
            className="p-1 hover:bg-white/20 rounded transition-colors"
          >
            <Minus size={18} />
          </button>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-white/20 rounded transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeConversation ? (
          <ChatWindow />
        ) : (
          <ChatList />
        )}
      </div>

      {/* Footer (only in list view) */}
      {!activeConversation && (
        <div className="p-3 border-t text-xs text-gray-500 text-center">
          Secure messaging • End-to-end encrypted
        </div>
      )}
    </div>
  );
};

export default ChatDrawer;








