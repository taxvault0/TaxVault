import React, {  useState  } from 'react';
import { useTheme } from '@/core/providers/ThemeContext';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import Header from '@/components/layout/AppHeader';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { colors, spacing, typography, borderRadius } from '@/styles/theme';
import api from '@/services/api';

const ClientSearchScreen = () => {
  const navigation = useNavigation();
  const [searchMethod, setSearchMethod] = useState('manual');
  const [clientId, setClientId] = useState('');
  const [searching, setSearching] = useState(false);
  const [foundClient, setFoundClient] = useState(null);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!clientId.trim()) {
      setError('Please enter a Client ID');
      return;
    }

    setSearching(true);
    setError('');
    setFoundClient(null);

    try {
      const response = await api.get(`/users/client/${clientId.trim()}`);
      setFoundClient(response.data.user);
    } catch (err) {
      setError(err.response?.data?.message || 'Client not found');
    } finally {
      setSearching(false);
    }
  };

  const handleConnect = () => {
    if (foundClient) {
      navigation.navigate('ClientDetail', { clientId: foundClient.id });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <Header title="Find Client" showBack />

      <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
        {/* Search Method Toggle */}
        <View style={{ flexDirection: 'row', marginBottom: spacing.lg }}>
          <TouchableOpacity
            onPress={() => setSearchMethod('manual')}
            style={{
              flex: 1,
              alignItems: 'center',
              padding: spacing.md,
              backgroundColor: searchMethod === 'manual' ? colors.primary[500] : colors.gray[100],
              borderTopLeftRadius: spacing.radius.md,
              borderBottomLeftRadius: spacing.radius.md,
            }}
          >
            <Icon
              name="magnify"
              size={24}
              color={searchMethod === 'manual' ? colors.white : colors.gray[600]}
            />
            <Text style={{
              color: searchMethod === 'manual' ? colors.white : colors.gray[600],
              marginTop: spacing.xs,
            }}>
              Manual Entry
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSearchMethod('scan')}
            style={{
              flex: 1,
              alignItems: 'center',
              padding: spacing.md,
              backgroundColor: searchMethod === 'scan' ? colors.primary[500] : colors.gray[100],
              borderTopRightRadius: spacing.radius.md,
              borderBottomRightRadius: spacing.radius.md,
            }}
          >
            <Icon
              name="qrcode-scan"
              size={24}
              color={searchMethod === 'scan' ? colors.white : colors.gray[600]}
            />
            <Text style={{
              color: searchMethod === 'scan' ? colors.white : colors.gray[600],
              marginTop: spacing.xs,
            }}>
              Scan QR Code
            </Text>
          </TouchableOpacity>
        </View>

        {searchMethod === 'manual' && (
          <Card>
            <Card.Body>
              <Text style={[typography.styles.caption, { color: colors.text.secondary, marginBottom: spacing.xs }]}>
                Client ID
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: error ? colors.warning : colors.gray[300],
                  borderRadius: spacing.radius.md,
                  padding: spacing.md,
                  fontSize: typography.sizes.base,
                  fontFamily: 'monospace',
                  marginBottom: error ? spacing.xs : spacing.md,
                }}
                value={clientId}
                onChangeText={(text) => {
                  setClientId(text.toUpperCase());
                  setError('');
                }}
                placeholder="TV-2024-ABC123"
                autoCapitalize="characters"
              />
              {error && (
                <Text style={[typography.styles.caption, { color: colors.warning, marginBottom: spacing.md }]}>
                  {error}
                </Text>
              )}

              <Button
                variant="primary"
                onPress={handleSearch}
                loading={searching}
                disabled={searching}
              >
                Search Client
              </Button>
            </Card.Body>
          </Card>
        )}

        {searchMethod === 'scan' && (
          <Card>
            <Card.Body style={{ alignItems: 'center', paddingVertical: spacing.xl }}>
              <View style={{
                width: 200,
                height: 200,
                backgroundColor: colors.gray[200],
                borderRadius: borderRadius.lg,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: spacing.lg,
              }}>
                <Icon name="qrcode-scan" size={64} color={colors.gray[400]} />
              </View>
              <Text style={[typography.styles.body2, { textAlign: 'center', marginBottom: spacing.md }]}>
                Position the QR code within the frame to scan
              </Text>
              <Button
                variant="primary"
                onPress={() => navigation.navigate('QRScanner')}
              >
                Start Camera
              </Button>
            </Card.Body>
          </Card>
        )}

        {/* Search Results */}
        {searching && (
          <View style={{ alignItems: 'center', padding: spacing.xl }}>
            <ActivityIndicator size="large" color={colors.primary[500]} />
            <Text style={[typography.styles.body2, { marginTop: spacing.md }]}>
              Searching for client...
            </Text>
          </View>
        )}

        {foundClient && (
          <Card style={{ backgroundColor: colors.success.light, marginTop: spacing.lg }}>
            <Card.Body>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md }}>
                <Icon name="check-circle" size={24} color={colors.success} />
                <Text style={[typography.styles.h6, { color: colors.success, marginLeft: spacing.sm }]}>
                  Client Found
                </Text>
                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                  <Badge status="success" text="Active" />
                </View>
              </View>

              <View style={{ backgroundColor: colors.white, borderRadius: spacing.radius.md, padding: spacing.md }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md }}>
                  <Icon name="account" size={18} color={colors.gray[400]} />
                  <View style={{ marginLeft: spacing.md }}>
                    <Text style={[typography.styles.caption, { color: colors.text.secondary }]}>Name</Text>
                    <Text style={[typography.styles.body1, { fontWeight: typography.weights.semibold }]}>
                      {foundClient.name}
                    </Text>
                  </View>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md }}>
                  <Icon name="email" size={18} color={colors.gray[400]} />
                  <View style={{ marginLeft: spacing.md }}>
                    <Text style={[typography.styles.caption, { color: colors.text.secondary }]}>Email</Text>
                    <Text style={[typography.styles.body1]}>{foundClient.email}</Text>
                  </View>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md }}>
                  <Icon name="briefcase" size={18} color={colors.gray[400]} />
                  <View style={{ marginLeft: spacing.md }}>
                    <Text style={[typography.styles.caption, { color: colors.text.secondary }]}>User Type</Text>
                    <Text style={[typography.styles.body1, { textTransform: 'capitalize' }]}>
                      {foundClient.userType?.replace('-', ' ')}
                    </Text>
                  </View>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Icon name="qrcode" size={18} color={colors.gray[400]} />
                  <View style={{ marginLeft: spacing.md }}>
                    <Text style={[typography.styles.caption, { color: colors.text.secondary }]}>Client ID</Text>
                    <Text style={[typography.styles.body1, { fontFamily: 'monospace' }]}>
                      {foundClient.clientId}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={{ flexDirection: 'row', marginTop: spacing.lg }}>
                <Button
                  variant="outline"
                  onPress={() => setFoundClient(null)}
                  style={{ flex: 1, marginRight: spacing.sm }}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onPress={handleConnect}
                  style={{ flex: 1, marginLeft: spacing.sm }}
                >
                  Connect Client
                </Button>
              </View>
            </Card.Body>
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ClientSearchScreen;










