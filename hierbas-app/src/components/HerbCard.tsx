import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { Herb } from '../types';
import { getKind } from '../data/herbs';
import { colors, categoryLabels } from '../theme/colors';
import { Chip } from './Chip';
import { FavoriteStar } from './FavoriteStar';
import { TraditionBadges } from './TraditionBadges';
import { KindBadge } from './KindBadge';
import { useAppData } from '../context/AppDataContext';

export function HerbCard({ herb }: { herb: Herb }) {
  const { isFavoriteHerb, toggleFavoriteHerb } = useAppData();

  return (
    <View style={styles.cardWrapper}>
      <Link href={`/herb/${herb.id}`} asChild>
        <Pressable style={styles.card}>
          <View style={styles.headerRow}>
            <Text style={styles.name}>{herb.name}</Text>
            <Text style={styles.scientific}>{herb.scientificName}</Text>
            <View style={styles.badgesRow}>
              <KindBadge kind={getKind(herb)} />
              <TraditionBadges tradition={herb.tradition} />
            </View>
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
  badgesRow: {
    marginTop: 6,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
