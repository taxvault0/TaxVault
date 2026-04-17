import React, {  useState  } from 'react';
import { useTheme } from '@/core/providers/ThemeContext';
import {
  View,
  Text,
  TouchableOpacity,
  Share,
  Alert,
  Modal,
  StyleSheet
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Clipboard from 'expo-clipboard';
import Card from './Card';
import Button from './Button';
import { colors, borderRadius } from '@/styles/theme';
import { typography, borderRadius } from '@/styles/theme';
import { spacing, borderRadius } from '@/styles/theme';

const ClientIDCard = ({ clientId, userName, showQR = true }) => {
  const [copied, setCopied] = useState(false);
  const [qrVisible, setQrVisible] = useState(false);

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(clientId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareClientId = async () => {
    try {
      await Share.share({
        message: `Here is my TaxVault Client ID: ${clientId}\n\nYou can use this ID to connect with me on TaxVault.`,
        title: 'Share Client ID',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const QRModal = () => (
    <Modal
      visible={qrVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setQrVisible(false)}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => setQrVisible(false)}
      >
        <View style={styles.modalContent}>
          <View style={styles.qrContainer}>
            <QRCode
              value={clientId}
              size={250}
              color="black"
              backgroundColor="white"
            />
          </View>
          <Text style={styles.clientIdText}>{clientId}</Text>
          <Text style={styles.clientNameText}>{userName}</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setQrVisible(false)}
          >
            <Icon name="close" size={24} color={colors.white} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  return (
    <>
      <Card variant="elevated" style={styles.card}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Icon name="credit-card" size={20} color={colors.primary[500]} />
            <Text style={styles.title}>Your Client ID</Text>
          </View>
          {showQR && (
            <TouchableOpacity onPress={() => setQrVisible(true)}>
              <Icon name="qrcode" size={24} color={colors.primary[500]} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.idContainer}>
          <Text style={styles.clientId}>{clientId}</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity onPress={copyToClipboard} style={styles.actionButton}>
              <Icon
                name={copied ? 'check' : 'content-copy'}
                size={20}
                color={copied ? colors.success : colors.primary[500]}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={shareClientId} style={styles.actionButton}>
              <Icon name="share-variant" size={20} color={colors.primary[500]} />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.hint}>
          Share this ID with your CA to connect your account
        </Text>
      </Card>

      <QRModal />
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.primary[500],
    marginBottom: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    ...typography.styles.body2,
    color: colors.white,
    marginLeft: spacing.sm,
    opacity: 0.9,
  },
  idContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: spacing.md,
    borderRadius: spacing.radius.md,
    marginBottom: spacing.sm,
  },
  clientId: {
    ...typography.styles.h4,
    color: colors.white,
    fontFamily: 'monospace',
    letterSpacing: 1,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: spacing.xs,
    marginLeft: spacing.sm,
  },
  hint: {
    ...typography.styles.caption,
    color: colors.white,
    opacity: 0.7,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.white,
    padding: spacing.xl,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    maxWidth: '80%',
  },
  qrContainer: {
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderRadius: spacing.radius.md,
    marginBottom: spacing.md,
  },
  clientIdText: {
    ...typography.styles.body1,
    fontFamily: 'monospace',
    fontWeight: typography.weights.semibold,
    marginBottom: spacing.xs,
  },
  clientNameText: {
    ...typography.styles.caption,
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
  closeButton: {
    position: 'absolute',
    top: -spacing.xl,
    right: -spacing.xl,
    backgroundColor: colors.warning,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ClientIDCard;










