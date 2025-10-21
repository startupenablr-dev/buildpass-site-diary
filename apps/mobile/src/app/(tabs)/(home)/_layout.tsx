import { AppleStackPreset } from '@/lib/theme';
import { Stack } from 'expo-router';

export { ErrorBoundary } from 'expo-router';

const IndexLayout: React.FC = () => {
  return (
    <Stack screenOptions={AppleStackPreset}>
      <Stack.Screen name="index" options={{ title: 'Home' }} />
    </Stack>
  );
};

IndexLayout.displayName = 'IndexLayout';

export default IndexLayout;
