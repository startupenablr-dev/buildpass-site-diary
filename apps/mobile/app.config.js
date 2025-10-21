module.exports = {
  expo: {
    android: {
      adaptiveIcon: {
        backgroundColor: '#FFFFFF',
        foregroundImage: './assets/images/adaptive-icon.png',
      },
      edgeToEdgeEnabled: true,
      package: 'coding.untitled.app',
      predictiveBackGestureEnabled: true,
    },
    developmentClient: {
      silentLaunch: process.env.CI ? true : false,
    },
    experiments: {
      buildCacheProvider: {
        plugin: 'expo-build-disk-cache',
      },
      reactCompiler: true,
      tsconfigPaths: true,
      typedRoutes: true,
    },
    extra: {
      eas: {
        projectId: 'a5b005a1-d8c0-4940-ba8d-db6b65e47eac',
      },
      router: {
        origin: false,
      },
    },
    ios: {
      appleTeamId: '8NMN526U75',
      bundleIdentifier: 'coding.untitled.app',
      icon: './assets/images/app.icon',
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
      privacyManifests: {
        NSPrivacyAccessedAPITypes: [
          {
            NSPrivacyAccessedAPIType:
              'NSPrivacyAccessedAPICategoryUserDefaults',
            NSPrivacyAccessedAPITypeReasons: ['CA92.1'],
          },
        ],
      },
      supportsTablet: true,
    },
    name: 'Untitled App X',
    newArchEnabled: true,
    orientation: 'portrait',
    plugins: [
      'expo-router',
      [
        'expo-dev-client',
        {
          launchMode: 'most-recent',
        },
      ],
      'expo-localization',
      'expo-font',
      'expo-web-browser',
      'expo-secure-store',
      'expo-sqlite',
      ...(process.env.USE_ROCKET_SIM_CONNECT
        ? ['./plugins/withRocketSimConnect.js']
        : []),
      [
        'expo-build-properties',
        {
          android: {
            reactNativeReleaseLevel: 'experimental',
          },
          ios: {
            deploymentTarget: '18.0',
            reactNativeReleaseLevel: 'experimental',
          },
        },
      ],
      [
        'expo-splash-screen',
        {
          backgroundColor: '#ffffff',
          dark: {
            backgroundColor: '#000000',
          },
          image: './assets/images/splash-icon.png',
          imageWidth: 200,
          resizeMode: 'contain',
        },
      ],
      [
        'expo-font',
        {
          fonts: [],
        },
      ],
    ],
    runtimeVersion: 'fingerprint',
    scheme: 'coding-untitled-app',
    slug: 'coding-untitled-app',
    userInterfaceStyle: 'automatic',
    version: '0.0.1',
    web: {
      favicon: './assets/images/favicon.png',
      output: 'static',
    },
  },
};
