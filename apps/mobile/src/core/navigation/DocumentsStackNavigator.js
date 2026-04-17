import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import DocumentsScreen from '@/features/documents/screens/DocumentsScreen';
import IncomeDocumentsScreen from '@/features/documents/screens/IncomeDocumentsScreen';
import MileageLogScreen from '@/features/documents/screens/MileageLogScreen';
import VehicleExpensesScreen from '@/features/documents/screens/VehicleExpensesScreen';
import UploadT4Screen from '@/features/documents/screens/UploadT4Screen';
import UploadT4AScreen from '@/features/documents/screens/UploadT4AScreen';
import UploadT5Screen from '@/features/documents/screens/UploadT5Screen';
import UploadRRSPReceiptScreen from '@/features/documents/screens/UploadRRSPReceiptScreen';
import UploadFHSAScreen from '@/features/documents/screens/UploadFHSAScreen';
import ReceiptsScreen from '@/features/receipts/screens/ReceiptsScreen';
import AddReceiptScreen from '@/features/receipts/screens/AddReceiptScreen';
import ReceiptDetailScreen from '@/features/receipts/screens/ReceiptDetailScreen';
import MileageTrackerScreen from '@/features/mileage/screens/MileageTrackerScreen';
import UploadChecklistScreen from '@/features/uploads/screens/UploadChecklistScreen';
import UploadSectionDetailScreen from '@/features/uploads/screens/UploadSectionDetailScreen';

const Stack = createStackNavigator();

const DocumentsStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DocumentsHome" component={DocumentsScreen} />
      <Stack.Screen name="IncomeDocuments" component={IncomeDocumentsScreen} />
      <Stack.Screen name="MileageLog" component={MileageLogScreen} />
      <Stack.Screen name="VehicleExpenses" component={VehicleExpensesScreen} />
      <Stack.Screen name="UploadT4" component={UploadT4Screen} />
      <Stack.Screen name="UploadT4A" component={UploadT4AScreen} />
      <Stack.Screen name="UploadT5" component={UploadT5Screen} />
      <Stack.Screen name="UploadRRSPReceipt" component={UploadRRSPReceiptScreen} />
      <Stack.Screen name="UploadFHSA" component={UploadFHSAScreen} />
      <Stack.Screen name="Receipts" component={ReceiptsScreen} />
      <Stack.Screen name="AddReceipt" component={AddReceiptScreen} />
      <Stack.Screen name="ReceiptDetail" component={ReceiptDetailScreen} />
      <Stack.Screen name="MileageTracker" component={MileageTrackerScreen} />
      <Stack.Screen name="UploadChecklist" component={UploadChecklistScreen} />
      <Stack.Screen name="UploadSectionDetail" component={UploadSectionDetailScreen} />
    </Stack.Navigator>
  );
};

export default DocumentsStackNavigator;