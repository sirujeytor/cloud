import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { cancelReminder, ensureNotificationPermission, scheduleDailyReminder } from '../lib/reminders';

const STORAGE_KEY = 'hierbas-app:user-data:v1';

export interface ReminderInfo {
  identifier: string;
  hour: number;
  minute: number;
}

interface StoredData {
  favoriteHerbIds: string[];
  favoriteComboIds: string[];
  reminders: Record<string, ReminderInfo>;
}

const emptyData: StoredData = {
  favoriteHerbIds: [],
  favoriteComboIds: [],
  reminders: {},
};

export type SetReminderResult = 'ok' | 'permission-denied' | 'error';

interface AppDataContextValue {
  isHydrated: boolean;
  favoriteHerbIds: string[];
  favoriteComboIds: string[];
  isFavoriteHerb: (id: string) => boolean;
  toggleFavoriteHerb: (id: string) => void;
  isFavoriteCombo: (id: string) => boolean;
  toggleFavoriteCombo: (id: string) => void;
  getReminder: (comboId: string) => ReminderInfo | undefined;
  setReminder: (comboId: string, title: string, body: string, hour: number, minute: number) => Promise<SetReminderResult>;
  clearReminder: (comboId: string) => Promise<void>;
}

const AppDataContext = createContext<AppDataContextValue | undefined>(undefined);

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<StoredData>(emptyData);
  const [isHydrated, setIsHydrated] = useState(false);
  const hydratedRef = useRef(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) {
          const parsed = JSON.parse(raw) as Partial<StoredData>;
          setData({
            favoriteHerbIds: parsed.favoriteHerbIds ?? [],
            favoriteComboIds: parsed.favoriteComboIds ?? [],
            reminders: parsed.reminders ?? {},
          });
        }
      })
      .catch(() => {
        // Si no se puede leer, arrancamos con datos vacíos.
      })
      .finally(() => {
        hydratedRef.current = true;
        setIsHydrated(true);
      });
  }, []);

  useEffect(() => {
    if (!hydratedRef.current) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data)).catch(() => {
      // Si falla el guardado, la sesión sigue funcionando solo en memoria.
    });
  }, [data]);

  const value = useMemo<AppDataContextValue>(() => {
    const isFavoriteHerb = (id: string) => data.favoriteHerbIds.includes(id);
    const isFavoriteCombo = (id: string) => data.favoriteComboIds.includes(id);

    const toggleFavoriteHerb = (id: string) => {
      setData((prev) => ({
        ...prev,
        favoriteHerbIds: prev.favoriteHerbIds.includes(id)
          ? prev.favoriteHerbIds.filter((h) => h !== id)
          : [...prev.favoriteHerbIds, id],
      }));
    };

    const toggleFavoriteCombo = (id: string) => {
      setData((prev) => {
        const wasFavorite = prev.favoriteComboIds.includes(id);
        const nextReminders = { ...prev.reminders };
        if (wasFavorite && nextReminders[id]) {
          cancelReminder(nextReminders[id].identifier);
          delete nextReminders[id];
        }
        return {
          ...prev,
          favoriteComboIds: wasFavorite
            ? prev.favoriteComboIds.filter((c) => c !== id)
            : [...prev.favoriteComboIds, id],
          reminders: nextReminders,
        };
      });
    };

    const getReminder = (comboId: string) => data.reminders[comboId];

    const setReminder = async (
      comboId: string,
      title: string,
      body: string,
      hour: number,
      minute: number
    ): Promise<SetReminderResult> => {
      try {
        const granted = await ensureNotificationPermission();
        if (!granted) return 'permission-denied';

        const existing = data.reminders[comboId];
        if (existing) {
          await cancelReminder(existing.identifier);
        }
        const identifier = await scheduleDailyReminder(title, body, hour, minute);
        setData((prev) => ({
          ...prev,
          reminders: { ...prev.reminders, [comboId]: { identifier, hour, minute } },
        }));
        return 'ok';
      } catch {
        return 'error';
      }
    };

    const clearReminder = async (comboId: string) => {
      const existing = data.reminders[comboId];
      if (existing) {
        await cancelReminder(existing.identifier);
      }
      setData((prev) => {
        const nextReminders = { ...prev.reminders };
        delete nextReminders[comboId];
        return { ...prev, reminders: nextReminders };
      });
    };

    return {
      isHydrated,
      favoriteHerbIds: data.favoriteHerbIds,
      favoriteComboIds: data.favoriteComboIds,
      isFavoriteHerb,
      toggleFavoriteHerb,
      isFavoriteCombo,
      toggleFavoriteCombo,
      getReminder,
      setReminder,
      clearReminder,
    };
  }, [data, isHydrated]);

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData(): AppDataContextValue {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useAppData debe usarse dentro de un AppDataProvider');
  return ctx;
}
