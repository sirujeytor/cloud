import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { getHerbById, getKind } from '../../data/herbs';
import { colors, categoryLabels } from '../../theme/colors';
import { Chip } from '../../components/Chip';
import { Disclaimer } from '../../components/Disclaimer';
import { FavoriteStar } from '../../components/FavoriteStar';
import { TraditionBadges } from '../../components/TraditionBadges';
import { KindBadge } from '../../components/KindBadge';
import { useAppData } from '../../context/AppDataContext';

export default function HerbDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const herb = getHerbById(id);
  const { isFavoriteHerb, toggleFavoriteHerb } = useAppData();

  if (!herb) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>No encontramos esta hierba.</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: herb.name }} />
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.name}>{herb.name}</Text>
          <FavoriteStar active={isFavoriteHerb(herb.id)} onPress={() => toggleFavoriteHerb(herb.id)} size={26} />
        </View>
        <Text style={styles.scientific}>{herb.scientificName}</Text>
        {herb.commonNames.length > 0 && (
          <Text style={styles.commonNames}>También conocida como: {herb.commonNames.join(', ')}</Text>
        )}

        <View style={styles.traditionBadgesWrap}>
          <KindBadge kind={getKind(herb)} size="large" />
          <TraditionBadges tradition={herb.tradition} size="large" />
        </View>

        <View style={styles.chipsRow}>
          {herb.categories.map((c) => (
            <Chip key={c} label={categoryLabels[c] ?? c} />
          ))}
        </View>

        <Section title="Propiedades destacadas">
          {herb.properties.map((p) => (
            <BulletItem key={p} text={p} />
          ))}
        </Section>

        <Section title="Usos tradicionales">
          {herb.traditionalUses.map((u) => (
            <BulletItem key={u} text={u} />
          ))}
        </Section>

        {herb.mtc && (
          <Section title="Según la Medicina Tradicional China (MTC)">
            <View style={styles.mtcBox}>
              <MtcRow label="Naturaleza" value={herb.mtc.naturaleza} />
              <MtcRow label="Sabor" value={herb.mtc.sabor.join(', ')} />
              <MtcRow label="Meridianos" value={herb.mtc.meridianos.join(', ')} />
              <Text style={styles.mtcFuncion}>{herb.mtc.funcion}</Text>
            </View>
          </Section>
        )}

        <Section title="Cómo preparar la infusión">
          <Text style={styles.text}>{herb.preparation}</Text>
        </Section>

        <Section title="Contraindicaciones">
          {herb.contraindications.map((c) => (
            <BulletItem key={c} text={c} warning />
          ))}
        </Section>

        <View style={styles.disclaimerWrap}>
          <Disclaimer compact />
        </View>
      </ScrollView>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function MtcRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.mtcRow}>
      <Text style={styles.mtcLabel}>{label}</Text>
      <Text style={styles.mtcValue}>{value}</Text>
    </View>
  );
}

function BulletItem({ text, warning }: { text: string; warning?: boolean }) {
  return (
    <View style={styles.bulletRow}>
      <Text style={[styles.bulletDot, warning && styles.bulletDotWarning]}>{warning ? '⚠️' : '•'}</Text>
      <Text style={[styles.text, styles.bulletText]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.text,
    flexShrink: 1,
  },
  scientific: {
    fontSize: 14,
    fontStyle: 'italic',
    color: colors.textMuted,
    marginTop: 2,
  },
  commonNames: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 6,
  },
  traditionBadgesWrap: {
    marginTop: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
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
  text: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 21,
  },
  bulletRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  bulletDot: {
    marginRight: 8,
    color: colors.primary,
  },
  bulletDotWarning: {
    color: colors.danger,
  },
  bulletText: {
    flex: 1,
  },
  disclaimerWrap: {
    marginTop: 24,
  },
  mtcBox: {
    backgroundColor: colors.chipBg,
    borderRadius: 12,
    padding: 12,
  },
  mtcRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  mtcLabel: {
    width: 100,
    fontSize: 13,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  mtcValue: {
    flex: 1,
    fontSize: 13,
    color: colors.text,
  },
  mtcFuncion: {
    fontSize: 13,
    color: colors.text,
    lineHeight: 19,
    marginTop: 4,
    fontStyle: 'italic',
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  notFoundText: {
    color: colors.textMuted,
    fontSize: 15,
  },
});
