import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import Header from '@/components/layout/AppHeader';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { colors } from '@/styles/theme';
import { typography } from '@/styles/theme';
import { spacing } from '@/styles/theme';

const ReceiptDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { id, imageUri, isNew } = route.params || {};

  const [isEditing, setIsEditing] = useState(isNew || false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Sample data - replace with API fetch
  const [receipt, setReceipt] = useState({
    id: id || '1',
    vendor: 'Shell',
    amount: 45.23,
    date: '2024-03-15',
    category: 'fuel',
    status: 'pending',
    gst: 2.26,
    pst: 0,
    hst: 0,
    paymentMethod: 'Credit Card',
    notes: 'Business meeting fuel',
    imageUrl: imageUri || 'https://via.placeholder.com/400',
    ocrData: {
      confidence: 95,
      extracted: true,
    },
    metadata: {
      fileSize: '245 KB',
      fileType: 'image/jpeg',
      uploadedAt: '2024-03-15T10:30:00Z',
    },
  });

  const [editedReceipt, setEditedReceipt] = useState({ ...receipt });

  const categories = [
    { id: 'fuel', label: 'Fuel', icon: 'gas-station' },
    { id: 'maintenance', label: 'Maintenance', icon: 'wrench' },
    { id: 'insurance', label: 'Insurance', icon: 'shield' },
    { id: 'office-supplies', label: 'Office Supplies', icon: 'briefcase' },
    { id: 'internet', label: 'Internet', icon: 'wifi' },
    { id: 'rent', label: 'Rent', icon: 'home' },
    { id: 'utilities', label: 'Utilities', icon: 'flash' },
    { id: 'meals', label: 'Meals', icon: 'food' },
    { id: 'software', label: 'Software', icon: 'laptop' },
    { id: 'advertising', label: 'Advertising', icon: 'megaphone' },
    { id: 'transportation', label: 'Transportation', icon: 'car' },
    { id: 'other', label: 'Other', icon: 'dots-horizontal' },
  ];

  const paymentMethods = [
    'Credit Card',
    'Debit Card',
    'Cash',
    'Cheque',
    'Interac',
    'PayPal',
    'Other',
  ];

  const handleSave = async () => {
    setSaving(true);
    try {
      // API call to save receipt
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API
      
      setReceipt(editedReceipt);
      setIsEditing(false);
      
      Alert.alert('Success', 'Receipt saved successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to save receipt');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Receipt',
      'Are you sure you want to delete this receipt?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          onPress: async () => {
            setLoading(true);
            try {
              // API call to delete receipt
              await new Promise(resolve => setTimeout(resolve, 1000));
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete receipt');
              setLoading(false);
            }
          },
          style: 'destructive'
        },
      ]
    );
  };

  const handleShare = () => {
    // Implement share functionality
    Alert.alert('Share', 'Share receipt with CA or export');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-CA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.white, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
        <Text style={[typography.styles.body1, { marginTop: spacing.md }]}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <Header 
        title="Receipt Details" 
        showBack 
        rightIcon={!isEditing ? "pencil" : undefined}
        onRightPress={!isEditing ? () => setIsEditing(true) : undefined}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing['2xl'] }}>
        {/* Receipt Image */}
        <View style={{ backgroundColor: colors.black, height: 200 }}>
          <Image 
            source={{ uri: receipt.imageUrl }} 
            style={{ width: '100%', height: '100%' }}
            resizeMode="contain"
          />
          <TouchableOpacity
            style={{
              position: 'absolute',
              bottom: spacing.md,
              right: spacing.md,
              backgroundColor: colors.white,
              borderRadius: spacing.radius.full,
              padding: spacing.sm,
              ...shadows.md,
            }}
            onPress={() => navigation.navigate('Camera', { imageUri: receipt.imageUrl })}
          >
            <Icon name="camera-retake" size={20} color={colors.primary[500]} />
          </TouchableOpacity>
        </View>

        {/* OCR Confidence Badge */}
        {receipt.ocrData?.extracted && (
          <View style={{
            position: 'absolute',
            top: 60,
            right: spacing.lg,
            backgroundColor: colors.success.light,
            borderRadius: spacing.radius.full,
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.xs,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
            <Icon name="check-circle" size={14} color={colors.success.main} />
            <Text style={[typography.styles.caption, { color: colors.success.main, marginLeft: 4 }]}>
              OCR {receipt.ocrData.confidence}%
            </Text>
          </View>
        )}

        {/* Status Badge */}
        <View style={{ position: 'absolute', top: 60, left: spacing.lg }}>
          <Badge status={receipt.status} />
        </View>

        {/* Main Content */}
        <View style={{ padding: spacing.lg }}>
          {/* Vendor and Amount */}
          <Card style={{ marginBottom: spacing.lg }}>
            <Card.Body>
              {isEditing ? (
                <View>
                  <Text style={[typography.styles.caption, { color: colors.text.secondary, marginBottom: spacing.xs }]}>
                    Vendor
                  </Text>
                  <TextInput
                    style={{
                      borderWidth: 1,
                      borderColor: colors.gray[300],
                      borderRadius: spacing.radius.md,
                      padding: spacing.md,
                      fontSize: typography.sizes.lg,
                      fontWeight: typography.weights.semibold,
                      marginBottom: spacing.md,
                    }}
                    value={editedReceipt.vendor}
                    onChangeText={(text) => setEditedReceipt({ ...editedReceipt, vendor: text })}
                    placeholder="Vendor name"
                  />
                  
                  <Text style={[typography.styles.caption, { color: colors.text.secondary, marginBottom: spacing.xs }]}>
                    Amount
                  </Text>
                  <TextInput
                    style={{
                      borderWidth: 1,
                      borderColor: colors.gray[300],
                      borderRadius: spacing.radius.md,
                      padding: spacing.md,
                      fontSize: typography.sizes['2xl'],
                      fontWeight: typography.weights.bold,
                    }}
                    value={editedReceipt.amount.toString()}
                    onChangeText={(text) => setEditedReceipt({ ...editedReceipt, amount: parseFloat(text) || 0 })}
                    keyboardType="decimal-pad"
                    placeholder="0.00"
                  />
                </View>
              ) : (
                <View style={{ alignItems: 'center' }}>
                  <Text style={[typography.styles.caption, { color: colors.text.secondary }]}>Vendor</Text>
                  <Text style={[typography.styles.h4, { marginTop: spacing.xs }]}>{receipt.vendor}</Text>
                  <Text style={[typography.styles.h2, { color: colors.primary[500], marginTop: spacing.md }]}>
                    ${receipt.amount.toFixed(2)}
                  </Text>
                </View>
              )}
            </Card.Body>
          </Card>

          {/* Details Grid */}
          <Card style={{ marginBottom: spacing.lg }}>
            <Card.Header>
              <Text style={[typography.styles.h6]}>Receipt Details</Text>
            </Card.Header>
            <Card.Body>
              {/* Date */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Icon name="calendar" size={20} color={colors.gray[400]} />
                  <Text style={[typography.styles.body2, { marginLeft: spacing.sm, color: colors.text.secondary }]}>
                    Date
                  </Text>
                </View>
                {isEditing ? (
                  <TouchableOpacity>
                    <Text style={{ color: colors.primary[500] }}>Change</Text>
                  </TouchableOpacity>
                ) : (
                  <Text style={[typography.styles.body1, { fontWeight: typography.weights.medium }]}>
                    {formatDate(receipt.date)}
                  </Text>
                )}
              </View>

              {/* Category */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Icon name="tag" size={20} color={colors.gray[400]} />
                  <Text style={[typography.styles.body2, { marginLeft: spacing.sm, color: colors.text.secondary }]}>
                    Category
                  </Text>
                </View>
                {isEditing ? (
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {categories.map(cat => (
                      <TouchableOpacity
                        key={cat.id}
                        style={{
                          paddingHorizontal: spacing.md,
                          paddingVertical: spacing.xs,
                          borderRadius: spacing.radius.full,
                          backgroundColor: editedReceipt.category === cat.id ? colors.primary[500] : colors.gray[100],
                          marginRight: spacing.sm,
                        }}
                        onPress={() => setEditedReceipt({ ...editedReceipt, category: cat.id })}
                      >
                        <Text style={{
                          color: editedReceipt.category === cat.id ? colors.white : colors.text.secondary,
                          fontSize: typography.sizes.sm,
                        }}>
                          {cat.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                ) : (
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Icon 
                      name={categories.find(c => c.id === receipt.category)?.icon || 'receipt'} 
                      size={18} 
                      color={colors.primary[500]} 
                    />
                    <Text style={[typography.styles.body1, { marginLeft: spacing.xs, fontWeight: typography.weights.medium }]}>
                      {categories.find(c => c.id === receipt.category)?.label || receipt.category}
                    </Text>
                  </View>
                )}
              </View>

              {/* Tax Details */}
              <View style={{ backgroundColor: colors.gray[50], padding: spacing.md, borderRadius: spacing.radius.md, marginTop: spacing.sm }}>
                <Text style={[typography.styles.caption, { color: colors.text.secondary, marginBottom: spacing.sm }]}>
                  Tax Breakdown
                </Text>
                
                {isEditing ? (
                  <View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm }}>
                      <Text style={[typography.styles.body2, { flex: 1 }]}>GST (5%)</Text>
                      <TextInput
                        style={{
                          width: 100,
                          borderWidth: 1,
                          borderColor: colors.gray[300],
                          borderRadius: spacing.radius.md,
                          padding: spacing.xs,
                          textAlign: 'right',
                        }}
                        value={editedReceipt.gst.toString()}
                        onChangeText={(text) => setEditedReceipt({ ...editedReceipt, gst: parseFloat(text) || 0 })}
                        keyboardType="decimal-pad"
                      />
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm }}>
                      <Text style={[typography.styles.body2, { flex: 1 }]}>PST (8%)</Text>
                      <TextInput
                        style={{
                          width: 100,
                          borderWidth: 1,
                          borderColor: colors.gray[300],
                          borderRadius: spacing.radius.md,
                          padding: spacing.xs,
                          textAlign: 'right',
                        }}
                        value={editedReceipt.pst.toString()}
                        onChangeText={(text) => setEditedReceipt({ ...editedReceipt, pst: parseFloat(text) || 0 })}
                        keyboardType="decimal-pad"
                      />
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={[typography.styles.body2, { flex: 1 }]}>HST (13%)</Text>
                      <TextInput
                        style={{
                          width: 100,
                          borderWidth: 1,
                          borderColor: colors.gray[300],
                          borderRadius: spacing.radius.md,
                          padding: spacing.xs,
                          textAlign: 'right',
                        }}
                        value={editedReceipt.hst.toString()}
                        onChangeText={(text) => setEditedReceipt({ ...editedReceipt, hst: parseFloat(text) || 0 })}
                        keyboardType="decimal-pad"
                      />
                    </View>
                  </View>
                ) : (
                  <View>
                    {receipt.gst > 0 && (
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xs }}>
                        <Text style={typography.styles.body2}>GST (5%)</Text>
                        <Text style={[typography.styles.body2, { fontWeight: typography.weights.medium }]}>
                          ${receipt.gst.toFixed(2)}
                        </Text>
                      </View>
                    )}
                    {receipt.pst > 0 && (
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xs }}>
                        <Text style={typography.styles.body2}>PST (8%)</Text>
                        <Text style={[typography.styles.body2, { fontWeight: typography.weights.medium }]}>
                          ${receipt.pst.toFixed(2)}
                        </Text>
                      </View>
                    )}
                    {receipt.hst > 0 && (
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xs }}>
                        <Text style={typography.styles.body2}>HST (13%)</Text>
                        <Text style={[typography.styles.body2, { fontWeight: typography.weights.medium }]}>
                          ${receipt.hst.toFixed(2)}
                        </Text>
                      </View>
                    )}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.sm, paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: colors.gray[200] }}>
                      <Text style={[typography.styles.body1, { fontWeight: typography.weights.semibold }]}>Total Tax</Text>
                      <Text style={[typography.styles.body1, { fontWeight: typography.weights.semibold, color: colors.primary[500] }]}>
                        ${(receipt.gst + receipt.pst + receipt.hst).toFixed(2)}
                      </Text>
                    </View>
                  </View>
                )}
              </View>

              {/* Payment Method */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.md }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Icon name="credit-card" size={20} color={colors.gray[400]} />
                  <Text style={[typography.styles.body2, { marginLeft: spacing.sm, color: colors.text.secondary }]}>
                    Payment Method
                  </Text>
                </View>
                {isEditing ? (
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {paymentMethods.map(method => (
                      <TouchableOpacity
                        key={method}
                        style={{
                          paddingHorizontal: spacing.md,
                          paddingVertical: spacing.xs,
                          borderRadius: spacing.radius.full,
                          backgroundColor: editedReceipt.paymentMethod === method ? colors.primary[500] : colors.gray[100],
                          marginRight: spacing.sm,
                        }}
                        onPress={() => setEditedReceipt({ ...editedReceipt, paymentMethod: method })}
                      >
                        <Text style={{
                          color: editedReceipt.paymentMethod === method ? colors.white : colors.text.secondary,
                          fontSize: typography.sizes.sm,
                        }}>
                          {method}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                ) : (
                  <Text style={[typography.styles.body1, { fontWeight: typography.weights.medium }]}>
                    {receipt.paymentMethod}
                  </Text>
                )}
              </View>

              {/* Notes */}
              <View style={{ marginTop: spacing.md }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.xs }}>
                  <Icon name="note-text" size={20} color={colors.gray[400]} />
                  <Text style={[typography.styles.body2, { marginLeft: spacing.sm, color: colors.text.secondary }]}>
                    Notes
                  </Text>
                </View>
                {isEditing ? (
                  <TextInput
                    style={{
                      borderWidth: 1,
                      borderColor: colors.gray[300],
                      borderRadius: spacing.radius.md,
                      padding: spacing.md,
                      minHeight: 80,
                      textAlignVertical: 'top',
                    }}
                    value={editedReceipt.notes}
                    onChangeText={(text) => setEditedReceipt({ ...editedReceipt, notes: text })}
                    placeholder="Add notes..."
                    multiline
                    numberOfLines={4}
                  />
                ) : (
                  <Text style={[typography.styles.body2, { color: colors.gray[600], lineHeight: 20 }]}>
                    {receipt.notes || 'No notes added'}
                  </Text>
                )}
              </View>
            </Card.Body>
          </Card>

          {/* Metadata */}
          <Card style={{ marginBottom: spacing.lg }}>
            <Card.Body>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xs }}>
                <Text style={[typography.styles.caption, { color: colors.text.secondary }]}>File Size</Text>
                <Text style={[typography.styles.caption]}>{receipt.metadata?.fileSize}</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xs }}>
                <Text style={[typography.styles.caption, { color: colors.text.secondary }]}>File Type</Text>
                <Text style={[typography.styles.caption]}>{receipt.metadata?.fileType}</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={[typography.styles.caption, { color: colors.text.secondary }]}>Uploaded</Text>
                <Text style={[typography.styles.caption]}>
                  {new Date(receipt.metadata?.uploadedAt).toLocaleString()}
                </Text>
              </View>
            </Card.Body>
          </Card>

          {/* Action Buttons */}
          {isEditing ? (
            <View style={{ flexDirection: 'row', gap: spacing.md }}>
              <Button
                variant="outline"
                onPress={() => {
                  setEditedReceipt(receipt);
                  setIsEditing(false);
                }}
                style={{ flex: 1 }}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onPress={handleSave}
                style={{ flex: 1 }}
                loading={saving}
              >
                Save
              </Button>
            </View>
          ) : (
            <View style={{ flexDirection: 'row', gap: spacing.md }}>
              <Button
                variant="outline"
                onPress={handleShare}
                icon={<Icon name="share" size={20} color={colors.primary[500]} />}
                style={{ flex: 1 }}
              >
                Share
              </Button>
              <Button
                variant="warning"
                onPress={handleDelete}
                icon={<Icon name="delete" size={20} color={colors.white} />}
                style={{ flex: 1 }}
              >
                Delete
              </Button>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ReceiptDetailScreen;





