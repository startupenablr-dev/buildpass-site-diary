import { ThemeProvider } from '@/components/theme-provider';
import * as AC from '@bacons/apple-colors';
import { Icon, Label, NativeTabs } from 'expo-router/unstable-native-tabs';

export { ErrorBoundary } from 'expo-router';

const TabLayout: React.FC = () => {
  return (
    <ThemeProvider>
      <NativeTabs minimizeBehavior="onScrollDown" tintColor={AC.systemCyan}>
        <NativeTabs.Trigger name="(home)">
          <Label>Home</Label>
          <Icon drawable="custom_android_drawable" sf="house.fill" />
        </NativeTabs.Trigger>
      </NativeTabs>
    </ThemeProvider>
  );
};

TabLayout.displayName = 'TabLayout';

export default TabLayout;
