import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { Need } from '../types';
import { colors } from '../theme/colors';

export function NeedCard({ need }: { need: Need }) {
  return (
    <Link href={`/need/${need.id}`} asChild>
      <Pressable style={styles.card}>
        <Text style={styles.emoji}>{need.emoji}</Text>
        <View style={styles.textCol}>
          <Text style={styles.name}>{need.name}</Text>
          <Text style={styles.description}>{need.description}</Text>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emoji: {
    fontSize: 28,
    marginRight: 12,
  },
  textCol: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 18,
  },
});
