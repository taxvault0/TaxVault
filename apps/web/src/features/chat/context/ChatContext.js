import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import { useAuth } from '../../auth/context/AuthContext';
import { messageService } from 'services/messageService';
import { io } from 'socket.io-client';

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const { user } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [activeConversation, setActiveConversation] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const socketRef = useRef(null);

  const handleNewMessage = useCallback(
    (message) => {
      setConversations((prev) => {
        const updated = [...prev];
        const index = updated.findIndex((c) => c.id === message.conversationId);

        if (index !== -1) {
          const increment = message.senderId !== user?.id ? 1 : 0;

          updated[index] = {
            ...updated[index],
            lastMessage: message,
            unreadCount: (updated[index].unreadCount || 0) + increment,
          };

          const [conversation] = updated.splice(index, 1);
          updated.unshift(conversation);
        }

        return updated;
      });

      if (message.senderId !== user?.id) {
        setUnreadCount((prev) => prev + 1);
      }
    },
    [user?.id]
  );

  const handleMessageRead = useCallback(({ conversationId }) => {
    setConversations((prev) => {
      const targetConversation = prev.find((conv) => conv.id === conversationId);
      const removedUnread = targetConversation?.unreadCount || 0;

      if (removedUnread > 0) {
        setUnreadCount((current) => Math.max(0, current - removedUnread));
      }

      return prev.map((conv) =>
        conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
      );
    });
  }, []);

  const handleTyping = useCallback(({ conversationId, userId, isTyping }) => {
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === conversationId
          ? { ...conv, typing: isTyping ? userId : null }
          : conv
      )
    );
  }, []);

  const loadConversations = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      const response = await messageService.getConversations();
      const data = Array.isArray(response?.data) ? response.data : [];

      setConversations(data);

      const unread = data.reduce((acc, conv) => acc + (conv.unreadCount || 0), 0);
      setUnreadCount(unread);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }

      setConversations([]);
      setUnreadCount(0);
      setOnlineUsers([]);
      setActiveConversation(null);
      return;
    }

    const SOCKET_URL = process.env.REACT_APP_SOCKET_URL;

    if (!SOCKET_URL) {
      console.warn('No socket URL configured — skipping chat socket connection');
      return;
    }

    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    const newSocket = io(SOCKET_URL, {
      auth: { token: localStorage.getItem('token') },
      transports: ['websocket'],
      reconnection: false,
    });

    socketRef.current = newSocket;

    newSocket.on('connect', () => {
      console.log('Chat socket connected');
    });

    newSocket.on('connect_error', (err) => {
      console.warn('Socket connect error:', err.message);
    });

    newSocket.on('online_users', (users) => {
      setOnlineUsers(Array.isArray(users) ? users : []);
    });

    newSocket.on('new_message', handleNewMessage);
    newSocket.on('message_read', handleMessageRead);
    newSocket.on('typing', handleTyping);

    return () => {
      newSocket.off('connect');
      newSocket.off('connect_error');
      newSocket.off('online_users');
      newSocket.off('new_message', handleNewMessage);
      newSocket.off('message_read', handleMessageRead);
      newSocket.off('typing', handleTyping);
      newSocket.disconnect();

      if (socketRef.current === newSocket) {
        socketRef.current = null;
      }
    };
  }, [user, handleNewMessage, handleMessageRead, handleTyping]);

  useEffect(() => {
    if (user && isOpen && conversations.length === 0 && !loading) {
      loadConversations();
    }
  }, [user, isOpen, conversations.length, loading, loadConversations]);

  const openChat = async (conversation = null) => {
    setActiveConversation(conversation);
    setIsOpen(true);
    setMinimized(false);

    if (conversations.length === 0 && !loading) {
      await loadConversations();
    }

    if (conversation?.unreadCount > 0) {
      try {
        await messageService.markConversationAsRead(conversation.id);
      } catch (error) {
        console.error('Error marking conversation as read:', error);
      }
    }
  };

  const closeChat = () => {
    setIsOpen(false);
    setActiveConversation(null);
  };

  const minimizeChat = () => {
    setMinimized(true);
  };

  const maximizeChat = () => {
    setMinimized(false);
  };

  const sendMessage = async (conversationId, text, attachments = []) => {
    try {
      const response = await messageService.sendMessage(conversationId, {
        text,
        attachments,
      });

      if (socketRef.current) {
        socketRef.current.emit('send_message', {
          conversationId,
          message: response.data,
        });
      }

      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  const markAsRead = (conversationId, messageId) => {
    if (socketRef.current) {
      socketRef.current.emit('mark_read', { conversationId, messageId });
    }
  };

  const sendTyping = (conversationId, isTyping) => {
    if (socketRef.current) {
      socketRef.current.emit('typing', { conversationId, isTyping });
    }
  };

  const value = {
    isOpen,
    minimized,
    activeConversation,
    conversations,
    unreadCount,
    onlineUsers,
    loading,
    openChat,
    closeChat,
    minimizeChat,
    maximizeChat,
    sendMessage,
    markAsRead,
    sendTyping,
    loadConversations,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};