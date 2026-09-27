import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { herbs } from '../../data/herbs';
import { needs } from '../../data/needs';
import { tcmConcepts } from '../../data/tcmConcepts';
import { colors } from '../../theme/colors';
import { HerbCard } from '../../components/HerbCard';
import { NeedCard } from '../../components/NeedCard';
import { Disclaimer } from '../../components/Disclaimer';

const mtcHerbs = herbs.filter((h) => h.tradition.includes('mtc'));
const mtcNeeds = needs.filter((n) => n.tradition?.includes('mtc'));

export default function TcmScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>☯️ Medicina Tradicional China</Text>
        <Text style={styles.intro}>
          La Medicina Tradicional China (MTC) tiene miles de años y describe el cuerpo en términos de
          energía (Qi), equilibrio (Yin-Yang) y órganos conectados por meridianos. Acá van los conceptos
          básicos, las hierbas más usadas y los patrones o &ldquo;desequilibrios&rdquo; más comunes, cada uno con
          combinaciones para preparar en infusión o decocción.
        </Text>

        <Text style={styles.sectionTitle}>Conceptos clave</Text>
        {tcmConcepts.map((concept) => (
          <View key={concept.id} style={styles.conceptCard}>
            <Text style={styles.conceptTitle}>
              {concept.emoji} {concept.title}
            </Text>
            <Text style={styles.conceptText}>{concept.text}</Text>
          </View>
        ))}

        <Text style={styles.sectionTitle}>Hierbas de la MTC ({mtcHerbs.length})</Text>
        <Text style={styles.sectionSubtitle}>
          Muchas se preparan como decocción (hervidas 10-20 minutos) en lugar de infusión rápida.
        </Text>
        {mtcHerbs.map((herb) => (
          <HerbCard key={herb.id} herb={herb} />
        ))}

        <Text style={styles.sectionTitle}>Patrones y combinaciones</Text>
        <Text style={styles.sectionSubtitle}>
          Desequilibrios comunes según la MTC, con combinaciones de hierbas sugeridas para cada uno.
        </Text>
        {mtcNeeds.map((need) => (
          <NeedCard key={need.id} need={need} />
        ))}

        <View style={styles.disclaimerWrap}>
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
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
  },
  intro: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 21,
    marginTop: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primaryDark,
    marginTop: 22,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 10,
    fontStyle: 'italic',
  },
  conceptCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  conceptTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  conceptText: {
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 19,
  },
  disclaimerWrap: {
    marginTop: 12,
  },
});
