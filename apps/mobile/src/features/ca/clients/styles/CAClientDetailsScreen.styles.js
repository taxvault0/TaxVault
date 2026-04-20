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
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
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
  topActionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },
  infoRow: {
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  infoValue: {
    fontSize: 15,
    color: '#0F172A',
  },
  groupLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    marginTop: 8,
    marginBottom: 8,
  },
  tagWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  tag: {
    backgroundColor: '#DBEAFE',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1D4ED8',
  },
  emptyInline: {
    fontSize: 14,
    color: '#94A3B8',
    marginBottom: 10,
  },
  primaryButton: {
    flexGrow: 1,
    minWidth: 140,
    minHeight: 46,
    borderRadius: 12,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  secondaryButton: {
    flexGrow: 1,
    minWidth: 140,
    minHeight: 46,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  secondaryButtonText: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '700',
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#B91C1C',
    textAlign: 'center',
    marginBottom: 16,
  },
});

export default styles;  