import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
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
  progressRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  progressItem: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  progressItemActive: {
    backgroundColor: '#DBEAFE',
  },
  progressNumber: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  progressTextActive: {
    color: '#1D4ED8',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  button: {
    flex: 1,
    minHeight: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: '#2563EB',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  secondaryButtonText: {
    color: '#0F172A',
  },
});

export default styles;