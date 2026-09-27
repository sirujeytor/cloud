import { StyleSheet, Text, View } from 'react-native';
import { Tradition } from '../types';
import { traditionBadgeColors, traditionBadgeLabels } from '../theme/colors';

export function TraditionBadges({ tradition, size = 'small' }: { tradition: Tradition[]; size?: 'small' | 'large' }) {
  const extra = tradition.filter((t) => t !== 'occidental');
  if (extra.length === 0) return null;

  return (
    <View style={styles.row}>
      {extra.map((t) => (
        <View
          key={t}
          style={[styles.badge, size === 'large' && styles.badgeLarge, { backgroundColor: traditionBadgeColors[t] }]}
        >
          <Text style={[styles.text, size === 'large' && styles.textLarge]}>{traditionBadgeLabels[t]}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  badge: {
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 6,
    marginBottom: 2,
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
