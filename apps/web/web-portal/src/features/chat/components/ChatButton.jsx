import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { useAuth } from 'features/auth/context/AuthContext';

const getAssignedCAId = (user) => {
  if (!user) return null;
  if (typeof user.assignedCAId === 'string' || typeof user.assignedCAId === 'number') return user.assignedCAId;
  if (typeof user.caId === 'string' || typeof user.caId === 'number') return user.caId;
  if (typeof user.assignedCA === 'string' || typeof user.assignedCA === 'number') return user.assignedCA;
  if (user.assignedCA && typeof user.assignedCA === 'object') return user.assignedCA.id || user.assignedCA._id || null;
  return null;
};

const ChatButton = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) return null;

  const assignedCAId = getAssignedCAId(user);
  const isOnMessagePage =
    location.pathname.startsWith('/messages') ||
    location.pathname.startsWith('/ca/messages');

  if (isOnMessagePage) return null;

  const handleClick = () => {
    if (user?.role === 'ca') {
      navigate('/ca/messages');
      return;
    }

    if (assignedCAId) {
      navigate(`/messages/${assignedCAId}`);
      return;
    }

    navigate('/find-ca');
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary-600 text-white shadow-lg transition hover:scale-105 hover:bg-primary-700"
      title={
        user?.role === 'ca'
          ? 'Open client messages'
          : assignedCAId
          ? 'Chat with your CA'
          : 'Find a CA first'
      }
    >
      <MessageCircle size={24} />
    </button>
  );
};

export default ChatButton;

