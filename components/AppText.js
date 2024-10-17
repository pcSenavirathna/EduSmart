import { Text, StyleSheet } from 'react-native';
import { useThemeColor } from './../hooks/useThemeColor';

export function AppText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}) {

  const color = useThemeColor({ light: lightColor, dark: darkColor }, type === 'default' ? 'text' : 'primary');

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
