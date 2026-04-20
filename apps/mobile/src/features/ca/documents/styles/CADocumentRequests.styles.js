import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#2563EB',
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
  },
  addButtonText: {
    color: '#FFF',
    textAlign: 'center',
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#FFF',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  title: {
    fontWeight: '700',
    fontSize: 16,
  },
  meta: {
    marginTop: 4,
    color: '#475569',
  },
  status: {
    marginTop: 6,
    fontWeight: '600',
  },
  emptyWrap: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: '#64748B',
    fontSize: 14,
  },
});