import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { colors } from '../theme/colors';
import { AppDataProvider } from '../context/AppDataContext';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppDataProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: colors.surface },
            headerTintColor: colors.text,
            headerTitleStyle: { fontWeight: '700' },
            contentStyle: { backgroundColor: colors.background },
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="herb/[id]" options={{ title: 'Hierba' }} />
          <Stack.Screen name="need/[id]" options={{ title: 'Necesidad' }} />
          <Stack.Screen name="infusion/[id]" options={{ title: 'Infusión' }} />
        </Stack>
      </AppDataProvider>
    </GestureHandlerRootView>
  );
}
