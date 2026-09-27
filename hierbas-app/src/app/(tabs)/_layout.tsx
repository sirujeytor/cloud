import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { colors } from '../../theme/colors';

function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.5 }}>{emoji}</Text>;
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Hierbas',
          tabBarIcon: ({ focused }) => <TabIcon emoji="🌿" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="needs"
        options={{
          title: 'Necesidades',
          tabBarIcon: ({ focused }) => <TabIcon emoji="🍵" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="mtc"
        options={{
          title: 'M. China',
          tabBarIcon: ({ focused }) => <TabIcon emoji="☯️" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: 'Info',
          tabBarIcon: ({ focused }) => <TabIcon emoji="ℹ️" focused={focused} />,
        }}
      />
    </Tabs>
  );
}
