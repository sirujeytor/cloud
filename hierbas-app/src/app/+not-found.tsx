import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

export default function NotFoundScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Esta pantalla no existe.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  text: {
    color: colors.textMuted,
    fontSize: 15,
  },
});
