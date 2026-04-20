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
  heroCard: {
    borderRadius: 20,
    padding: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    color: '#475569',
  },
  progressScroll: {
    marginBottom: 16,
  },
  progressContent: {
    alignItems: 'center',
    paddingRight: 12,
  },
  progressItem: {
    alignItems: 'center',
  },
  progressDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  progressDotActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  progressDotText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#475569',
  },
  progressDotTextActive: {
    color: '#FFFFFF',
  },
  progressLabel: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    textAlign: 'center',
    minWidth: 74,
  },
  progressLabelActive: {
    color: '#1D4ED8',
  },
  progressLine: {
    width: 26,
    height: 2,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 6,
    marginBottom: 18,
  },
  progressLineActive: {
    backgroundColor: '#2563EB',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
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
  errorBanner: {
  backgroundColor: '#FEF2F2',
  borderColor: '#FECACA',
  borderWidth: 1,
  borderRadius: 12,
  padding: 12,
  marginBottom: 16,
},
errorBannerText: {
  color: '#B91C1C',
  fontSize: 14,
  fontWeight: '500',
},
});

export default styles;