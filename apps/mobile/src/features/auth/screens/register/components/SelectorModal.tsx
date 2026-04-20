import React from 'react';
import { Modal, View, Text, TouchableOpacity, FlatList } from 'react-native';

const SelectorModal = ({
  visible,
  title,
  options,
  value,
  onClose,
  onSelect,
  styles,
}) => {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.selectorSheet}>
          <View style={styles.selectorHeader}>
            <Text style={styles.selectorTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.selectorClose}>Close</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={options}
            keyExtractor={(item, index) => `${item}-${index}`}
            renderItem={({ item }) => {
              const selected = item === value;

              return (
                <TouchableOpacity
                  style={[styles.selectorItem, selected && styles.selectorItemActive]}
                  onPress={() => onSelect(item)}
                >
                  <Text
                    style={[styles.selectorItemText, selected && styles.selectorItemTextActive]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </View>
    </Modal>
  );
};

export default SelectorModal;