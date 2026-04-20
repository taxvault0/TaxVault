// CameraScreen.jsx (UPDATED PREMIUM SCANNER UI)

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
  Animated,
  Easing,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const CameraScreen = ({ navigation, route }) => {
  const params = route?.params || {};

  const [permission, requestPermission] = useCameraPermissions();
  const [galleryPermission, setGalleryPermission] = useState(null);
  const [facing, setFacing] = useState('back');
  const [flash, setFlash] = useState('off');
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const scanAnim = useRef(new Animated.Value(0)).current;

  const title = useMemo(() => {
    if (params?.documentType === 'receipt') return 'Scan Receipt';
    if (params?.documentType === 'document') return 'Capture Document';
    return 'Camera';
  }, [params]);

  // 🎬 Scan line animation
  useEffect(() => {
    Animated.loop(
      Animated.timing(scanAnim, {
        toValue: 1,
        duration: 2200,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  useEffect(() => {
    const askGalleryPermission = async () => {
      const result = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setGalleryPermission(result);
    };
    askGalleryPermission();
  }, []);

  const handleTakePhoto = async () => {
    if (!cameraRef || isCapturing) return;

    try {
      setIsCapturing(true);

      const photo = await cameraRef.takePictureAsync({
        quality: 0.9,
      });

      if (photo?.uri) {
        setCapturedPhoto(photo);
      }
    } catch (error) {
      Alert.alert('Camera Error', 'Could not capture photo.');
    } finally {
      setIsCapturing(false);
    }
  };

  const handlePickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.length) {
      setCapturedPhoto({
        uri: result.assets[0].uri,
      });
    }
  };

  const handleUsePhoto = () => {
    const payload = { uri: capturedPhoto?.uri };

    navigation.navigate('UploadChecklist', { capturedFile: payload });
  };

  const handleRetake = () => setCapturedPhoto(null);

  const toggleFacing = () =>
    setFacing((current) => (current === 'back' ? 'front' : 'back'));

  const toggleFlash = () =>
    setFlash((current) => (current === 'off' ? 'on' : 'off'));

  if (!permission?.granted) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: '#000' }}>Enable Camera</Text>
        <TouchableOpacity onPress={requestPermission}>
          <Text>Allow</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (capturedPhoto?.uri) {
    return (
      <View style={styles.previewContainer}>
        <Image source={{ uri: capturedPhoto.uri }} style={styles.previewImage} />

        <View style={styles.previewOverlay}>
          <View style={styles.previewButtonsRow}>
            <TouchableOpacity style={styles.secondaryButtonFlex} onPress={handleRetake}>
              <Text>Retake</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.primaryButtonFlex} onPress={handleUsePhoto}>
              <Text style={{ color: '#fff' }}>Use Photo</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  // 🎯 Scan line translate
  const translateY = scanAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-150, 150],
  });

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} flash={flash} ref={setCameraRef}>

        {/* TOP BAR */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={22} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.title}>{title}</Text>

          <TouchableOpacity onPress={toggleFlash}>
            <Icon name={flash === 'on' ? 'flash' : 'flash-off'} size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* SCANNER FRAME */}
        <View style={styles.scanContainer}>
          <View style={styles.scanFrame}>

            {/* 🔥 Glowing corners */}
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />

            {/* 🎬 Scan line */}
            <Animated.View
              style={[
                styles.scanLine,
                {
                  transform: [{ translateY }],
                },
              ]}
            />
          </View>
        </View>

        {/* BOTTOM BAR */}
        <View style={styles.bottomBar}>
          <TouchableOpacity onPress={handlePickFromGallery}>
            <Icon name="image-outline" size={26} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.captureButtonOuter} onPress={handleTakePhoto}>
            <View style={styles.captureButtonInner}>
              {isCapturing ? (
                <ActivityIndicator />
              ) : (
                <Icon name="camera" size={26} color="#2563EB" />
              )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={toggleFacing}>
            <Icon name="camera-flip-outline" size={26} color="#fff" />
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
};

export default CameraScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  camera: { flex: 1 },

  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 20,
  },

  title: { color: '#fff', fontWeight: '800', fontSize: 18 },

  scanContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // 📄 RECEIPT SHAPE (tall)
  scanFrame: {
    width: '85%',
    height: '70%', // 👈 taller frame like receipt
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    overflow: 'hidden',
  },

  // 🔥 glowing corners
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: '#00E5FF',
  },

  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
  },

  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
  },

  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
  },

  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
  },

  // 🎬 scan line
  scanLine: {
    position: 'absolute',
    width: '100%',
    height: 2,
    backgroundColor: '#00E5FF',
    opacity: 0.8,
  },

  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: 40,
  },

  captureButtonOuter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },

  previewContainer: { flex: 1, backgroundColor: '#000' },
  previewImage: { flex: 1, resizeMode: 'contain' },

  previewOverlay: {
    backgroundColor: '#fff',
    padding: 20,
  },

  previewButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  secondaryButtonFlex: {
    padding: 12,
    backgroundColor: '#ddd',
    borderRadius: 10,
  },

  primaryButtonFlex: {
    padding: 12,
    backgroundColor: '#2563EB',
    borderRadius: 10,
  },
});