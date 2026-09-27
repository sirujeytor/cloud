import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { Herb } from '../types';
import { colors, categoryLabels } from '../theme/colors';
import { Chip } from './Chip';
import { FavoriteStar } from './FavoriteStar';
import { useAppData } from '../context/AppDataContext';

export function HerbCard({ herb }: { herb: Herb }) {
  const isMtc = herb.tradition.includes('mtc');
  const { isFavoriteHerb, toggleFavoriteHerb } = useAppData();

  return (
    <View style={styles.cardWrapper}>
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
      {/* Fuera del Link/Pressable a propósito: si estuviera anidada, el toque
          también dispara la navegación del Link (pasa incluso con stopPropagation). */}
      <View style={styles.favoriteCorner} pointerEvents="box-none">
        <FavoriteStar active={isFavoriteHerb(herb.id)} onPress={() => toggleFavoriteHerb(herb.id)} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    marginBottom: 10,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  favoriteCorner: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 1,
  },
  headerRow: {
    marginBottom: 6,
    paddingRight: 26,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  name: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    flexShrink: 1,
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
