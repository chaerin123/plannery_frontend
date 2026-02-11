import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

interface PageIndicatorProps {
  total: number;
  currentIndex: number;
  onDotPress?: (index: number) => void;
}

export default function PageIndicator({ total, currentIndex, onDotPress }: PageIndicatorProps) {
  return (
    <View style={styles.container} accessibilityRole="tablist">
      {Array.from({ length: total }).map((_, index) => {
        const isActive = index === currentIndex;
        return (
          <Pressable
            key={`dot-${index}`}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={`온보딩 ${index + 1}페이지`}
            onPress={() => onDotPress?.(index)}
            style={[styles.dot, isActive ? styles.activeDot : styles.inactiveDot]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 16,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  activeDot: {
    backgroundColor: '#A78BFA',
  },
  inactiveDot: {
    backgroundColor: '#D1D5DB',
  },
});
