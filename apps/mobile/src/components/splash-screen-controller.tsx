import { SplashScreen } from 'expo-router';

export const SplashScreenController: React.FC = () => {
  SplashScreen.hideAsync();

  return null;
};

SplashScreenController.displayName = 'SplashScreenController';
