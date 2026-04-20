import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#0F172A',
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: '#475569',
  },
  errorText: {
    color: '#B91C1C',
    marginBottom: 12,
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyListContent: {
    flexGrow: 1,
  },
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    gap: 12,
  },
  cardName: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
  },
  cardMeta: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 4,
  },
  cardBottomRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  cardTag: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1D4ED8',
    backgroundColor: '#DBEAFE',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  statusBadge: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  statusAssigned: {
    backgroundColor: '#DCFCE7',
  },
  statusUnassigned: {
    backgroundColor: '#FEF3C7',
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  statusAssignedText: {
    color: '#166534',
  },
  statusUnassignedText: {
    color: '#92400E',
  },
});

export default styles;