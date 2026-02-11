import React from 'react';
import { Image, ImageSourcePropType, StyleSheet, View } from 'react-native';

interface TagCardProps {
  imageSource: ImageSourcePropType;
  accessibilityLabel: string;
  variant?: 'elevated' | 'flat';
}

export default function TagCard({
  imageSource,
  accessibilityLabel,
  variant = 'elevated',
}: TagCardProps) {
  const isFlat = variant === 'flat';
  return (
    <View
      style={[styles.cardBase, isFlat ? styles.flatCard : styles.elevatedCard]}
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel}
    >
      <Image source={imageSource} resizeMode="contain" style={styles.image} />
    </View>
  );
}

const styles = StyleSheet.create({
  cardBase: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  elevatedCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginVertical: 6,
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
  },
  flatCard: {
    backgroundColor: 'transparent',
    paddingVertical: 6,
  },
  image: {
    width: '100%',
    height: 56,
  },
});
