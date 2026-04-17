import React, { useMemo, useState } from 'react';
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
import { useNavigation, useRoute } from '@react-navigation/native';
import receiptCategories from '@/features/receipts/constants/receiptCategories';

const AddReceiptScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const initialCategory = route?.params?.category?.key || route?.params?.category || 'fuel';

  const [form, setForm] = useState({
    title: '',
    amount: '',
    date: '',
    vendor: '',
    notes: '',
    category: initialCategory,
  });

  const selectedCategory = useMemo(
    () => receiptCategories.find((item) => item.key === form.category),
    [form.category]
  );

  const updateField = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = () => {
    if (!form.title.trim()) {
      Alert.alert('Missing title', 'Please enter a receipt title.');
      return;
    }

    if (!form.amount.trim()) {
      Alert.alert('Missing amount', 'Please enter the receipt amount.');
      return;
    }

    Alert.alert(
      'Receipt saved',
      `${form.title} has been added under ${selectedCategory?.label || 'Receipt'}.`,
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
            <Text style={styles.title}>Add Receipt</Text>
            <Text style={styles.subtitle}>
              Store and organize your expense proof for tax filing.
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Category</Text>
          <View style={styles.categoryWrap}>
            {receiptCategories.map((item) => {
              const active = form.category === item.key;

              return (
                <TouchableOpacity
                  key={item.key}
                  style={[styles.categoryChip, active && styles.categoryChipActive]}
                  onPress={() => updateField('category', item.key)}
                >
                  <Icon
                    name={item.icon}
                    size={16}
                    color={active ? '#FFFFFF' : '#334155'}
                  />
                  <Text
                    style={[
                      styles.categoryChipText,
                      active && styles.categoryChipTextActive,
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Receipt Title</Text>
          <TextInput
            style={styles.input}
            placeholder="Example: Shell Gas Station"
            placeholderTextColor="#94A3B8"
            value={form.title}
            onChangeText={(value) => updateField('title', value)}
          />

          <Text style={styles.label}>Amount</Text>
          <TextInput
            style={styles.input}
            placeholder="Example: 74.82"
            placeholderTextColor="#94A3B8"
            keyboardType="decimal-pad"
            value={form.amount}
            onChangeText={(value) => updateField('amount', value)}
          />

          <Text style={styles.label}>Date</Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#94A3B8"
            value={form.date}
            onChangeText={(value) => updateField('date', value)}
          />

          <Text style={styles.label}>Vendor / Merchant</Text>
          <TextInput
            style={styles.input}
            placeholder="Example: Shell Canada"
            placeholderTextColor="#94A3B8"
            value={form.vendor}
            onChangeText={(value) => updateField('vendor', value)}
          />

          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Optional notes"
            placeholderTextColor="#94A3B8"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            value={form.notes}
            onChangeText={(value) => updateField('notes', value)}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Attachment</Text>

          <TouchableOpacity style={styles.uploadBox}>
            <Icon name="paperclip" size={24} color="#1D4ED8" />
            <Text style={styles.uploadTitle}>Attach image or PDF</Text>
            <Text style={styles.uploadText}>
              Connect this later to camera, gallery, or document picker.
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Icon name="content-save-outline" size={20} color="#FFFFFF" />
          <Text style={styles.saveButtonText}>Save Receipt</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddReceiptScreen;

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
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 14,
    color: '#0F172A',
    backgroundColor: '#F8FAFC',
    marginBottom: 14,
  },
  textArea: {
    minHeight: 110,
    paddingTop: 12,
  },
  categoryWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  categoryChipActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  categoryChipTextActive: {
    color: '#FFFFFF',
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


