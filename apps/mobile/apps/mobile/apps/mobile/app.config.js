export default {
  expo: {
    name: "Fightswipe",
    slug: "fightswipe",
    version: "1.0.0",
    orientation: "portrait",
    userInterfaceStyle: "dark",
    icon: "./assets/icon.png",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#000000"
    },
    extra: {},
    ios: { supportsTablet: false, bundleIdentifier: "app.fightswipe.mobile" },
    android: {
      package: "app.fightswipe.mobile",
      adaptiveIcon: { foregroundImage: "./assets/adaptive-icon.png", backgroundColor: "#000000" }
    },
    web: { favicon: "./assets/favicon.png" }
  }
};
