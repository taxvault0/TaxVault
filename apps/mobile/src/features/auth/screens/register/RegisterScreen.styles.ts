import { StyleSheet, TextStyle } from 'react-native';
import { colors, typography, spacing } from '@/styles/theme';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F6F8FC',
  },

  scrollContent: {
    padding: spacing.lg,
    paddingBottom: 140,
  },

  heroCard: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },

  title: {
    ...((typography.h2 || {}) as TextStyle),
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },

  subtitle: {
    ...((typography.body || {}) as TextStyle),
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },

  progressScroll: {
    marginBottom: spacing.lg,
  },

  progressScrollContent: {
    alignItems: 'center',
    paddingHorizontal: 4,
  },

  progressItem: {
    alignItems: 'center',
    width: 70,
  },

  progressDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.gray[300],
    alignItems: 'center',
    justifyContent: 'center',
  },

  progressDotActive: {
    backgroundColor: colors.primaryScale[500],
    borderColor: colors.primaryScale[500],
  },

  progressLabel: {
    marginTop: 8,
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
    textAlign: 'center',
  },

  progressLabelActive: {
    color: colors.primaryScale[600],
  },

  progressLine: {
    width: 26,
    height: 2,
    backgroundColor: colors.gray[300],
    marginHorizontal: 2,
    marginBottom: 18,
    borderRadius: 99,
  },

  progressLineActive: {
    backgroundColor: colors.primaryScale[500],
  },

  card: {
    borderRadius: 24,
    marginBottom: spacing.lg,
    backgroundColor: colors.white,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },

  sectionHeader: {
    marginBottom: spacing.lg,
  },

  sectionTitle: {
    ...((typography.h4 || {}) as TextStyle),
    color: colors.text,
    marginBottom: 4,
  },

  sectionSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },

  sectionBlock: {
    marginBottom: spacing.lg,
  },

  blockTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },

  row: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'flex-start',
  },

  half: {
    flex: 1,
  },

  field: {
    marginBottom: spacing.md,
  },

  label: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },

  input: {
    minHeight: 52,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.gray[300],
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    color: colors.text,
    fontSize: 15,
  },

  inputError: {
    borderColor: colors.error || '#DC2626',
  },

  inputDisabled: {
    backgroundColor: colors.gray[100],
    color: colors.textSecondary,
  },

  textArea: {
    minHeight: 100,
    paddingTop: 14,
    textAlignVertical: 'top' as const,
  },

  passwordWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 16,
    backgroundColor: colors.white,
    minHeight: 52,
    paddingRight: 12,
  },

  passwordInput: {
    flex: 1,
    minHeight: 52,
    paddingHorizontal: 16,
    fontSize: 15,
    color: colors.text,
  },

  eyeButton: {
    padding: 4,
  },

  pickerWrap: {
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 16,
    overflow: 'hidden' as const,
    backgroundColor: colors.white,
    minHeight: 52,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },

  picker: {
    minHeight: 52,
    color: colors.text,
  },

  pickerItem: {
    fontSize: 15,
    color: colors.text,
  },

  dateInput: {
    minHeight: 52,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.gray[300],
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  dateText: {
    fontSize: 15,
    color: colors.text,
  },

  placeholderText: {
    color: colors.gray[400],
  },

  doneButton: {
    alignSelf: 'flex-end',
    backgroundColor: colors.primaryScale[500],
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: spacing.md,
  },

  doneButtonText: {
    color: colors.white,
    fontWeight: '700',
  },

  helperText: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: -6,
    marginBottom: spacing.md,
  },

  errorText: {
    marginTop: 6,
    fontSize: 12,
    color: colors.error || '#DC2626',
  },

  infoBanner: {
    marginTop: spacing.sm,
    padding: spacing.md,
    borderRadius: 16,
    backgroundColor: colors.primaryScale[50] || '#EEF4FF',
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
  },

  infoBannerText: {
    flex: 1,
    color: colors.text,
    fontSize: 13,
    lineHeight: 18,
  },

  inlineSpouseHint: {
    marginTop: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },

  inlineSpouseHintText: {
    flex: 1,
    fontSize: 13,
    color: colors.textSecondary,
  },

  taxCardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },

  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },

  choiceChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.gray[300],
    backgroundColor: colors.white,
    marginBottom: spacing.sm,
  },

  choiceChipActive: {
    backgroundColor: colors.primaryScale[500],
    borderColor: colors.primaryScale[500],
  },

  choiceChipError: {
    borderColor: colors.error || '#DC2626',
  },

  choiceChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },

  choiceChipTextActive: {
    color: colors.white,
  },

  checkListWrap: {
    marginBottom: spacing.lg,
  },

  checkItem: {
    minHeight: 52,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.gray[200] || colors.gray[300],
    paddingHorizontal: 16,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
  },

  checkItemText: {
    flex: 1,
    paddingRight: spacing.md,
    fontSize: 14,
    color: colors.text,
    fontWeight: '600',
  },

  switchRow: {
    minHeight: 52,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.gray[200] || colors.gray[300],
    paddingHorizontal: 16,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
  },

  switchLabel: {
    flex: 1,
    paddingRight: spacing.md,
    fontSize: 14,
    color: colors.text,
    fontWeight: '600',
  },

  reviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.md,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.gray[200] || colors.gray[300],
  },

  reviewLabel: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600',
  },

  reviewValue: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    textAlign: 'right',
  },

  navButtons: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    bottom: spacing.lg,
    flexDirection: 'row',
    gap: spacing.md,
  },

  navButtonHalf: {
    flex: 1,
  },

  localNavButton: {
    minHeight: 54,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },

  localNavButtonPrimary: {
    backgroundColor: colors.primaryScale[500],
  },

  localNavButtonOutline: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.primaryScale[500],
  },

  localNavButtonDisabled: {
    opacity: 0.6,
  },

  localNavButtonText: {
    fontSize: 15,
    fontWeight: '700',
  },

  localNavButtonTextPrimary: {
    color: colors.white,
  },

  localNavButtonTextOutline: {
    color: colors.primaryScale[600],
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },

  selectorSheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '70%',
    paddingBottom: spacing.xl,
  },

  selectorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.gray[200] || colors.gray[300],
  },

  selectorTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },

  selectorClose: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primaryScale[600],
  },

  selectorItem: {
    paddingHorizontal: spacing.lg,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.gray[200] || colors.gray[300],
  },

  selectorItemActive: {
    backgroundColor: colors.primaryScale[50] || '#EEF4FF',
  },

  selectorItemText: {
    fontSize: 15,
    color: colors.text,
  },

  selectorItemTextActive: {
    color: colors.primaryScale[700] || colors.primaryScale[600],
    fontWeight: '700',
  },

  googleInputContainer: {
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },

  googleInput: {
    minHeight: 52,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.gray[300],
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    color: colors.text,
    fontSize: 15,
    marginBottom: 0,
  },

  googleListView: {
    marginTop: 8,
    borderRadius: 16,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray[200] || colors.gray[300],
  },

  googleRow: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  googleDescription: {
    color: colors.text,
    fontSize: 14,
  },

  uploadBox: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.primaryScale[300] || colors.primaryScale[500],
    borderRadius: 16,
    padding: spacing.md,
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center',
    backgroundColor: colors.primaryScale[50] || '#EEF4FF',
  },

  uploadContent: {
    flex: 1,
  },

  uploadTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },

  uploadSubtitle: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.textSecondary,
    marginBottom: 4,
  },

  uploadMeta: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});

export default styles;
