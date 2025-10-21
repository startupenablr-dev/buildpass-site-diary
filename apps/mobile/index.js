import 'react-native-get-random-values';
import 'expo-sqlite/localStorage/install';
import { LogBox } from 'react-native';
import 'expo-router/entry';

LogBox.ignoreLogs(['SafeAreaView has been deprecated']);

export const filterOutAnnoyingWarnings = () => {
  // eslint-disable-next-line no-console
  const previousWarn = console.warn;

  // eslint-disable-next-line no-console
  console.warn = (...args) => {
    const joined = args.join(' ');

    if (joined.includes('SafeAreaView has been deprecated')) {
      return;
    }

    previousWarn(...args);
  };
};

filterOutAnnoyingWarnings();
