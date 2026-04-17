import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, CameraView } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '@/components/layout/AppHeader';
import Button from '@/components/ui/Button';
import { colors } from '@/styles/theme';
import { typography } from '@/styles/theme';
import { spacing } from '@/styles/theme';
import api from '@/services/api';

const QRScannerScreen = () => {
  const navigation = useNavigation();
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };
    getCameraPermissions();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    if (scanned) return;
    
    setScanned(true);
    setScanning(true);

    try {
      // Validate that the scanned data looks like a client ID
      const clientIdPattern = /^TV-\d{4}-[A-F0-9]{6}$/;
      
      if (!clientIdPattern.test(data)) {
        Alert.alert(
          'Invalid QR Code',
          'This doesn\'t appear to be a valid TaxVault Client ID.',
          [{ text: 'OK', onPress: () => setScanned(false) }]
        );
        setScanning(false);
        return;
      }

      // Search for client
      const response = await api.get(`/users/client/${data}`);
      
      Alert.alert(
        'Client Found',
        `Found client: ${response.data.user.name}`,
        [
          { text: 'Cancel', style: 'cancel', onPress: () => setScanned(false) },
          { 
            text: 'View Client', 
            onPress: () => {
              navigation.navigate('ClientDetail', { clientId: response.data.user.id });
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert(
        'Client Not Found',
        'No client found with this QR code.',
        [{ text: 'OK', onPress: () => setScanned(false) }]
      );
    } finally {
      setScanning(false);
    }
  };

  if (hasPermission === null) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Requesting camera permission...</Text>
      </SafeAreaView>
    );
  }

  if (hasPermission === false) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Icon name="camera-off" size={64} color={colors.gray[400]} />
        <Text style={[typography.styles.h5, { textAlign: 'center', marginTop: spacing.md }]}>
          No access to camera
        </Text>
        <Text style={[typography.styles.caption, { color: colors.text.secondary, textAlign: 'center', marginTop: spacing.sm }]}>
          Please enable camera permissions in settings
        </Text>
        <Button
          variant="primary"
          onPress={() => navigation.goBack()}
          style={{ marginTop: spacing.xl }}
        >
          Go Back
        </Button>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.black }}>
      <Header title="Scan QR Code" showBack />

      <CameraView
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Scanner Overlay */}
      <View style={styles.overlay}>
        <View style={styles.scanArea}>
          <View style={styles.corner} />
          <View style={[styles.corner, styles.cornerTopRight]} />
          <View style={[styles.corner, styles.cornerBottomLeft]} />
          <View style={[styles.corner, styles.cornerBottomRight]} />
        </View>
        <Text style={styles.instruction}>
          Position the QR code within the frame
        </Text>
      </View>

      {scanned && (
        <View style={styles.rescanButton}>
          <Button
            variant="primary"
            onPress={() => setScanned(false)}
            loading={scanning}
          >
            Scan Again
          </Button>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: 250,
    height: 250,
    backgroundColor: 'transparent',
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: colors.white,
    borderWidth: 3,
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  cornerTopRight: {
    right: 0,
    left: undefined,
    borderLeftWidth: 0,
    borderRightWidth: 3,
  },
  cornerBottomLeft: {
    bottom: 0,
    top: undefined,
    borderTopWidth: 0,
    borderBottomWidth: 3,
  },
  cornerBottomRight: {
    bottom: 0,
    right: 0,
    top: undefined,
    left: undefined,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderRightWidth: 3,
    borderBottomWidth: 3,
  },
  instruction: {
    color: colors.white,
    fontSize: typography.sizes.base,
    marginTop: spacing.xl,
    textAlign: 'center',
  },
  rescanButton: {
    position: 'absolute',
    bottom: spacing['3xl'],
    left: spacing.lg,
    right: spacing.lg,
  },
});

export default QRScannerScreen;



