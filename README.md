# NG Native OTA updates demo by HotCodePush

The demo app for [Expo OTA updates](https://hotcodepush.com/expo-ota-updates) in an [NG Native](https://ng-native.com) app, Angular on Expo, with `@hotcodepush/expo-ota-updates`: one screen showing the bundle version, the current release, the device id, the last sync and the last rollback, a button that syncs now and one that opens the debug screen.

## Getting started

```sh
nvm use
npm ci
npx hotcodepush login
npx expo prebuild
npx expo run:ios --configuration Release      # or: npx expo run:android --variant release
```

The native projects are not committed: `npx expo prebuild` generates them with the two config plugins, NG Native's and the SDK's, and installs the pods.
The committed `hotcodepush.json` names a placeholder app. Delete it and run `npx hotcodepush init` to name yours.
OTA updates are off in the development build, where the development server serves the JavaScript, so run a release build.
Every native build runs the CLI's build step, which writes `hotcodepush.json` into the app. An Xcode archive or an Android release build also registers the store build in HotCodePush.
Without a login the file names no channel and the app takes no updates.
Set `HOTCODEPUSH_FILES_BASE_URL` and `HOTCODEPUSH_UPDATES_BASE_URL` for the build to point it at the local stack or staging.

## Usage

Run the app once: it shows `v1` and the current release `embedded`.
Change `VERSION` in `src/app/version.ts`, release with `npx hotcodepush release create`, which bundles each platform itself, tap "Sync now" and reopen the app to see the new label.

## Development

```sh
npm run prebuild    # the native projects, without installing the pods
npm start           # the development server, for the development build
npm run ios         # the development build, or npm run android
npm test            # Vitest, with a stand-in for the SDK
npm run lint && npm run typecheck
npm run fmt         # run before every commit
```

The app loads the SDK through an injection token in `src/app/updates.ts`, the way NG Native loads any Expo module that has no service of its own, so a test in Node provides a stand-in under that token.
`CLAUDE.md` holds the native build commands and the wiring the plugins add.

## Documentation

See [hotcodepush.com/docs/expo](https://hotcodepush.com/docs/expo) for the SDK and [ng-native.com](https://ng-native.com) for the framework.

## License

See [LICENSE](./LICENSE).
