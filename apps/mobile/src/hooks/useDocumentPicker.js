import { useCallback } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import { Alert } from 'react-native';

/**
 * Custom hook for document picking functionality
 * @param {Object} options - Configuration options
 * @param {Array} options.allowedTypes - Array of MIME types (default: pdf, images, docs)
 * @param {boolean} options.multiple - Allow multiple file selection (default: false)
 * @param {Function} options.onSuccess - Callback when document is selected successfully
 * @param {Function} options.onError - Callback when error occurs
 * @returns {Object} Document picker functions and state
 */
export const useDocumentPicker = (options = {}) => {
  const {
    allowedTypes = [
      'application/pdf',
      'image/*',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain'
    ],
    multiple = false,
    onSuccess,
    onError,
  } = options;

  const pickDocument = useCallback(async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: allowedTypes,
        copyToCacheDirectory: true,
        multiple,
      });

      if (!result.canceled) {
        const files = result.assets;
        
        // Handle single file or multiple files
        if (multiple) {
          console.log(`Selected ${files.length} files:`, files.map(f => f.name).join(', '));
          onSuccess?.(files);
          return files;
        } else {
          const file = files[0];
          console.log('Selected file:', file.name);
          onSuccess?.(file);
          return file;
        }
      }
    } catch (err) {
      console.error('Document picker error:', err);
      const errorMessage = 'Failed to pick document. Please try again.';
      Alert.alert('Error', errorMessage);
      onError?.(err);
    }
  }, [allowedTypes, multiple, onSuccess, onError]);

  return { pickDocument };
};

/**
 * Pre-configured hook for single document picking
 */
export const useSingleDocumentPicker = (options = {}) => {
  return useDocumentPicker({ ...options, multiple: false });
};

/**
 * Pre-configured hook for multiple document picking
 */
export const useMultipleDocumentPicker = (options = {}) => {
  return useDocumentPicker({ ...options, multiple: true });
};

/**
 * Pre-configured hook for receipt picking (optimized for receipts)
 */
export const useReceiptPicker = (options = {}) => {
  return useDocumentPicker({
    allowedTypes: ['image/*', 'application/pdf'],
    multiple: false,
    ...options,
  });
};

/**
 * Pre-configured hook for tax document picking
 */
export const useTaxDocumentPicker = (options = {}) => {
  return useDocumentPicker({
    allowedTypes: ['application/pdf', 'image/*'],
    multiple: true,
    ...options,
  });
};



