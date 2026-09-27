import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Link, Stack, useLocalSearchParams } from 'expo-router';
import { getInfusionById } from '../../data/infusions';
import { getHerbById } from '../../data/herbs';
import { colors, infusionTagLabels } from '../../theme/colors';
import { Chip } from '../../components/Chip';
import { FavoriteStar } from '../../components/FavoriteStar';
import { Disclaimer } from '../../components/Disclaimer';
import { useAppData } from '../../context/AppDataContext';

export default function InfusionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const infusion = getInfusionById(id);
  const { isFavoriteInfusion, toggleFavoriteInfusion } = useAppData();

  if (!infusion) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>No encontramos esta infusión.</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: infusion.name }} />
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.emoji}>{infusion.emoji}</Text>
          <View style={styles.titleTextCol}>
            <Text style={styles.name}>{infusion.name}</Text>
          </View>
          <FavoriteStar active={isFavoriteInfusion(infusion.id)} onPress={() => toggleFavoriteInfusion(infusion.id)} size={26} />
        </View>
        <Text style={styles.description}>{infusion.description}</Text>

        <View style={styles.tagsRow}>
          {infusion.tags.map((tag) => (
            <Chip key={tag} label={infusionTagLabels[tag]} />
          ))}
        </View>

        <Text style={styles.sectionTitle}>Ingredientes</Text>
        <View style={styles.ingredientsRow}>
          {infusion.ingredients.map(({ herbId, proportion }) => {
            const herb = getHerbById(herbId);
            if (!herb) return null;
            return (
              <Link key={herbId} href={`/herb/${herbId}`} asChild>
                <Pressable style={styles.ingredientChip}>
                  <Text style={styles.ingredientName}>{herb.name}</Text>
                  <Text style={styles.ingredientProportion}>{proportion}</Text>
                </Pressable>
              </Link>
            );
          })}
        </View>

        <Text style={styles.sectionTitle}>Preparación</Text>
        <Text style={styles.text}>{infusion.preparation}</Text>

        {infusion.servingTip && (
          <>
            <Text style={styles.sectionTitle}>Tip para servir</Text>
            <Text style={styles.text}>{infusion.servingTip}</Text>
          </>
        )}

        {infusion.notes && (
          <View style={styles.notesBox}>
            <Text style={styles.notesText}>{infusion.notes}</Text>
          </View>
        )}

        <Text style={styles.hint}>Tocá el nombre de un ingrediente para ver más sobre él.</Text>

        <View style={styles.disclaimerWrap}>
          <Disclaimer compact />
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 34,
    marginRight: 10,
  },
  titleTextCol: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
  },
  description: {
    fontSize: 14,
    color: colors.textMuted,
    lineHeight: 20,
    marginTop: 10,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primaryDark,
    marginTop: 20,
    marginBottom: 8,
  },
  ingredientsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  ingredientChip: {
    backgroundColor: colors.chipBg,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  ingredientName: {
    color: colors.chipText,
    fontWeight: '700',
    fontSize: 13,
  },
  ingredientProportion: {
    color: colors.chipText,
    fontSize: 11,
  },
  text: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 21,
  },
  notesBox: {
    backgroundColor: '#FBF1E4',
    borderRadius: 10,
    padding: 12,
    marginTop: 16,
  },
  notesText: {
    fontSize: 13,
    color: colors.danger,
    lineHeight: 19,
  },
  hint: {
    fontSize: 12,
    color: colors.textMuted,
    fontStyle: 'italic',
    marginTop: 18,
  },
  disclaimerWrap: {
    marginTop: 14,
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  notFoundText: {
    color: colors.textMuted,
    fontSize: 15,
  },
});
