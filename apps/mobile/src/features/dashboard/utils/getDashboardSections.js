import dashboardSectionCatalog, {
  DASHBOARD_SECTION_KEYS,
} from '@/features/dashboard/config/dashboardSections';

const sectionOrder = [
  DASHBOARD_SECTION_KEYS.START,
  DASHBOARD_SECTION_KEYS.EMPLOYMENT,
  DASHBOARD_SECTION_KEYS.GIG,
  DASHBOARD_SECTION_KEYS.BUSINESS,
  DASHBOARD_SECTION_KEYS.RRSP,
  DASHBOARD_SECTION_KEYS.DONATIONS,
  DASHBOARD_SECTION_KEYS.SPOUSE,
];

export const getDashboardSections = (profile) => {
  return sectionOrder
    .map((sectionKey) => dashboardSectionCatalog[sectionKey])
    .map((section) => {
      const visibleCards = section.cards.filter((card) => {
        try {
          return typeof card.visibility === 'function'
            ? card.visibility(profile)
            : true;
        } catch (error) {
          return false;
        }
      });

      return {
        ...section,
        cards: visibleCards,
      };
    })
    .filter((section) => section.cards.length > 0);
};

export default getDashboardSections;


