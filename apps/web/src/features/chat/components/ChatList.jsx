import React, { useState } from 'react';
import { Search, MoreVertical, Clock, CheckCheck, Check, Star } from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { formatDistanceToNow } from 'date-fns';
import { MessageCircle } from 'lucide-react';

const ChatList = () => {
  const { conversations, onlineUsers, openChat, loading } = useChat();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredConversations = conversations.filter(conv =>
    conv.participantName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } else if (diffDays === 1) {
        return 'Yesterday';
      } else if (diffDays < 7) {
        return date.toLocaleDateString([], { weekday: 'short' });
      } else {
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
      }
    } catch {
      return '';
    }
  };

  const getMessageStatusIcon = (message) => {
    if (!message) return null;
    if (message.status === 'read') {
      return <CheckCheck size={14} className="text-blue-500" />;
    }
    if (message.status === 'delivered') {
      return <CheckCheck size={14} className="text-gray-500" />;
    }
    return <Check size={14} className="text-gray-500" />;
  };

  const ConversationItem = ({ conversation }) => {
    const isOnline = onlineUsers.includes(conversation.participantId);
    const lastMessage = conversation.lastMessage;

    return (
      <button
        onClick={() => openChat(conversation)}
        className="w-full flex items-start p-3 hover:bg-gray-50 transition-colors border-b last:border-b-0"
      >
        {/* Avatar with online indicator */}
        <div className="relative flex-shrink-0">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
            <span className="text-lg font-bold text-primary-600">
              {conversation.participantName?.charAt(0)}
            </span>
          </div>
          {isOnline && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          )}
        </div>

        {/* Content */}
        <div className="ml-3 flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h4 className="font-semibold text-gray-900 truncate">
                {conversation.participantName}
              </h4>
              {conversation.isPriority && (
                <Star size={12} className="text-gold fill-current" />
              )}
            </div>
            {lastMessage && (
              <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                {formatTime(lastMessage.timestamp)}
              </span>
            )}
          </div>

          {/* Role/Title */}
          <p className="text-xs text-gray-500 mb-1">{conversation.participantRole}</p>

          {/* Last Message Preview */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1 flex-1 min-w-0">
              {lastMessage?.senderId === 'current-user' && (
                <span className="flex-shrink-0">
                  {getMessageStatusIcon(lastMessage)}
                </span>
              )}
              <p className="text-sm text-gray-600 truncate">
                {lastMessage?.text || 'No messages yet'}
              </p>
            </div>
            
            {/* Unread Badge */}
            {conversation.unreadCount > 0 && (
              <span className="flex-shrink-0 ml-2 bg-primary-500 text-white text-xs px-2 py-0.5 rounded-full">
                {conversation.unreadCount}
              </span>
            )}
          </div>

          {/* Typing Indicator */}
          {conversation.typing && (
            <div className="flex items-center mt-1">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
              <span className="text-xs text-primary-500 ml-2">typing...</span>
            </div>
          )}
        </div>
      </button>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Search */}
      <div className="p-3 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search messages..."
            className="w-full pl-9 pr-4 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-sm text-gray-500">No conversations yet</p>
          </div>
        ) : (
          filteredConversations.map((conv) => (
            <ConversationItem key={conv.id} conversation={conv} />
          ))
        )}
      </div>
    </div>
  );
};

export default ChatList;








