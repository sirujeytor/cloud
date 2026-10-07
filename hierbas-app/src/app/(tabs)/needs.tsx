import { useMemo, useState } from 'react';
import { SectionList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { needs } from '../../data/needs';
import { getHerbById } from '../../data/herbs';
import { colors } from '../../theme/colors';
import { NeedCard } from '../../components/NeedCard';
import { SearchBar } from '../../components/SearchBar';

function matchesQuery(need: (typeof needs)[number], normalizedQuery: string): boolean {
  if (normalizedQuery.length === 0) return true;
  if (need.name.toLowerCase().includes(normalizedQuery)) return true;
  if (need.description.toLowerCase().includes(normalizedQuery)) return true;
  return need.combos.some(
    (combo) =>
      combo.name.toLowerCase().includes(normalizedQuery) ||
      combo.ingredients.some((ing) => getHerbById(ing.herbId)?.name.toLowerCase().includes(normalizedQuery))
  );
}

export default function NeedsListScreen() {
  const [query, setQuery] = useState('');

  const sections = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const occidentalNeeds = needs.filter(
      (n) => (!n.tradition || n.tradition.includes('occidental')) && matchesQuery(n, normalizedQuery)
    );
    const mtcNeeds = needs.filter((n) => n.tradition?.includes('mtc') && matchesQuery(n, normalizedQuery));
    return [
      { title: 'Medicina tradicional occidental', data: occidentalNeeds },
      { title: 'Medicina Tradicional China (MTC)', data: mtcNeeds },
    ].filter((section) => section.data.length > 0);
  }, [query]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>¿Qué necesitás hoy?</Text>
        <Text style={styles.subtitle}>
          Elegí lo que estás sintiendo y te mostramos combinaciones de hierbas para preparar en infusión.
        </Text>
        <SearchBar value={query} onChangeText={setQuery} placeholder="Buscar por síntoma o hierba..." />
      </View>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <NeedCard need={item} />}
        renderSectionHeader={({ section }) => <Text style={styles.sectionHeader}>{section.title}</Text>}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>No encontramos ninguna necesidad con esa búsqueda.</Text>}
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
    marginBottom: 12,
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
  empty: {
    textAlign: 'center',
    color: colors.textMuted,
    marginTop: 40,
  },
});
