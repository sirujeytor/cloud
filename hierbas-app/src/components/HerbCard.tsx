import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { Herb } from '../types';
import { colors, categoryLabels } from '../theme/colors';
import { Chip } from './Chip';

export function HerbCard({ herb }: { herb: Herb }) {
  const isMtc = herb.tradition.includes('mtc');
  return (
    <Link href={`/herb/${herb.id}`} asChild>
      <Pressable style={styles.card}>
        <View style={styles.headerRow}>
          <View style={styles.titleRow}>
            <Text style={styles.name}>{herb.name}</Text>
            {isMtc && (
              <View style={styles.mtcBadge}>
                <Text style={styles.mtcBadgeText}>MTC</Text>
              </View>
            )}
          </View>
          <Text style={styles.scientific}>{herb.scientificName}</Text>
        </View>
        <View style={styles.chipsRow}>
          {herb.categories.map((c) => (
            <Chip key={c} label={categoryLabels[c] ?? c} />
          ))}
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  headerRow: {
    marginBottom: 6,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
  },
  mtcBadge: {
    backgroundColor: colors.secondary,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 8,
  },
  mtcBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  scientific: {
    fontSize: 12,
    fontStyle: 'italic',
    color: colors.textMuted,
    marginTop: 2,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
