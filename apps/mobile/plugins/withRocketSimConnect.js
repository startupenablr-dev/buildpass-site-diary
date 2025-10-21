/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable import-x/no-extraneous-dependencies */

const { WarningAggregator, withAppDelegate } = require('@expo/config-plugins');
const {
  mergeContents,
} = require('@expo/config-plugins/build/utils/generateCode');

// Swift implementation
const swiftDefinition = `
class RocketSimLoader {
    func loadRocketSimConnect() {
        #if DEBUG
        let frameworkPath = "/Applications/RocketSim.app/Contents/Frameworks/RocketSimConnectLinker.nocache.framework"
        guard let frameworkBundle = Bundle(path: frameworkPath) else {
            print("Failed to find RocketSim framework")
            return
        }

        do {
            try frameworkBundle.loadAndReturnError()
            print("RocketSim Connect successfully linked")
        } catch {
            print("Failed to load linker framework: \\(error)")
        }
        #endif
    }
}`;

const swiftInvocation = `
    let loader = RocketSimLoader()
    loader.loadRocketSimConnect()`;

const swiftMethodMatcher = /bindReactNativeFactory\(factory\)/g;

const modifySwiftAppDelegate = (appDelegate) => {
  let contents = appDelegate;

  if (contents.includes(swiftInvocation)) {
    return contents;
  }

  // Reset regex state
  swiftMethodMatcher.lastIndex = 0;

  if (!swiftMethodMatcher.test(contents)) {
    WarningAggregator.addWarningIOS(
      'withRocketSimConnect',
      'Unable to determine correct insertion point in Swift AppDelegate.',
    );
    return contents;
  }

  // Reset regex state for replacement
  swiftMethodMatcher.lastIndex = 0;

  if (!contents.includes('class RocketSimLoader')) {
    const classAnchor =
      /class ReactNativeDelegate: ExpoReactNativeFactoryDelegate/g;
    contents = mergeContents({
      anchor: classAnchor,
      comment: '//',
      newSrc: swiftDefinition,
      offset: -1,
      src: contents,
      tag: 'withRocketSimConnect - swift definition',
    }).contents;
  }

  // Reset regex state again
  swiftMethodMatcher.lastIndex = 0;

  contents = mergeContents({
    anchor: swiftMethodMatcher,
    comment: '//',
    newSrc: swiftInvocation,
    offset: 1,
    src: contents,
    tag: 'withRocketSimConnect - swift didFinishLaunchingWithOptions',
  }).contents;

  return contents;
};

const withRocketSimConnect = (config) => {
  return withAppDelegate(config, (config) => {
    if (config.modResults.language === 'swift') {
      config.modResults.contents = modifySwiftAppDelegate(
        config.modResults.contents,
      );
    } else {
      WarningAggregator.addWarningIOS(
        'withRocketSimConnect',
        `Unsupported AppDelegate language: ${config.modResults.language}`,
      );
    }
    return config;
  });
};

module.exports = withRocketSimConnect;
