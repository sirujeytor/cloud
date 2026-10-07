import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { Combo } from '../types';
import { getHerbById } from '../data/herbs';
import { colors } from '../theme/colors';
import { FavoriteStar } from './FavoriteStar';
import { useAppData } from '../context/AppDataContext';
import { remindersSupported } from '../lib/reminders';

const PRESET_TIMES = [
  { label: 'Mañana', hour: 8, minute: 0 },
  { label: 'Mediodía', hour: 13, minute: 0 },
  { label: 'Tarde', hour: 18, minute: 0 },
  { label: 'Noche', hour: 21, minute: 0 },
];

function formatTime(hour: number, minute: number): string {
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

export function ComboCard({ combo }: { combo: Combo }) {
  const { isFavoriteCombo, toggleFavoriteCombo, getReminder, setReminder, clearReminder } = useAppData();
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [saving, setSaving] = useState(false);

  const isFavorite = isFavoriteCombo(combo.id);
  const reminder = getReminder(combo.id);

  const handlePickTime = async (hour: number, minute: number) => {
    setSaving(true);
    const result = await setReminder(
      combo.id,
      `🍵 ${combo.name}`,
      'Es un buen momento para preparar tu infusión.',
      hour,
      minute
    );
    setSaving(false);
    if (result === 'permission-denied') {
      Alert.alert(
        'Notificaciones desactivadas',
        'Para recibir el recordatorio, activá los permisos de notificaciones para esta app desde los ajustes del celular.'
      );
      return;
    }
    if (result === 'error') {
      Alert.alert('No se pudo programar', 'Intentá de nuevo en un momento.');
      return;
    }
    setShowTimePicker(false);
  };

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.name}>{combo.name}</Text>
        <FavoriteStar active={isFavorite} onPress={() => toggleFavoriteCombo(combo.id)} />
      </View>
      <View style={styles.ingredientsRow}>
        {combo.ingredients.map(({ herbId, proportion }) => {
          const herb = getHerbById(herbId);
          if (!herb) return null;
          return (
            <Link key={herbId} href={`/herb/${herbId}`} asChild>
              <Pressable style={styles.ingredientChip}>
                <Text style={styles.ingredientName}>{herb.name}</Text>
                <Text style={styles.ingredientProportion}>{proportion}</Text>
              </Pressable>
            </Link>
          );
        })}
      </View>
      <Text style={styles.label}>Preparación</Text>
      <Text style={styles.text}>{combo.preparation}</Text>
      <Text style={styles.label}>Frecuencia</Text>
      <Text style={styles.text}>{combo.frequency}</Text>
      {combo.notes ? (
        <View style={styles.notesBox}>
          <Text style={styles.notesText}>{combo.notes}</Text>
        </View>
      ) : null}

      {isFavorite && remindersSupported && (
        <View style={styles.reminderBox}>
          {reminder ? (
            <View style={styles.reminderRow}>
              <Text style={styles.reminderText}>🔔 Recordatorio a las {formatTime(reminder.hour, reminder.minute)}</Text>
              <Pressable onPress={() => clearReminder(combo.id)}>
                <Text style={styles.reminderCancel}>Cancelar</Text>
              </Pressable>
            </View>
          ) : showTimePicker ? (
            <View style={styles.presetRow}>
              {PRESET_TIMES.map((preset) => (
                <Pressable
                  key={preset.label}
                  style={styles.presetChip}
                  onPress={() => handlePickTime(preset.hour, preset.minute)}
                  disabled={saving}
                >
                  <Text style={styles.presetLabel}>{preset.label}</Text>
                  <Text style={styles.presetTime}>{formatTime(preset.hour, preset.minute)}</Text>
                </Pressable>
              ))}
            </View>
          ) : (
            <Pressable onPress={() => setShowTimePicker(true)}>
              <Text style={styles.reminderLink}>🔔 Poner recordatorio diario</Text>
            </Pressable>
          )}
        </View>
      )}
      {isFavorite && !remindersSupported && (
        <Text style={styles.webNote}>
          🔔 Los recordatorios diarios están disponibles en la app instalada en tu celular (iOS/Android).
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    flexShrink: 1,
  },
  ingredientsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  ingredientChip: {
    backgroundColor: colors.chipBg,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  ingredientName: {
    color: colors.chipText,
    fontWeight: '700',
    fontSize: 13,
  },
  ingredientProportion: {
    color: colors.chipText,
    fontSize: 11,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primaryDark,
    marginTop: 6,
  },
  text: {
    fontSize: 13,
    color: colors.text,
    lineHeight: 19,
    marginTop: 2,
  },
  notesBox: {
    backgroundColor: '#FBF1E4',
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
  },
  notesText: {
    fontSize: 12,
    color: colors.danger,
    lineHeight: 17,
  },
  reminderBox: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  reminderLink: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  reminderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  reminderText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primaryDark,
  },
  reminderCancel: {
    fontSize: 12,
    color: colors.danger,
    fontWeight: '700',
  },
  presetRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  presetChip: {
    backgroundColor: colors.chipBg,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  presetLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.chipText,
  },
  presetTime: {
    fontSize: 11,
    color: colors.chipText,
  },
  webNote: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    fontSize: 11,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
});
