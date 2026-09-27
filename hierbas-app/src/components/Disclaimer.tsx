import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

export function Disclaimer({ compact }: { compact?: boolean }) {
  return (
    <View style={[styles.box, compact && styles.boxCompact]}>
      <Text style={styles.text}>
        ⚠️ Esta información es de carácter tradicional y educativo, no reemplaza el diagnóstico ni el
        consejo de un médico o profesional de la salud. Consultá antes de usar hierbas si estás
        embarazada, en lactancia, tomás medicación o tenés alguna condición de salud.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: '#FBF1E4',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  boxCompact: {
    padding: 10,
  },
  text: {
    color: colors.danger,
    fontSize: 12,
    lineHeight: 18,
  },
});
