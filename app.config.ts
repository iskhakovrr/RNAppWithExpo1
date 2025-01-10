import { type ExpoConfig } from "@expo/config-types";
import { withAppDelegate, type ConfigPlugin } from "expo/config-plugins";

const config: ExpoConfig = {
  expo: {
    name: "RNAppWithExpo1",
    slug: "rnappwithexpo1",
    version: "18",
    newArchEnabled: true,
    orientation: "portrait",
    icon: "./assets/logo.png",
    userInterfaceStyle: "light",
    updates: {
      fallbackToCacheTimeout: 0
    },
    assetBundlePatterns: [
      "**/*"
    ],
    plugins: [
      [
        "expo-font",
        {
          fonts: [
            "./assets/fonts/Onest/Onest-Black.ttf",
            "./assets/fonts/Onest/Onest-Bold.ttf",
            "./assets/fonts/Onest/Onest-ExtraBold.ttf",
            "./assets/fonts/Onest/Onest-ExtraLight.ttf",
            "./assets/fonts/Onest/Onest-Light.ttf",
            "./assets/fonts/Onest/Onest-Medium.ttf",
            "./assets/fonts/Onest/Onest-Regular.ttf",
            "./assets/fonts/Onest/Onest-SemiBold.ttf",
            "./assets/fonts/Onest/Onest-Thin.ttf"
          ]
        }
      ],
      [
        "expo-build-properties",
        {
          android: {
            minSdkVersion: 26
          }
        }
      ]
    ],
    ios: {
      userInterfaceStyle: "light",
      supportsTablet: true,
      publishBundlePath: "ios/expo-swift-example/Supporting/shell-app.bundle",
      publishManifestPath: "ios/expo-swift-example/Supporting/shell-app-manifest.json",
      splash: {
        resizeMode: "contain",
        backgroundColor: "#2F3140",
        image: "./assets/splashlogoNew.png",
        dark: {
          resizeMode: "contain",
          backgroundColor: "#2F3140"
        }
      },
      bundleIdentifier: "com.rnappWithexpo1.app"
    },
    android: {
      versionCode: 18,
      userInterfaceStyle: "light",
      icon: "./icons/icon.png",
      adaptiveIcon: {
        foregroundImage: "./icons/adaptive-icon/foreground.png",
        backgroundImage: "./icons/adaptive-icon/background.png"
      },
      publishBundlePath: "android/app/src/main/assets/shell-app.bundle",
      publishManifestPath: "android/app/src/main/assets/shell-app-manifest.json",
      package: "com.rnappWithexpo1.app",
      googleServicesFile: "./google-services.json",
      splash: {
        resizeMode: "contain",
        backgroundColor: "#2F3140",
        image: "./assets/splashlogoNew.png",
        dark: {
          resizeMode: "contain",
          backgroundColor: "#2F3140"
        }
      }
    },
    web: {favicon: "./assets/logo.png"},
    extra: {eas: {projectId: "someid"}}
  }
};

const withYandexMaps: ConfigPlugin = (config) => {
  return withAppDelegate(config, async (config) => {
    const appDelegate = config.modResults;

    // Add import
    if (!appDelegate.contents.includes("#import <YandexMapsMobile/YMKMapKitFactory.h>")) {
      // Replace the first line with the intercom import
      appDelegate.contents = appDelegate.contents.replace(
          /#import "AppDelegate.h"/g,
          `#import "AppDelegate.h"\n#import <YandexMapsMobile/YMKMapKitFactory.h>`
      );
    }

    const mapKitMethodInvocations = [
      `[YMKMapKit setApiKey:@"${config.extra?.mapKitApiKey}"];`,
      `[YMKMapKit setLocale:@"ru_RU"];`,
      `[YMKMapKit mapKit];`,
    ]
        .map((line) => `\t${line}`)
        .join("\n");

    // Add invocation
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    if (!appDelegate.contents.includes(mapKitMethodInvocations)) {
      appDelegate.contents = appDelegate.contents.replace(
          /\s+return YES;/g,
          `\n\n${mapKitMethodInvocations}\n\n\treturn YES;`
      );
    }

    return config;
  });
};

export default withYandexMaps(config);