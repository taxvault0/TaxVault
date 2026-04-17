import React, { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Send,
  Paperclip,
  Phone,
  Video,
  ShieldCheck,
} from 'lucide-react';
import Card from 'components/ui/Card';
import Button from 'components/ui/Button';
import Badge from 'components/ui/Badge';

const getProfileLabel = (taxProfile = {}) => {
  const active = [
    taxProfile.employment && 'Employment',
    taxProfile.gigWork && 'Gig Work',
    taxProfile.selfEmployment && 'Self-Employed',
    taxProfile.incorporatedBusiness && 'Business',
  ].filter(Boolean);

  if (active.length === 0) return 'General';
  if (active.length === 1) return active[0];
  return 'Mixed Profile';
};

const CAConversation = () => {
  const { clientId } = useParams();
  const [message, setMessage] = useState('');

  const client = useMemo(() => {
    const mockClients = {
      '1': {
        id: '1',
        name: 'John Doe',
        taxProfile: {
          employment: true,
          gigWork: false,
          selfEmployment: false,
          incorporatedBusiness: false,
        },
        status: 'Active',
      },
      '2': {
        id: '2',
        name: 'Jane Smith',
        taxProfile: {
          employment: false,
          gigWork: false,
          selfEmployment: false,
          incorporatedBusiness: true,
        },
        status: 'Pending Review',
      },
      '3': {
        id: '3',
        name: 'Bob Johnson',
        taxProfile: {
          employment: false,
          gigWork: true,
          selfEmployment: true,
          incorporatedBusiness: false,
        },
        status: 'Active',
      },
      '4': {
        id: '4',
        name: 'Alice Brown',
        taxProfile: {
          employment: true,
          gigWork: true,
          selfEmployment: false,
          incorporatedBusiness: true,
        },
        status: 'Filed',
      },
    };

    return (
      mockClients[clientId] || {
        id: clientId,
        name: 'Client',
        taxProfile: {},
        status: 'Active',
      }
    );
  }, [clientId]);

  const conversation = useMemo(
    () => [
      {
        id: 1,
        sender: 'client',
        text: 'Hi, I uploaded my tax documents. Can you please review them?',
        time: '9:00 AM',
      },
      {
        id: 2,
        sender: 'ca',
        text: 'Yes, I will review them today. I may need your T4 slip as well.',
        time: '9:08 AM',
      },
      {
        id: 3,
        sender: 'client',
        text: 'Sure, I will upload my T4 this afternoon.',
        time: '9:12 AM',
      },
      {
        id: 4,
        sender: 'ca',
        text: 'Perfect. Once that is uploaded, I can proceed with the return review.',
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

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/ca/messages"
            className="rounded-lg border border-gray-200 p-2 hover:bg-gray-50"
          >
            <ArrowLeft size={18} />
          </Link>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">{client.name}</h1>
            <div className="mt-1 flex items-center gap-2">
              <Badge variant="info">{getProfileLabel(client.taxProfile)}</Badge>
              <span className="text-sm text-gray-500">{client.status}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="rounded-full border border-gray-200 p-2 text-gray-500 hover:bg-gray-50">
            <Phone size={18} />
          </button>
          <button className="rounded-full border border-gray-200 p-2 text-gray-500 hover:bg-gray-50">
            <Video size={18} />
          </button>
          <div className="hidden items-center gap-2 rounded-full bg-green-50 px-3 py-2 text-sm text-green-700 md:flex">
            <ShieldCheck size={16} />
            Secure conversation
          </div>
        </div>
      </div>

      <Card>
        <Card.Body className="p-0">
          <div className="h-[60vh] overflow-y-auto bg-gray-50 p-4">
            <div className="space-y-4">
              {conversation.map((item) => (
                <div
                  key={item.id}
                  className={`flex ${
                    item.sender === 'ca' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                      item.sender === 'ca'
                        ? 'bg-primary-600 text-white'
                        : 'bg-white text-gray-900'
                    }`}
                  >
                    <p>{item.text}</p>
                    <p
                      className={`mt-2 text-xs ${
                        item.sender === 'ca'
                          ? 'text-primary-100'
                          : 'text-gray-400'
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
              <button
                type="button"
                className="rounded-xl border border-gray-300 p-3 text-gray-500 hover:bg-gray-50"
                title="Attach document"
              >
                <Paperclip size={18} />
              </button>

              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message to the client..."
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

      <Card className="border-warning-200 bg-warning-50">
        <Card.Body>
          <p className="text-sm font-medium text-warning-800">
            Suggested workflow
          </p>
          <p className="mt-1 text-sm text-warning-700">
            Ask for missing documents in chat, then direct the client to upload
            them from the relevant dashboard section so everything stays organized.
          </p>
        </Card.Body>
      </Card>
    </div>
  );
};

export default CAConversation;

