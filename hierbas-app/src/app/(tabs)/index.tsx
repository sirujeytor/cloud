import { useMemo, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { herbs, getKind } from '../../data/herbs';
import { Category, Kind, Tradition } from '../../types';
import { colors, categoryLabels, kindLabels, traditionLabels } from '../../theme/colors';
import { HerbCard } from '../../components/HerbCard';
import { SearchBar } from '../../components/SearchBar';
import { FilterChip } from '../../components/FilterChip';

const allCategories = Object.keys(categoryLabels) as Category[];
const allTraditions = Object.keys(traditionLabels) as Tradition[];
const allKinds = Object.keys(kindLabels) as Kind[];

export default function HerbsListScreen() {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [activeTradition, setActiveTradition] = useState<Tradition | null>(null);
  const [activeKind, setActiveKind] = useState<Kind | null>(null);

  const filteredHerbs = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return herbs.filter((herb) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        herb.name.toLowerCase().includes(normalizedQuery) ||
        herb.commonNames.some((n) => n.toLowerCase().includes(normalizedQuery));
      const matchesCategory = !activeCategory || herb.categories.includes(activeCategory);
      const matchesTradition = !activeTradition || herb.tradition.includes(activeTradition);
      const matchesKind = !activeKind || getKind(herb) === activeKind;
      return matchesQuery && matchesCategory && matchesTradition && matchesKind;
    });
  }, [query, activeCategory, activeTradition, activeKind]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Hierbas, frutas y verduras</Text>
        <Text style={styles.subtitle}>Buscá un ingrediente y descubrí sus propiedades y su preparación.</Text>
        <SearchBar value={query} onChangeText={setQuery} placeholder="Buscar por nombre..." />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersRow}>
          <FilterChip label="Todos los tipos" active={activeKind === null} onPress={() => setActiveKind(null)} />
          {allKinds.map((kind) => (
            <FilterChip
              key={kind}
              label={`${kindLabels[kind]}s`}
              active={activeKind === kind}
              onPress={() => setActiveKind((current) => (current === kind ? null : kind))}
            />
          ))}
        </ScrollView>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersRow}>
          <FilterChip
            label="Todas las tradiciones"
            active={activeTradition === null}
            onPress={() => setActiveTradition(null)}
          />
          {allTraditions.map((tradition) => (
            <FilterChip
              key={tradition}
              label={traditionLabels[tradition]}
              active={activeTradition === tradition}
              onPress={() => setActiveTradition((current) => (current === tradition ? null : tradition))}
            />
          ))}
        </ScrollView>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersRow}>
          <FilterChip label="Todas" active={activeCategory === null} onPress={() => setActiveCategory(null)} />
          {allCategories.map((category) => (
            <FilterChip
              key={category}
              label={categoryLabels[category]}
              active={activeCategory === category}
              onPress={() => setActiveCategory((current) => (current === category ? null : category))}
            />
          ))}
        </ScrollView>
      </View>
      <FlatList
        data={filteredHerbs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <HerbCard herb={item} />}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>No encontramos ninguna hierba con esa búsqueda.</Text>
        }
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
