import * as AC from '@bacons/apple-colors';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { isLiquidGlassAvailable } from 'expo-glass-effect';

// These are the default stack options for iOS, they disable on other platforms.
export const AppleStackPreset: NativeStackNavigationOptions =
  process.env.EXPO_OS !== 'ios'
    ? {}
    : isLiquidGlassAvailable()
      ? {
          // iOS 26 + liquid glass
          headerBackButtonDisplayMode: 'minimal',
          headerBlurEffect: 'none',
          headerLargeStyle: {
            backgroundColor: 'transparent',
          },
          headerLargeTitle: true,
          headerLargeTitleShadowVisible: false,
          headerShadowVisible: false,
          headerTitleStyle: {
            color: AC.label as unknown as string,
          },
          headerTransparent: true,
        }
      : {
          headerBackButtonDisplayMode: 'default',
          headerBlurEffect: 'systemChromeMaterial',
          headerLargeStyle: {
            backgroundColor: 'transparent',
          },
          headerLargeTitle: true,
          headerLargeTitleShadowVisible: false,
          headerShadowVisible: true,
          headerTransparent: true,
        };
