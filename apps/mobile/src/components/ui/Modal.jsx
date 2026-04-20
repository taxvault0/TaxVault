import { StyleSheet } from 'react-native';
import React from 'react';
import {
  Modal as RNModal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, typography, spacing, borderRadius } from '@/styles/theme';
import Button from './Button';

const Modal = ({
  visible,
  onClose,
  title,
  children,
  footer,
  showCloseButton = true,
  closeOnBackdropPress = true,
  size = 'md', // sm, md, lg, full
}) => {
  const getModalWidth = () => {
    switch (size) {
      case 'sm': return '80%';
      case 'md': return '90%';
      case 'lg': return '95%';
      case 'full': return '100%';
      default: return '90%';
    }
  };

  const getModalHeight = () => {
    switch (size) {
      case 'sm': return 'auto';
      case 'md': return 'auto';
      case 'lg': return '80%';
      case 'full': return '100%';
      default: return 'auto';
    }
  };

  return (
    <RNModal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={closeOnBackdropPress ? onClose : null}
      >
        <View style={[
          styles.modalContainer,
          {
            width: getModalWidth(),
            maxHeight: getModalHeight(),
          },
        ]}>
          {/* Header */}
          {(title || showCloseButton) && (
            <View style={styles.header}>
              {title && <Text style={styles.title}>{title}</Text>}
              {showCloseButton && (
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Icon name="close" size={24} color={colors.gray[400]} />
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Content */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.content}
          >
            {children}
          </ScrollView>

          {/* Footer */}
          {footer && <View style={styles.footer}>{footer}</View>}
        </View>
      </TouchableOpacity>
    </RNModal>
  );
};

export const ConfirmationModal = ({
  visible,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'info', // info, success, warning, error
}) => {
  const getIcon = () => {
    switch (type) {
      case 'success': return 'check-circle';
      case 'warning': return 'alert';
      case 'error': return 'close-circle';
      default: return 'information';
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'success': return colors.success;
      case 'warning': return colors.warning;
      case 'error': return colors.error;
      default: return colors.primary[500];
    }
  };

  return (
    <Modal visible={visible} onClose={onClose} size="sm">
      <View style={styles.confirmationContainer}>
        <Icon name={getIcon()} size={48} color={getIconColor()} />
        <Text style={styles.confirmationTitle}>{title}</Text>
        <Text style={styles.confirmationMessage}>{message}</Text>
        <View style={styles.confirmationButtons}>
          <Button
            title={cancelText}
            variant="outline"
            onPress={onClose}
            style={styles.confirmationButton}
          />
          <Button
            title={confirmText}
            onPress={onConfirm}
            style={styles.confirmationButton}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    ...shadows.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    ...typography.h6,
    color: colors.text.primary,
    flex: 1,
  },
  closeButton: {
    padding: spacing.xs,
  },
  content: {
    padding: spacing.lg,
  },
  footer: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  confirmationContainer: {
    alignItems: 'center',
    padding: spacing.md,
  },
  confirmationTitle: {
    ...typography.h5,
    color: colors.text.primary,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  confirmationMessage: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  confirmationButtons: {
    flexDirection: 'row',
    gap: spacing.md,
    width: '100%',
  },
  confirmationButton: {
    flex: 1,
  },
});

export default Modal;





