import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MessageCircle, Search, UserCheck } from 'lucide-react';
import { useAuth } from 'features/auth/context/AuthContext';
import Card from 'components/ui/Card';
import Button from 'components/ui/Button';
import Badge from 'components/ui/Badge';

const getAssignedCA = (user) => {
  if (!user) return null;

  if (user.assignedCA && typeof user.assignedCA === 'object') {
    return {
      id: user.assignedCA.id || user.assignedCA._id || 'ca-1',
      name: user.assignedCA.name || 'Assigned CA',
      firm: user.assignedCA.firmName || 'Tax Professional',
      unread: user.assignedCA.unreadCount || 0,
      lastMessage: user.assignedCA.lastMessage || 'Start your conversation with your CA',
      lastTime: user.assignedCA.lastTime || 'Now',
    };
  }

  const assignedCAId =
    user.assignedCAId || user.caId || (typeof user.assignedCA === 'string' ? user.assignedCA : null);

  if (!assignedCAId) return null;

  return {
    id: assignedCAId,
    name: 'Assigned CA',
    firm: 'Tax Professional',
    unread: 1,
    lastMessage: 'You can now chat with your CA here.',
    lastTime: 'Now',
  };
};

const UserMessages = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const assignedCA = getAssignedCA(user);

  if (!assignedCA) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="mt-1 text-gray-600">
            You need to connect with a CA before chat becomes available.
          </p>
        </div>

        <Card>
          <Card.Body>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 rounded-full bg-primary-50 p-4">
                <MessageCircle className="text-primary-600" size={32} />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">No CA assigned yet</h2>
              <p className="mt-2 max-w-md text-sm text-gray-600">
                Once you choose a Chartered Accountant and start your tax filing process,
                your chat will appear here.
              </p>
              <Button variant="primary" className="mt-6" onClick={() => navigate('/find-ca')}>
                <Search size={16} className="mr-2" />
                Find a CA
              </Button>
            </div>
          </Card.Body>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
        <p className="mt-1 text-gray-600">
          Chat with your assigned CA about documents, tax questions, and filing updates.
        </p>
      </div>

      <Card>
        <Card.Body>
          <Link
            to={`/messages/${assignedCA.id}`}
            className="block rounded-xl border border-gray-200 p-4 transition hover:bg-gray-50"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
                  <UserCheck className="text-primary-600" size={22} />
                </div>

                <div className="min-w-0">
                  <p className="truncate font-semibold text-gray-900">{assignedCA.name}</p>
                  <p className="text-sm text-gray-500">{assignedCA.firm}</p>
                  <p className="mt-1 truncate text-sm text-gray-600">
                    {assignedCA.lastMessage}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-xs text-gray-500">{assignedCA.lastTime}</p>
                {assignedCA.unread > 0 && (
                  <Badge variant="error" className="mt-2">
                    {assignedCA.unread}
                  </Badge>
                )}
              </div>
            </div>
          </Link>
        </Card.Body>
      </Card>
    </div>
  );
};

export default UserMessages;

