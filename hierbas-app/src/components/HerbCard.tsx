import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { Herb } from '../types';
import { colors, categoryLabels } from '../theme/colors';
import { Chip } from './Chip';

export function HerbCard({ herb }: { herb: Herb }) {
  return (
    <Link href={`/herb/${herb.id}`} asChild>
      <Pressable style={styles.card}>
        <View style={styles.headerRow}>
          <Text style={styles.name}>{herb.name}</Text>
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
  name: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
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
