import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getHerbById } from '../../data/herbs';
import { getComboWithNeed } from '../../data/needs';
import { colors } from '../../theme/colors';
import { HerbCard } from '../../components/HerbCard';
import { ComboCard } from '../../components/ComboCard';
import { useAppData } from '../../context/AppDataContext';

export default function FavoritesScreen() {
  const { favoriteHerbIds, favoriteComboIds } = useAppData();

  const favoriteHerbs = favoriteHerbIds.map(getHerbById).filter((h) => h !== undefined);
  const favoriteCombos = favoriteComboIds.map(getComboWithNeed).filter((c) => c !== undefined);

  const isEmpty = favoriteHerbs.length === 0 && favoriteCombos.length === 0;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>⭐ Mi rutina</Text>
        <Text style={styles.subtitle}>
          Las hierbas y combinaciones que guardaste. Tocá la estrella en cualquier hierba o
          combinación para agregarla o sacarla de acá.
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {isEmpty && (
          <Text style={styles.empty}>
            Todavía no guardaste nada. Buscá una hierba o una combinación y tocá la ☆ para guardarla acá.
          </Text>
        )}

        {favoriteHerbs.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Hierbas guardadas</Text>
            {favoriteHerbs.map((herb) => (
              <HerbCard key={herb.id} herb={herb} />
            ))}
          </>
        )}

        {favoriteCombos.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Combinaciones guardadas</Text>
            {favoriteCombos.map(({ need, combo }) => (
              <View key={combo.id} style={styles.comboWrap}>
                <Text style={styles.comboNeedLabel}>
                  {need.emoji} {need.name}
                </Text>
                <ComboCard combo={combo} />
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    marginBottom: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 4,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primaryDark,
    marginBottom: 10,
    marginTop: 8,
  },
  comboWrap: {
    marginBottom: 4,
  },
  comboNeedLabel: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 4,
    fontWeight: '600',
  },
  empty: {
    textAlign: 'center',
    color: colors.textMuted,
    marginTop: 40,
    fontSize: 14,
    lineHeight: 20,
  },
});
