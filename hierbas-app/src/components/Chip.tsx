import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

export function Chip({ label }: { label: string }) {
  return (
    <View style={styles.chip}>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    backgroundColor: colors.chipBg,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 6,
  },
  label: {
    color: colors.chipText,
    fontSize: 12,
    fontWeight: '600',
  },
});
