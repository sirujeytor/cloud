import { StyleSheet, Text, View } from 'react-native';
import { Kind } from '../types';
import { kindBadgeColors, kindLabels } from '../theme/colors';

export function KindBadge({ kind, size = 'small' }: { kind: Kind; size?: 'small' | 'large' }) {
  if (kind === 'hierba') return null;

  return (
    <View style={[styles.badge, size === 'large' && styles.badgeLarge, { backgroundColor: kindBadgeColors[kind] }]}>
      <Text style={[styles.text, size === 'large' && styles.textLarge]}>{kindLabels[kind].toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 6,
    marginBottom: 2,
    alignSelf: 'flex-start',
  },
  badgeLarge: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 6,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  textLarge: {
    fontSize: 12,
  },
});
