import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const UploadT4Screen = () => {
  const navigation = useNavigation();
  const [files, setFiles] = useState([]);

  const addFile = (file) => {
    if (!file?.uri) return;

    const normalized = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: file.name || `document-${Date.now()}.jpg`,
      uri: file.uri,
      mimeType: file.mimeType || 'image/jpeg',
      size: file.size || 0,
      source: file.source || 'file',
    };

    setFiles((prev) => [normalized, ...prev]);
  };

  const pickFromFiles = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets?.length > 0) {
        const asset = result.assets[0];
        addFile({
          name: asset.name,
          uri: asset.uri,
          mimeType: asset.mimeType,
          size: asset.size,
          source: 'files',
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to open file picker.');
    }
  };

  const takePhoto = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          'Camera permission needed',
          'Please allow camera access to capture your T4.'
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.9,
      });

      if (!result.canceled && result.assets?.length > 0) {
        const asset = result.assets[0];
        addFile({
          name: `t4-photo-${Date.now()}.jpg`,
          uri: asset.uri,
          mimeType: 'image/jpeg',
          size: asset.fileSize || 0,
          source: 'camera',
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to open camera.');
    }
  };

  const openSourcePicker = () => {
    Alert.alert('Add T4 Document', 'Choose how you want to add your T4.', [
      { text: 'Choose from Files', onPress: pickFromFiles },
      { text: 'Take Photo', onPress: takePhoto },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const removeFile = (id) => {
    setFiles((prev) => prev.filter((item) => item.id !== id));
  };

  const getFileTypeLabel = (item) => {
    const lower = item.name?.toLowerCase() || '';
    const mime = item.mimeType?.toLowerCase() || '';

    if (mime.includes('pdf') || lower.endsWith('.pdf')) return 'PDF Document';
    if (item.source === 'camera') return 'Camera Photo';
    if (mime.includes('image')) return 'Image File';
    return 'Document';
  };

  const getFileIcon = (item) => {
    const lower = item.name?.toLowerCase() || '';
    const mime = item.mimeType?.toLowerCase() || '';

    if (mime.includes('pdf') || lower.endsWith('.pdf')) {
      return { name: 'file-pdf-box', color: '#DC2626' };
    }

    if (item.source === 'camera') {
      return { name: 'camera-outline', color: '#2563EB' };
    }

    return { name: 'file-image-outline', color: '#2563EB' };
  };

  const renderFileItem = ({ item }) => {
    const icon = getFileIcon(item);

    return (
      <View style={styles.fileItem}>
        <View style={styles.fileLeft}>
          <View style={styles.fileIconWrap}>
            <Icon name={icon.name} size={22} color={icon.color} />
          </View>

          <View style={styles.fileMeta}>
            <Text numberOfLines={1} style={styles.fileName}>
              {item.name}
            </Text>
            <Text style={styles.fileType}>{getFileTypeLabel(item)}</Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => removeFile(item.id)}
          style={styles.removeBtn}
        >
          <Text style={styles.remove}>Remove</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerCard}>
        <Text style={styles.title}>Upload T4</Text>
        <Text style={styles.subtitle}>
          Upload your employment income slip using files or camera.
        </Text>
      </View>

      <View style={styles.actionCard}>
        <TouchableOpacity style={styles.primaryButton} onPress={openSourcePicker}>
          <Icon name="plus-circle-outline" size={20} color="#fff" />
          <Text style={styles.primaryButtonText}>Add T4 Document</Text>
        </TouchableOpacity>

        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickButton} onPress={pickFromFiles}>
            <Icon name="file-document-outline" size={20} color="#0F172A" />
            <Text style={styles.quickButtonText}>Files</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickButton} onPress={takePhoto}>
            <Icon name="camera-outline" size={20} color="#0F172A" />
            <Text style={styles.quickButtonText}>Camera</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.listCard}>
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>Uploaded Files</Text>
          <Text style={styles.countBadge}>{files.length}</Text>
        </View>

        <FlatList
          data={files}
          keyExtractor={(item) => item.id}
          renderItem={renderFileItem}
          contentContainerStyle={
            files.length === 0 ? styles.emptyListContent : styles.listContent
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Icon name="cloud-upload-outline" size={34} color="#94A3B8" />
              <Text style={styles.emptyTitle}>No T4 uploaded yet</Text>
              <Text style={styles.emptyText}>
                Add your T4 from files or take a photo.
              </Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      </View>

      <TouchableOpacity
        style={[styles.nextButton, files.length === 0 && styles.nextButtonDisabled]}
        onPress={() => navigation.navigate('Deductions')}
        disabled={files.length === 0}
      >
        <Text style={styles.nextText}>Continue to Deductions</Text>
        <Icon name="arrow-right" size={18} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

export default UploadT4Screen;


