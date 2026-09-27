import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { getNeedById } from '../../data/needs';
import { colors } from '../../theme/colors';
import { ComboCard } from '../../components/ComboCard';
import { Disclaimer } from '../../components/Disclaimer';

export default function NeedDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const need = getNeedById(id);

  if (!need) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>No encontramos esta necesidad.</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: need.name }} />
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <Text style={styles.emoji}>{need.emoji}</Text>
        <Text style={styles.name}>{need.name}</Text>
        <Text style={styles.description}>{need.description}</Text>

        <Text style={styles.sectionTitle}>Combinaciones sugeridas</Text>
        {need.combos.map((combo) => (
          <ComboCard key={combo.id} combo={combo} />
        ))}

        <Text style={styles.hint}>Tocá el nombre de una hierba para ver más sobre ella.</Text>

        <View style={styles.disclaimerWrap}>
          <Disclaimer />
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
  emoji: {
    fontSize: 40,
  },
  name: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    marginTop: 4,
  },
  description: {
    fontSize: 14,
    color: colors.textMuted,
    lineHeight: 20,
    marginTop: 6,
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primaryDark,
    marginBottom: 10,
  },
  hint: {
    fontSize: 12,
    color: colors.textMuted,
    fontStyle: 'italic',
    marginBottom: 18,
  },
  disclaimerWrap: {
    marginTop: 4,
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
