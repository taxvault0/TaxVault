import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  MoreVertical, 
  Phone, 
  Video, 
  Info,
  Star,
  CheckCheck,
  Check,
  Clock,
  Paperclip,
  Send,
  Smile,
  X,
  Image as ImageIcon,
  FileText
} from 'lucide-react';
import { useChat } from '../context/ChatContext';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { messageService } from 'services/messageService';

const ChatWindow = () => {
  const {
    activeConversation,
    onlineUsers,
    closeChat,
    sendMessage,
    markAsRead,
    sendTyping,
  } = useChat();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const isOnline = onlineUsers.includes(activeConversation?.participantId);

  useEffect(() => {
    if (activeConversation) {
      loadMessages();
    }
  }, [activeConversation]);

  const loadMessages = async (reset = true) => {
    if (!activeConversation) return;

    setLoading(true);
    try {
      const currentPage = reset ? 1 : page;
      const response = await messageService.getMessages(
        activeConversation.id,
        currentPage,
        50
      );

      if (reset) {
        setMessages(response.data.messages);
        setPage(2);
      } else {
        setMessages(prev => [...prev, ...response.data.messages]);
        setPage(prev => prev + 1);
      }

      setHasMore(response.data.hasMore);

      // Mark messages as read
      if (response.data.messages.length > 0) {
        const unreadMessages = response.data.messages.filter(
          m => m.senderId !== 'current-user' && !m.read
        );
        unreadMessages.forEach(m => {
          markAsRead(activeConversation.id, m.id);
        });
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (hasMore && !loading) {
      loadMessages(false);
    }
  };

  const handleScroll = (e) => {
    const { scrollTop } = e.target;
    if (scrollTop === 0 && hasMore && !loading) {
      loadMore();
    }
  };

  const handleSend = async (text, attachments) => {
    if (!text.trim() && attachments.length === 0) return;

    setSending(true);
    try {
      await sendMessage(activeConversation.id, text, attachments);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleTyping = (isTyping) => {
    sendTyping(activeConversation.id, isTyping);
  };

  const formatMessageTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const groupMessagesByDate = () => {
    const groups = [];
    let currentDate = null;

    messages.forEach((message, index) => {
      const messageDate = new Date(message.createdAt).toDateString();
      
      if (messageDate !== currentDate) {
        currentDate = messageDate;
        groups.push({
          type: 'date',
          date: messageDate,
        });
      }

      groups.push({
        type: 'message',
        message,
        isFirstInGroup: index === 0 || messages[index - 1]?.senderId !== message.senderId,
        isLastInGroup: index === messages.length - 1 || messages[index + 1]?.senderId !== message.senderId,
      });
    });

    return groups;
  };

  const messageGroups = groupMessagesByDate();

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b">
        <div className="flex items-center">
          <button
            onClick={closeChat}
            className="lg:hidden mr-2 p-1 hover:bg-gray-100 rounded"
          >
            <ArrowLeft size={18} />
          </button>
          
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
              <span className="text-lg font-bold text-primary-600">
                {activeConversation?.participantName?.charAt(0)}
              </span>
            </div>
            {isOnline && (
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
            )}
          </div>

          <div className="ml-3">
            <h4 className="font-semibold text-gray-900">
              {activeConversation?.participantName}
            </h4>
            <p className="text-xs text-gray-500">
              {isOnline ? 'Online' : 'Offline'} • {activeConversation?.participantRole}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <Phone size={18} className="text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <Video size={18} className="text-gray-600" />
          </button>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Info size={18} className="text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <MoreVertical size={18} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 bg-gray-50"
      >
        {loading && messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {messageGroups.map((group, index) => {
              if (group.type === 'date') {
                return (
                  <div key={index} className="flex justify-center">
                    <span className="text-xs bg-white px-3 py-1 rounded-full shadow-sm text-gray-500">
                      {new Date(group.date).toLocaleDateString('en-CA', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                );
              }

              return (
                <ChatMessage
                  key={group.message.id}
                  message={group.message}
                  isFirstInGroup={group.isFirstInGroup}
                  isLastInGroup={group.isLastInGroup}
                  formatTime={formatMessageTime}
                />
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <ChatInput
        onSend={handleSend}
        onTyping={handleTyping}
        sending={sending}
      />
    </div>
  );
};

export default ChatWindow;








