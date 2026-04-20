import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bell,
  LogOut,
  Menu,
  MessageCircle,
  ChevronDown,
  User,
  Settings,
} from 'lucide-react';
import { useAuth } from '../../features/auth/context/AuthContext';
import { useChat } from '../../features/chat/context/ChatContext';

const getAssignedCAId = (user) => {
  if (!user) return null;
  return user.assignedCAId || user.caId || user.assignedCA?.id || null;
};

const Header = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const assignedCAId = getAssignedCAId(user);

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  let chatContext;
  try {
    chatContext = useChat();
  } catch {
    chatContext = {};
  }

  const { unreadCount = 0 } = chatContext;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleChatClick = () => {
    if (user?.role === 'ca') return navigate('/ca/messages');
    if (assignedCAId) return navigate(`/messages/${assignedCAId}`);
    navigate('/find-ca');
  };

  const getAccountSubtitle = () => {
    if (user?.role === 'ca') return 'Chartered Accountant';
    return assignedCAId ? 'CA Assigned' : 'Personal Account';
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (!dropdownRef.current?.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* LEFT */}
          <div className="flex items-center">
            <button
              onClick={onMenuClick}
              className="p-2 text-gray-400 hover:bg-gray-100 lg:hidden"
            >
              <Menu size={24} />
            </button>

            <Link
              to={user?.role === 'ca' ? '/ca/dashboard' : '/dashboard'}
              className="ml-2 text-2xl font-bold text-primary-600"
            >
              TaxVault
            </Link>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3">

            {/* CHAT */}
            <button
              onClick={handleChatClick}
              className="relative p-2 text-gray-400 hover:bg-gray-100"
            >
              <MessageCircle size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 rounded-full bg-red-500 px-1 text-xs text-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* NOTIFICATIONS */}
            <button className="relative p-2 text-gray-400 hover:bg-gray-100">
              <Bell size={20} />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
            </button>

            {/* PROFILE DROPDOWN */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-3 rounded-xl border border-gray-200 px-2 py-1.5 hover:bg-gray-50"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100">
                  <span className="text-sm font-semibold text-primary-700">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>

                <div className="hidden text-left md:block">
                  <p className="text-sm font-medium text-gray-800">
                    {user?.name || 'User'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {getAccountSubtitle()}
                  </p>
                </div>

                <ChevronDown size={16} />
              </button>

              {/* DROPDOWN */}
              {open && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl border bg-white shadow-lg z-50">
                  <div className="px-4 py-3 border-b">
                    <p className="text-sm font-semibold">{user?.name}</p>
                    <p className="text-xs text-gray-500">
                      {getAccountSubtitle()}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      navigate('/profile');
                      setOpen(false);
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50"
                  >
                    <User size={16} />
                    View Profile
                  </button>

                  <button
                    onClick={() => {
                      navigate('/accounts');
                      setOpen(false);
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50"
                  >
                    <Settings size={16} />
                    Manage Profile
                  </button>

                  <div className="border-t my-1" />

                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
