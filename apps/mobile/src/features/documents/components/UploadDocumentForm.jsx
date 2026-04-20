import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

const UploadDocumentForm = ({
  title,
  subtitle,
  documentType,
  helperText,
  fields = [],
  onSubmit,
}) => {
  const navigation = useNavigation();

  const initialState = fields.reduce((acc, field) => {
    acc[field.key] = '';
    return acc;
  }, {});

  const [form, setForm] = useState(initialState);

  const updateField = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async () => {
    const requiredField = fields.find(
      (field) => field.required && !String(form[field.key] || '').trim()
    );

    if (requiredField) {
      Alert.alert('Missing field', `Please fill ${requiredField.label}.`);
      return;
    }

    if (onSubmit) {
      await onSubmit(form);
      return;
    }

    Alert.alert(
      'Document saved',
      `${documentType || 'Document'} details have been saved.`,
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={22} color="#0F172A" />
          </TouchableOpacity>

          <View style={styles.headerTextWrap}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>
        </View>

        <View style={styles.helperCard}>
          <Icon name="file-document-outline" size={24} color="#1D4ED8" />
          <View style={styles.helperContent}>
            <Text style={styles.helperTitle}>{documentType}</Text>
            <Text style={styles.helperText}>{helperText}</Text>
          </View>
        </View>

        <View style={styles.card}>
          {fields.map((field) => {
            const isMultiline = field.multiline;

            return (
              <View key={field.key} style={styles.fieldWrap}>
                <Text style={styles.label}>
                  {field.label}
                  {field.required ? ' *' : ''}
                </Text>

                <TextInput
                  style={[styles.input, isMultiline && styles.textArea]}
                  placeholder={field.placeholder || `Enter ${field.label}`}
                  placeholderTextColor="#94A3B8"
                  value={form[field.key]}
                  onChangeText={(value) => updateField(field.key, value)}
                  keyboardType={field.keyboardType || 'default'}
                  multiline={isMultiline}
                  numberOfLines={isMultiline ? 4 : 1}
                  textAlignVertical={isMultiline ? 'top' : 'center'}
                />
              </View>
            );
          })}
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Document File</Text>

          <TouchableOpacity style={styles.uploadBox}>
            <Icon name="cloud-upload-outline" size={28} color="#1D4ED8" />
            <Text style={styles.uploadTitle}>Attach PDF, image, or slip</Text>
            <Text style={styles.uploadText}>
              Connect this later to camera upload or document picker.
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
          <Icon name="content-save-outline" size={20} color="#FFFFFF" />
          <Text style={styles.saveButtonText}>Save {documentType}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default UploadDocumentForm;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 18,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginRight: 12,
  },
  headerTextWrap: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
    color: '#475569',
  },
  helperCard: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  helperContent: {
    flex: 1,
  },
  helperTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E3A8A',
    marginBottom: 4,
  },
  helperText: {
    fontSize: 13,
    lineHeight: 19,
    color: '#1E40AF',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 16,
  },
  fieldWrap: {
    marginBottom: 14,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },
  input: {
    minHeight: 50,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 14,
    color: '#0F172A',
    backgroundColor: '#F8FAFC',
  },
  textArea: {
    minHeight: 110,
    paddingTop: 12,
  },
  uploadBox: {
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
    borderStyle: 'dashed',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
  },
  uploadTitle: {
    marginTop: 10,
    fontSize: 15,
    fontWeight: '700',
    color: '#1E3A8A',
  },
  uploadText: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 19,
    color: '#1E40AF',
    textAlign: 'center',
  },
  saveButton: {
    height: 54,
    borderRadius: 14,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});


