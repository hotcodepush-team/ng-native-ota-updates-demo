# NG Native OTA updates demo by HotCodePush

[![CI](https://github.com/hotcodepush-team/ng-native-ota-updates-demo/actions/workflows/ci.yml/badge.svg)](https://github.com/hotcodepush-team/ng-native-ota-updates-demo/actions/workflows/ci.yml)
[![Release](https://github.com/hotcodepush-team/ng-native-ota-updates-demo/actions/workflows/release.yml/badge.svg)](https://github.com/hotcodepush-team/ng-native-ota-updates-demo/actions/workflows/release.yml)

An Angular app on Expo through [NG Native](https://ng-native.com), with [`@hotcodepush/expo-ota-updates`](https://github.com/hotcodepush-team/expo-ota-updates) in its config plugins. It is pre-configured for a HotCodePush app on production. Install the download, open it and watch the first over-the-air (OTA) update land. No account, no setup. Every merge to `main` ships a release to that app through the [GitHub Action](https://github.com/hotcodepush-team/release-action), and CI builds both platforms.

<p align="center">
  <img src=".github/assets/screenshot.png" alt="The demo on an iPhone simulator, showing the version badge, the current release and the Sync now button" width="320" />
</p>

## Download

The [newest release](https://github.com/hotcodepush-team/ng-native-ota-updates-demo/releases/latest) carries the app for Android and for the iOS simulator. Every merge to `main` builds both, with the label `v1`, as a new release before it ships the update.

```sh
# Android, on a device or an emulator
adb install hotcodepush-demo-ng-native-android.apk

# iOS simulator, booted from Xcode
unzip hotcodepush-demo-ng-native-ios-simulator.zip
xcrun simctl install booted HotCodePushDemo.app
```

<p>
  <img src=".github/assets/qr-android.svg" alt="QR code with the Android download link" width="160" />
</p>

Scan the code on an Android phone to download the APK, and allow the install when Android asks.

The app starts on `v1` and downloads `v2` on its first sync, the release `main` shipped after the build. Open it again and the badge reads `v2`.

## What you will see

- 🏷️ **A version badge** that changes without a store build, `v1` from the embedded bundle, then the label of the newest release.
- 🔄 **Sync now**, one call to `sync()` through an Angular service, with the last result and the last rollback on screen.
- 🛟 **Automatic rollback**: a release whose bundle never renders is rolled back on the next start, and the screen says so.
- 🔍 **The debug screen**, the SDK's own view of the device, the channel and the last check, one tap away.
- 🚀 **The release workflow**, `.github/workflows/release.yml`, the GitHub Action releasing once per platform on every merge.

## Tech stack

Angular with NG Native on Expo SDK 58, TypeScript, the HotCodePush Expo SDK loaded through an injection token, Vitest with a stand-in for the SDK, Maestro for the device flows.

## Getting started

### Prerequisites

Node 24, as `.nvmrc` names it, Xcode or Android Studio, and CocoaPods for the iOS build. A HotCodePush account is not needed to run the demo.

### Run it

```sh
nvm use
npm ci
npx expo prebuild
npx expo run:ios --configuration Release
```

Or `npx expo run:android --variant release`. The native projects are not committed: `prebuild` generates them with the two config plugins, NG Native's and the SDK's. OTA updates are off in a development build, where the development server serves the JavaScript, so run a release build. The app starts on its embedded bundle and syncs against the `production` channel of the demo's app. A build takes only releases created after it was built, so a fresh build answers `skipped · release_older_than_binary` until the next merge to `main` ships a release. That is what the download is for.

### Ship an update of your own

Point the demo at an app of yours and release from your machine:

```sh
npx hotcodepush init
npx hotcodepush release create --platform ios
npx hotcodepush release create --platform android
```

`init` signs you in and rewrites `hotcodepush.json` with your app. Change `VERSION` in `src/app/version.ts` before the release, rebuild once so the store build registers itself, then reopen the app to see the new label.

## Continuous integration

`release.yml` runs on every merge to `main` and releases the change to the demo's app, once per platform:

```yaml
- uses: hotcodepush-team/release-action@v0.3.0
  with:
    token: ${{ secrets.HOTCODEPUSH_TOKEN }}
    platform: ios
    bundle-version: ${{ github.sha }}
```

`ci.yml` prebuilds and builds a release of the app on both platforms and runs the Maestro flows in `maestro/` on the simulator and the emulator.

## Development

```sh
npm run prebuild    # the native projects, without installing the pods
npm start           # the development server, for the development build
npm run ios         # the development build, or npm run android
npm test            # Vitest, with a stand-in for the SDK
npm run lint && npm run typecheck
npm run fmt         # run before every commit
```

The app loads the SDK through an injection token in `src/app/updates.ts`, the way NG Native loads any Expo module that has no service of its own, so a test in Node provides a stand-in under that token. `CLAUDE.md` holds the native build commands, the wiring the plugins add and the Maestro flows.

## Documentation

See [hotcodepush.com/docs/sdks/expo](https://hotcodepush.com/docs/sdks/expo) and the [NG Native guide](https://ng-native.com/guide/ota-updates).

## License

See [LICENSE](./LICENSE).
