import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import { Disclaimer } from '../../components/Disclaimer';

export default function AboutScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>🌿 Hierbas & Infusiones</Text>
        <Text style={styles.paragraph}>
          Esta app junta el conocimiento tradicional sobre hierbas y plantas usadas en infusión —
          tanto de la herboristería occidental/criolla como de la Medicina Tradicional China (MTC) —
          para que puedas elegir qué tomar según lo que necesitás: relajarte, ayudar a la digestión,
          dormir mejor, cuidar las defensas, equilibrar el Qi o simplemente disfrutar un buen té.
        </Text>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>¿Cómo se usa?</Text>
          <Text style={styles.paragraph}>
            • En la pestaña &ldquo;Hierbas&rdquo; podés buscar una planta puntual (occidental o de la MTC,
            con filtro por tradición) y ver sus propiedades, usos tradicionales, preparación y
            contraindicaciones.{'\n'}
            • En la pestaña &ldquo;Necesidades&rdquo; elegís lo que estás sintiendo (estrés, insomnio, digestión
            pesada, etc.) y te sugerimos combinaciones de hierbas para preparar.{'\n'}
            • En la pestaña &ldquo;M. China&rdquo; encontrás los conceptos básicos de la MTC (Qi, Yin-Yang,
            los 5 elementos, sabores y naturalezas), sus hierbas clásicas y los patrones/desequilibrios
            más comunes con sus combinaciones.
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Importante</Text>
          <Disclaimer />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 21,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primaryDark,
    marginBottom: 8,
  },
});
