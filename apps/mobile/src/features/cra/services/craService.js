import api from '@/services/api';

const normalizeCRAUpdate = (item = {}) => ({
  id: item._id || item.id || '',
  title: item.title || item.headline || 'CRA Update',
  summary:
    item.summary ||
    item.description ||
    item.excerpt ||
    item.content ||
    '',
  content:
    item.content ||
    item.body ||
    item.description ||
    '',
  category:
    item.category ||
    item.type ||
    'General',
  publishedAt:
    item.publishedAt ||
    item.createdAt ||
    item.date ||
    '',
  sourceUrl:
    item.sourceUrl ||
    item.url ||
    item.link ||
    '',
  isImportant:
    typeof item.isImportant === 'boolean'
      ? item.isImportant
      : false,
});

const extractArray = (response) => {
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.data)) return response.data.data;
  if (Array.isArray(response?.data?.updates)) return response.data.updates;
  if (Array.isArray(response?.data?.results)) return response.data.results;
  return [];
};

const sortByDateDesc = (items = []) =>
  [...items].sort((a, b) => {
    const first = new Date(a.publishedAt || 0).getTime();
    const second = new Date(b.publishedAt || 0).getTime();
    return second - first;
  });

const craService = {
  getCRAUpdates: async () => {
    try {
      const response = await api.get('/cra/updates');
      const updates = extractArray(response).map(normalizeCRAUpdate);
      return sortByDateDesc(updates);
    } catch (error) {
      // fallback mock data so UI still works while backend is being wired
      const mockUpdates = [
        {
          id: 'cra-1',
          title: 'Reminder to organize tax documents early',
          summary:
            'Upload T4s, T5s, RRSP slips, donation receipts, and other tax documents early to avoid last-minute delays.',
          content:
            'Collect and upload your tax slips, receipts, and deduction-related documents as early as possible. This helps your accountant review your file faster and identify missing items sooner.',
          category: 'Filing',
          publishedAt: new Date().toISOString(),
          sourceUrl: '',
          isImportant: true,
        },
        {
          id: 'cra-2',
          title: 'Check your CRA account details before filing',
          summary:
            'Review personal details, direct deposit, mailing address, and any notices in your CRA account before your return is submitted.',
          content:
            'Before filing, confirm your CRA profile details are accurate, including banking, address, and carry-forward amounts. This can reduce avoidable delays or reassessments.',
          category: 'Account',
          publishedAt: new Date(Date.now() - 86400000).toISOString(),
          sourceUrl: '',
          isImportant: false,
        },
      ];

      return mockUpdates;
    }
  },

  getCRAUpdateById: async (id) => {
    const updates = await craService.getCRAUpdates();
    return updates.find((item) => item.id === id) || null;
  },
};

export default craService;