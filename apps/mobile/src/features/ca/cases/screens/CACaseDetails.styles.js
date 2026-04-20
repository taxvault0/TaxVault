import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
  },
  meta: {
    marginTop: 6,
    fontSize: 14,
    color: '#475569',
  },
  status: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#2563EB',
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '600',
    textAlign: 'center',
  },
});