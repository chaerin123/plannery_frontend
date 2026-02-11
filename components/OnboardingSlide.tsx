import React, { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface OnboardingSlideProps {
  title: ReactNode;
  subtitle?: string;
  children: ReactNode;
}

export default function OnboardingSlide({ title, subtitle, children }: OnboardingSlideProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    color: '#1F2937',
    lineHeight: 34,
    letterSpacing: -0.3,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    color: '#6B7280',
  },
  content: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
});
