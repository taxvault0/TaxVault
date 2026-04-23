import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Switch,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import api from '@/services/api';
import {
  DAY_LABELS,
  OFFICE_HOUR_DAYS,
  DEFAULT_OFFICE_HOURS,
  normalizeOfficeHours,
  updateDaySchedule,
  validateOfficeHours,
} from '@taxvault/shared/officeHours';

const styles = {
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { padding: 16, paddingBottom: 32 },
  pageTitle: { fontSize: 24, fontWeight: '700', color: '#0F172A', marginBottom: 6 },
  pageSubtitle: { fontSize: 14, color: '#64748B', marginBottom: 20 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#0F172A', marginBottom: 12 },
  label: { fontSize: 14, fontWeight: '600', color: '#334155', marginBottom: 6 },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 12,
    color: '#0F172A',
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
  },
  dayCard: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    minHeight: 50,
    borderRadius: 12,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  helper: { color: '#64748B', fontSize: 13, marginBottom: 12 },
  message: { fontSize: 13, marginBottom: 12 },
};

const CAOfficeHoursScreen = () => {
  const [form, setForm] = useState(DEFAULT_OFFICE_HOURS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadOfficeHours = async () => {
      try {
        setLoading(true);

        const response = await api.get('/ca-profile/me/office-hours');

        const officeHours =
          response?.data?.officeHours ||
          response?.data?.data?.officeHours ||
          DEFAULT_OFFICE_HOURS;

        setForm(normalizeOfficeHours(officeHours));
      } catch (error) {
        setForm(DEFAULT_OFFICE_HOURS);
      } finally {
        setLoading(false);
      }
    };

    loadOfficeHours();
  }, []);

  const handleRootChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleDayChange = (day, patch) => {
    setForm((prev) => updateDaySchedule(prev, day, patch));
  };

  const handleSave = async () => {
    setMessage('');

    const validation = validateOfficeHours(form);
    if (!validation.isValid) {
      setMessage('Please fix invalid office hours fields before saving.');
      return;
    }

    try {
      setSaving(true);

      await api.put('/ca-profile/me/office-hours', {
        officeHours: form,
      });

      setMessage('Office hours saved successfully.');
    } catch (error) {
      setMessage(
        error?.response?.data?.message || 'Could not save office hours.'
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.pageTitle}>Office Hours</Text>
      <Text style={styles.pageSubtitle}>
        Set your availability for clients and consultations.
      </Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>General Settings</Text>

        <Text style={styles.label}>Timezone</Text>
        <TextInput
          style={styles.input}
          value={form.timezone}
          onChangeText={(value) => handleRootChange('timezone', value)}
          placeholder="America/Edmonton"
        />

        <Text style={styles.label}>Slot duration (minutes)</Text>
        <TextInput
          style={styles.input}
          value={String(form.slotDurationMinutes ?? '')}
          onChangeText={(value) =>
            handleRootChange('slotDurationMinutes', Number(value || 0))
          }
          keyboardType="numeric"
        />

        <Text style={styles.label}>Buffer (minutes)</Text>
        <TextInput
          style={styles.input}
          value={String(form.bufferMinutes ?? '')}
          onChangeText={(value) =>
            handleRootChange('bufferMinutes', Number(value || 0))
          }
          keyboardType="numeric"
        />

        <Text style={styles.label}>Max advance booking days</Text>
        <TextInput
          style={styles.input}
          value={String(form.maxAdvanceDays ?? '')}
          onChangeText={(value) =>
            handleRootChange('maxAdvanceDays', Number(value || 0))
          }
          keyboardType="numeric"
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Weekly Schedule</Text>
        <Text style={styles.helper}>Enable the days you are available.</Text>

        {OFFICE_HOUR_DAYS.map((day) => {
          const schedule = form.schedules[day];

          return (
            <View key={day} style={styles.dayCard}>
              <View style={styles.rowBetween}>
                <Text style={{ fontSize: 15, fontWeight: '700', color: '#0F172A' }}>
                  {DAY_LABELS[day]}
                </Text>
                <Switch
                  value={!!schedule.enabled}
                  onValueChange={(value) =>
                    handleDayChange(day, { enabled: value })
                  }
                />
              </View>

              {schedule.enabled ? (
                <View style={{ marginTop: 12 }}>
                  <Text style={styles.label}>Start time (HH:MM)</Text>
                  <TextInput
                    style={styles.input}
                    value={schedule.startTime}
                    onChangeText={(value) =>
                      handleDayChange(day, { startTime: value })
                    }
                    placeholder="09:00"
                  />

                  <Text style={styles.label}>End time (HH:MM)</Text>
                  <TextInput
                    style={styles.input}
                    value={schedule.endTime}
                    onChangeText={(value) =>
                      handleDayChange(day, { endTime: value })
                    }
                    placeholder="17:00"
                  />
                </View>
              ) : (
                <Text style={{ marginTop: 12, color: '#94A3B8' }}>Unavailable</Text>
              )}
            </View>
          );
        })}
      </View>

      {!!message && (
        <Text
          style={[
            styles.message,
            { color: message.includes('successfully') ? '#15803D' : '#DC2626' },
          ]}
        >
          {message}
        </Text>
      )}

      <TouchableOpacity style={styles.button} onPress={handleSave} disabled={saving}>
        <Text style={styles.buttonText}>
          {saving ? 'Saving...' : 'Save Office Hours'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default CAOfficeHoursScreen;