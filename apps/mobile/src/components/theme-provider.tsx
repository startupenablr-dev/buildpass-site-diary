import { useColorScheme } from '@/hooks/use-color-scheme';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as RNTheme,
} from '@react-navigation/native';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = (props: {
  children: React.ReactNode;
}) => {
  const colorScheme = useColorScheme();
  return (
    <RNTheme value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {props.children}
    </RNTheme>
  );
};

ThemeProvider.displayName = 'ThemeProvider';
