import React, { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Send, ShieldCheck } from 'lucide-react';
import { useAuth } from 'features/auth/context/AuthContext';
import Card from 'components/ui/Card';
import Button from 'components/ui/Button';

const getAssignedCAId = (user) => {
  if (!user) return null;
  if (typeof user.assignedCAId === 'string' || typeof user.assignedCAId === 'number') return String(user.assignedCAId);
  if (typeof user.caId === 'string' || typeof user.caId === 'number') return String(user.caId);
  if (typeof user.assignedCA === 'string' || typeof user.assignedCA === 'number') return String(user.assignedCA);
  if (user.assignedCA && typeof user.assignedCA === 'object') {
    return String(user.assignedCA.id || user.assignedCA._id || '');
  }
  return null;
};

const getAssignedCAName = (user) => {
  if (user?.assignedCA && typeof user.assignedCA === 'object') {
    return user.assignedCA.name || 'Your CA';
  }
  return 'Your CA';
};

const UserConversation = () => {
  const { caId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [message, setMessage] = useState('');

  const assignedCAId = getAssignedCAId(user);
  const assignedCAName = getAssignedCAName(user);
  const isAllowed = assignedCAId && String(assignedCAId) === String(caId);

  const conversation = useMemo(
    () => [
      {
        id: 1,
        sender: 'ca',
        text: 'Hello! I’m your assigned CA. Please upload your tax documents and let me know if you have any questions.',
        time: '9:00 AM',
      },
      {
        id: 2,
        sender: 'user',
        text: 'Thanks. I uploaded my receipts and I will upload my T4 today.',
        time: '9:12 AM',
      },
      {
        id: 3,
        sender: 'ca',
        text: 'Perfect. Once your T4 is uploaded, I can review everything and update you.',
        time: '9:15 AM',
      },
    ],
    []
  );

  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setMessage('');
  };

  if (!assignedCAId) {
    return (
      <Card>
        <Card.Body>
          <div className="py-10 text-center">
            <h2 className="text-xl font-semibold text-gray-900">No CA assigned</h2>
            <p className="mt-2 text-sm text-gray-600">
              You need to choose a CA before you can access chat.
            </p>
            <Button className="mt-6" onClick={() => navigate('/find-ca')}>
              Find a CA
            </Button>
          </div>
        </Card.Body>
      </Card>
    );
  }

  if (!isAllowed) {
    return (
      <Card>
        <Card.Body>
          <div className="py-10 text-center">
            <h2 className="text-xl font-semibold text-gray-900">Conversation not available</h2>
            <p className="mt-2 text-sm text-gray-600">
              You can only access the conversation with your assigned CA.
            </p>
            <Button className="mt-6" onClick={() => navigate(`/messages/${assignedCAId}`)}>
              Go to My CA Chat
            </Button>
          </div>
        </Card.Body>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            to="/messages"
            className="rounded-lg border border-gray-200 p-2 hover:bg-gray-50"
          >
            <ArrowLeft size={18} />
          </Link>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">{assignedCAName}</h1>
            <p className="text-sm text-gray-500">Secure tax communication</p>
          </div>
        </div>

        <div className="hidden items-center gap-2 rounded-full bg-green-50 px-3 py-2 text-sm text-green-700 md:flex">
          <ShieldCheck size={16} />
          Secure chat
        </div>
      </div>

      <Card>
        <Card.Body className="p-0">
          <div className="h-[60vh] overflow-y-auto bg-gray-50 p-4">
            <div className="space-y-4">
              {conversation.map((item) => (
                <div
                  key={item.id}
                  className={`flex ${item.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                      item.sender === 'user'
                        ? 'bg-primary-600 text-white'
                        : 'bg-white text-gray-900'
                    }`}
                  >
                    <p>{item.text}</p>
                    <p
                      className={`mt-2 text-xs ${
                        item.sender === 'user' ? 'text-primary-100' : 'text-gray-400'
                      }`}
                    >
                      {item.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <form
            onSubmit={handleSend}
            className="border-t border-gray-200 bg-white p-4"
          >
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-primary-500"
              />
              <Button type="submit" variant="primary">
                <Send size={16} className="mr-2" />
                Send
              </Button>
            </div>
          </form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default UserConversation;

