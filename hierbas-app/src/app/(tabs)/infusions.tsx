import { useMemo, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { infusions } from '../../data/infusions';
import { getHerbById } from '../../data/herbs';
import { InfusionTag } from '../../types';
import { colors, infusionTagLabels } from '../../theme/colors';
import { InfusionCard } from '../../components/InfusionCard';
import { SearchBar } from '../../components/SearchBar';
import { FilterChip } from '../../components/FilterChip';

const allTags = Object.keys(infusionTagLabels) as InfusionTag[];

export default function InfusionsListScreen() {
  const [query, setQuery] = useState('');
  const [activeTag, setActiveTag] = useState<InfusionTag | null>(null);

  const filteredInfusions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return infusions.filter((infusion) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        infusion.name.toLowerCase().includes(normalizedQuery) ||
        infusion.ingredients.some((ing) => getHerbById(ing.herbId)?.name.toLowerCase().includes(normalizedQuery));
      const matchesTag = !activeTag || infusion.tags.includes(activeTag);
      return matchesQuery && matchesTag;
    });
  }, [query, activeTag]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>🍵 Infusiones</Text>
        <Text style={styles.subtitle}>
          Recetas ya armadas para inspirarte: buscá por ingrediente (probá &ldquo;naranja&rdquo;) o elegí un estilo.
        </Text>
        <SearchBar value={query} onChangeText={setQuery} placeholder="Buscar por nombre o ingrediente..." />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersRow}>
          <FilterChip label="Todos los estilos" active={activeTag === null} onPress={() => setActiveTag(null)} />
          {allTags.map((tag) => (
            <FilterChip
              key={tag}
              label={infusionTagLabels[tag]}
              active={activeTag === tag}
              onPress={() => setActiveTag((current) => (current === tag ? null : tag))}
            />
          ))}
        </ScrollView>
      </View>
      <FlatList
        data={filteredInfusions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <InfusionCard infusion={item} />}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>No encontramos ninguna infusión con esa búsqueda.</Text>}
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
  filtersRow: {
    marginBottom: 12,
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
