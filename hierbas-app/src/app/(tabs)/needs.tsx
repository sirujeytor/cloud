import { SectionList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { needs } from '../../data/needs';
import { colors } from '../../theme/colors';
import { NeedCard } from '../../components/NeedCard';

const occidentalNeeds = needs.filter((n) => !n.tradition || n.tradition.includes('occidental'));
const mtcNeeds = needs.filter((n) => n.tradition?.includes('mtc'));

const sections = [
  { title: 'Medicina tradicional occidental', data: occidentalNeeds },
  { title: 'Medicina Tradicional China (MTC)', data: mtcNeeds },
];

export default function NeedsListScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>¿Qué necesitás hoy?</Text>
        <Text style={styles.subtitle}>
          Elegí lo que estás sintiendo y te mostramos combinaciones de hierbas para preparar en infusión.
        </Text>
      </View>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <NeedCard need={item} />}
        renderSectionHeader={({ section }) => <Text style={styles.sectionHeader}>{section.title}</Text>}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={styles.list}
      />
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
    marginBottom: 8,
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
  sectionHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primaryDark,
    backgroundColor: colors.background,
    paddingTop: 12,
    paddingBottom: 8,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
});
