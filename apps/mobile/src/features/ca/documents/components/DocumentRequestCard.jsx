import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../styles/CADocumentRequests.styles';

const getStatusStyle = (status) => {
  switch (String(status || '').toLowerCase()) {
    case 'uploaded':
      return styles.statusUploaded;
    case 'verified':
      return styles.statusVerified;
    case 'rejected':
      return styles.statusRejected;
    case 'pending':
    default:
      return styles.statusPending;
  }
};

const getStatusTextStyle = (status) => {
  switch (String(status || '').toLowerCase()) {
    case 'uploaded':
      return styles.statusUploadedText;
    case 'verified':
      return styles.statusVerifiedText;
    case 'rejected':
      return styles.statusRejectedText;
    case 'pending':
    default:
      return styles.statusPendingText;
  }
};

const DocumentRequestCard = ({
  item,
  onPress,
  onMarkVerified,
  onMarkRejected,
}) => {
  const requestId = item?._id || item?.id;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress?.(item)}
      disabled={!onPress}
      activeOpacity={0.85}
    >
      <View style={styles.cardTopRow}>
        <Text style={styles.title}>{item?.type || 'Document Request'}</Text>

        <View style={[styles.statusBadge, getStatusStyle(item?.status)]}>
          <Text style={[styles.statusBadgeText, getStatusTextStyle(item?.status)]}>
            {item?.status || 'pending'}
          </Text>
        </View>
      </View>

      {!!item?.note && <Text style={styles.meta}>{item.note}</Text>}

      <View style={styles.metaGroup}>
        {!!item?.requestedAt && (
          <Text style={styles.metaSmall}>
            Requested: {new Date(item.requestedAt).toLocaleDateString()}
          </Text>
        )}

        {!!item?.fulfilledAt && (
          <Text style={styles.metaSmall}>
            Uploaded: {new Date(item.fulfilledAt).toLocaleDateString()}
          </Text>
        )}

        {!!item?.verifiedAt && (
          <Text style={styles.metaSmall}>
            Verified: {new Date(item.verifiedAt).toLocaleDateString()}
          </Text>
        )}
      </View>

      <View style={styles.actionRow}>
        {item?.status === 'uploaded' && (
          <>
            <TouchableOpacity
              style={[styles.actionButton, styles.verifyButton]}
              onPress={() => onMarkVerified?.(requestId)}
            >
              <Text style={styles.verifyButtonText}>Mark Verified</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.rejectButton]}
              onPress={() => onMarkRejected?.(requestId)}
            >
              <Text style={styles.rejectButtonText}>Reject</Text>
            </TouchableOpacity>
          </>
        )}

        {item?.status === 'pending' && (
          <View style={styles.pendingNoteWrap}>
            <Text style={styles.pendingNoteText}>
              Waiting for client upload
            </Text>
          </View>
        )}

        {item?.status === 'verified' && (
          <View style={styles.verifiedNoteWrap}>
            <Text style={styles.verifiedNoteText}>
              Document verified
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default DocumentRequestCard;