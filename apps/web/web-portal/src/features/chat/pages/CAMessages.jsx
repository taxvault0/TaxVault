import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Search, Users, Clock, Briefcase, Car, Building2, FileText } from 'lucide-react';
import Card from 'components/ui/Card';
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

const CAMessages = () => {
  const [search, setSearch] = useState('');

  const clients = useMemo(
    () => [
      {
        id: '1',
        name: 'John Doe',
        taxProfile: {
          employment: true,
          gigWork: false,
          selfEmployment: false,
          incorporatedBusiness: false,
        },
        lastMessage: 'I uploaded my T4 and receipts.',
        lastTime: '9:12 AM',
        unread: 2,
      },
      {
        id: '2',
        name: 'Jane Smith',
        taxProfile: {
          employment: false,
          gigWork: false,
          selfEmployment: false,
          incorporatedBusiness: true,
        },
        lastMessage: 'Can you review my GST records this week?',
        lastTime: 'Yesterday',
        unread: 0,
      },
      {
        id: '3',
        name: 'Bob Johnson',
        taxProfile: {
          employment: false,
          gigWork: true,
          selfEmployment: true,
          incorporatedBusiness: false,
        },
        lastMessage: 'Thanks, I will upload the missing document today.',
        lastTime: 'Yesterday',
        unread: 1,
      },
      {
        id: '4',
        name: 'Alice Brown',
        taxProfile: {
          employment: true,
          gigWork: true,
          selfEmployment: false,
          incorporatedBusiness: true,
        },
        lastMessage: 'Please let me know if you need anything else.',
        lastTime: '2 days ago',
        unread: 0,
      },
    ],
    []
  );

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Client Messages</h1>
          <p className="mt-1 text-gray-600">
            Review and respond to messages from your assigned clients.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full bg-primary-50 px-4 py-2 text-sm text-primary-700">
          <Users size={16} />
          {filteredClients.length} client conversations
        </div>
      </div>

      <Card>
        <Card.Body>
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search clients..."
              className="w-full rounded-xl border border-gray-300 py-3 pl-11 pr-4 outline-none focus:border-primary-500"
            />
          </div>
        </Card.Body>
      </Card>

      {filteredClients.length === 0 ? (
        <Card>
          <Card.Body>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 rounded-full bg-primary-50 p-4">
                <MessageCircle className="text-primary-600" size={32} />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                No conversations found
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                {search
                  ? 'Try a different client name.'
                  : 'Your client conversations will appear here.'}
              </p>
            </div>
          </Card.Body>
        </Card>
      ) : (
        <Card>
          <Card.Body className="p-0">
            <div className="divide-y divide-gray-100">
              {filteredClients.map((client) => (
                <Link
                  key={client.id}
                  to={`/ca/messages/${client.id}`}
                  className="block px-5 py-4 transition hover:bg-gray-50"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700">
                        {client.name
                          .split(' ')
                          .map((part) => part[0])
                          .slice(0, 2)
                          .join('')}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="truncate font-semibold text-gray-900">
                            {client.name}
                          </p>
                          <Badge variant="info">{getProfileLabel(client.taxProfile)}</Badge>
                        </div>

                        <p className="mt-1 truncate text-sm text-gray-600">
                          {client.lastMessage}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center justify-end gap-1 text-xs text-gray-500">
                        <Clock size={12} />
                        {client.lastTime}
                      </div>

                      {client.unread > 0 && (
                        <div className="mt-2 flex justify-end">
                          <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
                            {client.unread > 99 ? '99+' : client.unread}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </Card.Body>
        </Card>
      )}

      <Card className="border-primary-200 bg-primary-50">
        <Card.Body>
          <p className="text-sm font-medium text-primary-800">Tip for CAs</p>
          <p className="mt-1 text-sm text-primary-600">
            Use chat to request missing documents, answer tax questions, and keep a
            written record of filing-related updates.
          </p>
        </Card.Body>
      </Card>
    </div>
  );
};

export default CAMessages;

