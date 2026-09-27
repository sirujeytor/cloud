import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { Infusion } from '../types';
import { colors, infusionTagLabels } from '../theme/colors';
import { Chip } from './Chip';
import { FavoriteStar } from './FavoriteStar';
import { useAppData } from '../context/AppDataContext';

export function InfusionCard({ infusion }: { infusion: Infusion }) {
  const { isFavoriteInfusion, toggleFavoriteInfusion } = useAppData();

  return (
    <View style={styles.cardWrapper}>
      <Link href={`/infusion/${infusion.id}`} asChild>
        <Pressable style={styles.card}>
          <View style={styles.headerRow}>
            <Text style={styles.emoji}>{infusion.emoji}</Text>
            <View style={styles.textCol}>
              <Text style={styles.name}>{infusion.name}</Text>
              <Text style={styles.description}>{infusion.description}</Text>
            </View>
          </View>
          <View style={styles.tagsRow}>
            {infusion.tags.map((tag) => (
              <Chip key={tag} label={infusionTagLabels[tag]} />
            ))}
          </View>
        </Pressable>
      </Link>
      <View style={styles.favoriteCorner} pointerEvents="box-none">
        <FavoriteStar active={isFavoriteInfusion(infusion.id)} onPress={() => toggleFavoriteInfusion(infusion.id)} />
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
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    paddingRight: 26,
  },
  emoji: {
    fontSize: 26,
    marginRight: 10,
  },
  textCol: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  description: {
    fontSize: 12,
    color: colors.textMuted,
    lineHeight: 17,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
