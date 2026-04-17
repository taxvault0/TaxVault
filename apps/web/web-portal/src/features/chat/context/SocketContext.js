import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../../auth/context/AuthContext';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { user, token } = useAuth();

  useEffect(() => {
    if (!user || !token) return;

    // Connect to socket server
    const newSocket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000', {
      auth: { token },
      transports: ['websocket'],
    });

    newSocket.on('connect', () => {
      console.log('🔌 Socket connected');
    });

    newSocket.on('online_users', (users) => {
      setOnlineUsers(users);
    });

    newSocket.on('disconnect', () => {
      console.log('🔌 Socket disconnected');
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user, token]);

  // Join conversation room
  const joinConversation = (conversationId) => {
    if (socket) {
      socket.emit('join_conversation', conversationId);
    }
  };

  // Leave conversation room
  const leaveConversation = (conversationId) => {
    if (socket) {
      socket.emit('leave_conversation', conversationId);
    }
  };

  // Send message
  const sendMessage = (conversationId, message, tempId) => {
    if (socket) {
      socket.emit('send_message', { conversationId, message, tempId });
    }
  };

  // Mark message as read
  const markAsRead = (messageId, conversationId) => {
    if (socket) {
      socket.emit('mark_read', { messageId, conversationId });
    }
  };

  // Send typing indicator
  const sendTyping = (conversationId, isTyping) => {
    if (socket) {
      socket.emit('typing', { conversationId, isTyping });
    }
  };

  // Listen for events
  const onNewMessage = (callback) => {
    if (socket) {
      socket.on('new_message', callback);
    }
  };

  const onMessageRead = (callback) => {
    if (socket) {
      socket.on('message_read', callback);
    }
  };

  const onTyping = (callback) => {
    if (socket) {
      socket.on('typing', callback);
    }
  };

  const onUserOnline = (callback) => {
    if (socket) {
      socket.on('user_online', callback);
    }
  };

  const onUserOffline = (callback) => {
    if (socket) {
      socket.on('user_offline', callback);
    }
  };

  const value = {
    socket,
    onlineUsers,
    joinConversation,
    leaveConversation,
    sendMessage,
    markAsRead,
    sendTyping,
    onNewMessage,
    onMessageRead,
    onTyping,
    onUserOnline,
    onUserOffline,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};








