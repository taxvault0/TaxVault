import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import ExtractionFieldCard from '@/features/tax/components/ExtractionFieldCard';
import taxExtractionService from '@/features/tax/services/taxExtractionService';

const TaxExtractionReviewScreen = ({ route }) => {
  const documentId = route?.params?.documentId || 'demo-document';
  const jobId = route?.params?.jobId || '';

  const [result, setResult] = useState(null);
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const loadExtraction = useCallback(async (isRefresh = false) => {
    try {
      setError('');

      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const data = jobId
        ? await taxExtractionService.getExtractionResult(jobId)
        : await taxExtractionService.extractDocument(documentId);

      setResult(data);
      setFields(data?.fields || []);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to load extraction');
      setResult(null);
      setFields([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [documentId, jobId]);

  useEffect(() => {
    loadExtraction();
  }, [loadExtraction]);

  const handleChangeValue = (key, value) => {
    setFields((current) =>
      current.map((field) =>
        field.key === key
          ? { ...field, value }
          : field
      )
    );
  };

  const filledCount = useMemo(
    () => fields.filter((field) => String(field.value || '').trim() !== '').length,
    [fields]
  );

  const handleConfirm = async () => {
    try {
      setSubmitting(true);

      const payload = {
        jobId: result?.jobId || '',
        documentId: result?.documentId || documentId,
        documentType: result?.documentType || '',
        status: 'confirmed',
        fields,
      };

      const response = await taxExtractionService.confirmExtraction(payload);

      Alert.alert(
        'Extraction Confirmed',
        response?.message || 'Reviewed tax fields were confirmed successfully.'
      );
    } catch (err) {
      Alert.alert(
        'Confirmation Failed',
        err?.response?.data?.message || err?.message || 'Unable to confirm extraction.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const renderItem = ({ item }) => (
    <ExtractionFieldCard field={item} onChangeValue={handleChangeValue} />
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Tax Extraction Review</Text>
        <Text style={styles.subtitle}>
          Review extracted tax fields before using them in forms
        </Text>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" />
          <Text style={styles.helperText}>Loading extracted fields...</Text>
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text style={styles.errorTitle}>Unable to load extraction</Text>
          <Text style={styles.helperText}>{error}</Text>
        </View>
      ) : (
        <>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>
              {result?.documentType || 'Tax Document'}
            </Text>
            <Text style={styles.summaryText}>
              Status: {result?.status || 'review_required'}
            </Text>
            <Text style={styles.summaryText}>
              Reviewed fields: {filledCount} / {fields.length}
            </Text>
          </View>

          <FlatList
            data={fields}
            keyExtractor={(item, index) => item.key || `field-${index}`}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => loadExtraction(true)}
              />
            }
            ListEmptyComponent={
              <View style={styles.centered}>
                <Text style={styles.errorTitle}>No extracted fields found</Text>
                <Text style={styles.helperText}>
                  Upload or process a document to see extracted values here.
                </Text>
              </View>
            }
          />

          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.confirmButton, submitting && styles.confirmButtonDisabled]}
              onPress={handleConfirm}
              disabled={submitting}
            >
              <Text style={styles.confirmButtonText}>
                {submitting ? 'Saving...' : 'Confirm Extraction'}
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: '#475569',
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 12,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  summaryText: {
    marginTop: 6,
    fontSize: 13,
    color: '#475569',
  },
  listContent: {
    paddingBottom: 24,
  },
  footer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 18,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  confirmButton: {
    height: 50,
    borderRadius: 14,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmButtonDisabled: {
    opacity: 0.7,
  },
  confirmButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  centered: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  helperText: {
    marginTop: 10,
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
  },
});

export default TaxExtractionReviewScreen;