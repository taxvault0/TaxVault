import { StyleSheet } from 'react-native';

const formStyles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 16,
  },

  field: {
    marginBottom: 14,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },

  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 14,
    backgroundColor: '#FFFFFF',
    color: '#0F172A',
  },

  textArea: {
    minHeight: 110,
    textAlignVertical: 'top',
    paddingTop: 12,
  },

  inputError: {
    borderColor: '#DC2626',
  },

  error: {
    marginTop: 6,
    color: '#DC2626',
    fontSize: 12,
  },

  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  chip: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },

  chipActive: {
    backgroundColor: '#DBEAFE',
    borderColor: '#93C5FD',
  },

  chipText: {
    color: '#334155',
    fontWeight: '600',
    fontSize: 13,
  },

  chipTextActive: {
    color: '#1D4ED8',
  },

  switchRow: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  switchLabel: {
    flex: 1,
    color: '#334155',
    fontWeight: '600',
    paddingRight: 12,
  },

  card: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    padding: 14,
    backgroundColor: '#FFFFFF',
    marginBottom: 14,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 10,
  },

  row: {
    marginBottom: 8,
  },

  rowLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 2,
  },

  rowValue: {
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '600',
  },

  infoCard: {
    marginTop: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#DBEAFE',
    backgroundColor: '#EFF6FF',
    padding: 14,
  },

  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1D4ED8',
    marginBottom: 4,
  },

  infoText: {
    fontSize: 12,
    lineHeight: 18,
    color: '#1E40AF',
  },

  uploadBox: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    padding: 14,
    backgroundColor: '#FFFFFF',
  },

  uploadTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },

  uploadSubtitle: {
    marginTop: 4,
    fontSize: 12,
    color: '#64748B',
  },
});

export default formStyles;