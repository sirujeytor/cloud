import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { Combo } from '../types';
import { getHerbById } from '../data/herbs';
import { colors } from '../theme/colors';

export function ComboCard({ combo }: { combo: Combo }) {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{combo.name}</Text>
      <View style={styles.ingredientsRow}>
        {combo.ingredients.map(({ herbId, proportion }) => {
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
      <Text style={styles.label}>Preparación</Text>
      <Text style={styles.text}>{combo.preparation}</Text>
      <Text style={styles.label}>Frecuencia</Text>
      <Text style={styles.text}>{combo.frequency}</Text>
      {combo.notes ? (
        <View style={styles.notesBox}>
          <Text style={styles.notesText}>{combo.notes}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 10,
  },
  ingredientsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
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
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primaryDark,
    marginTop: 6,
  },
  text: {
    fontSize: 13,
    color: colors.text,
    lineHeight: 19,
    marginTop: 2,
  },
  notesBox: {
    backgroundColor: '#FBF1E4',
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
  },
  notesText: {
    fontSize: 12,
    color: colors.danger,
    lineHeight: 17,
  },
});
