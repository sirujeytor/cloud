import { GestureResponderEvent, Pressable, StyleSheet, Text } from 'react-native';

export function FavoriteStar({
  active,
  onPress,
  size = 20,
}: {
  active: boolean;
  onPress: () => void;
  size?: number;
}) {
  const handlePress = (event: GestureResponderEvent) => {
    event.stopPropagation();
    onPress();
  };

  return (
    <Pressable onPress={handlePress} hitSlop={10} style={styles.button}>
      <Text style={{ fontSize: size }}>{active ? '⭐' : '☆'}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 4,
  },
});
