import React from 'react';
import { AuthProvider } from '../../features/auth/context/AuthContext';
import { ChatProvider } from '../../features/chat/context/ChatContext';

const AppProviders = ({ children }) => {
  return (
    <AuthProvider>
      <ChatProvider>{children}</ChatProvider>
    </AuthProvider>
  );
};

export default AppProviders;




