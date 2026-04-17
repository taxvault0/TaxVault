const FALLBACK_CRA_UPDATES = [
  {
    id: 'cra-2026-03-05-trust-reporting',
    title: 'Trust reporting requirements updated for the 2025 taxation year',
    summary:
      'CRA published an important March 2026 tax tip on trust reporting changes that may affect how certain 2025 returns are prepared and reviewed.',
    publishedAt: '2026-03-05',
    category: 'policy',
    priority: 'high',
    source: 'CRA',
    sourceUrl:
      'https://www.canada.ca/en/revenue-agency/news/newsroom/tax-tips/tax-tips-2026.html',
  },
  {
    id: 'cra-2026-02-16-tax-season-start',
    title: 'Tax season starts February 23, 2026',
    summary:
      'Most individuals must file and pay by April 30, 2026. Self-employed filers have until June 15, 2026 to file, but balances are still due by April 30, 2026.',
    publishedAt: '2026-02-16',
    category: 'deadline',
    priority: 'high',
    source: 'CRA',
    sourceUrl:
      'https://www.canada.ca/en/revenue-agency/news/newsroom/tax-tips/tax-tips-2026/tax-season-starts-february-23-heres-what-you-need-to-start-filing.html',
  },
  {
    id: 'cra-2026-01-27-filing-season-guidance',
    title: 'What you need to know for the 2026 tax-filing season',
    summary:
      'CRA highlighted filing-season changes including online account recovery, backup MFA expectations, representative authorization flow, digital NOA access, and tax-slip access changes.',
    publishedAt: '2026-01-27',
    category: 'service change',
    priority: 'high',
    source: 'CRA',
    sourceUrl:
      'https://www.canada.ca/en/revenue-agency/news/newsroom/tax-tips/tax-tips-2026/what-you-need-for-2026-tax-filing-season.html',
  },
  {
    id: 'cra-efile-2026-program-updates',
    title: 'EFILE news and program updates',
    summary:
      'CRA’s EFILE program page includes filer workflow changes, renewal timing, transmission timing, and authorization-related updates relevant for preparers.',
    publishedAt: '2026-02-01',
    category: 'efile',
    priority: 'medium',
    source: 'CRA',
    sourceUrl:
      'https://www.canada.ca/en/revenue-agency/services/e-services/digital-services-individuals/efile-electronic-filers/efile-news-program-updates.html',
  },
];

const normalizeCategory = (value = '') => {
  const key = String(value).trim().toLowerCase();

  if (['deadline', 'deadlines'].includes(key)) return 'deadline';
  if (['policy', 'rules', 'rule'].includes(key)) return 'policy';
  if (['service', 'service change', 'service-change'].includes(key)) return 'service change';
  if (['efile', 'e-file'].includes(key)) return 'efile';
  if (['security', 'mfa', 'account access'].includes(key)) return 'security';
  if (['benefit', 'benefits'].includes(key)) return 'benefit';
  if (['business tax', 'business-tax', 'business'].includes(key)) return 'business tax';

  return key || 'general';
};

const normalizePriority = (value = '') => {
  const key = String(value).trim().toLowerCase();
  if (['high', 'urgent'].includes(key)) return 'high';
  if (['medium', 'med'].includes(key)) return 'medium';
  return 'low';
};

const normalizeUpdate = (item, index = 0) => ({
  id: item?.id || `cra-update-${index}`,
  title: item?.title || 'CRA update',
  summary: item?.summary || 'Official CRA update available.',
  publishedAt: item?.publishedAt || item?.date || new Date().toISOString().slice(0, 10),
  category: normalizeCategory(item?.category),
  priority: normalizePriority(item?.priority),
  source: item?.source || 'CRA',
  sourceUrl:
    item?.sourceUrl ||
    item?.url ||
    'https://www.canada.ca/en/revenue-agency/news/newsroom.html',
});

export const getCRAUpdates = async ({ limit = 3 } = {}) => {
  try {
    const response = await fetch(`/api/cra/updates?limit=${limit}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`CRA updates request failed with status ${response.status}`);
    }

    const payload = await response.json();
    const items = Array.isArray(payload)
      ? payload
      : payload?.updates || payload?.data || payload?.results || [];

    if (!Array.isArray(items) || items.length === 0) {
      throw new Error('No CRA updates returned by backend');
    }

    return {
      updates: items.slice(0, limit).map(normalizeUpdate),
      lastSyncedAt:
        payload?.lastSyncedAt || payload?.syncedAt || payload?.updatedAt || new Date().toISOString(),
      source: 'backend',
    };
  } catch (error) {
    return {
      updates: FALLBACK_CRA_UPDATES.slice(0, limit).map(normalizeUpdate),
      lastSyncedAt: new Date().toISOString(),
      source: 'fallback',
      error,
    };
  }
};

export { FALLBACK_CRA_UPDATES };
