# tabbar_bottom_blur_react_native

React Native 0.86 template with a floating tab bar that really blurs on both
platforms, and a bottom sheet that sizes itself to its content.

Built on the New Architecture, without Expo.

## Use it as a template

```bash
git clone git@github.com:ThuongNguyen3432/tabbar_bottom_blur_react_native.git my-app
cd my-app

npm run rename -- "My App" com.acme.myapp

npm install
cd ios && pod install && cd ..
```

Rename before installing anything. The script moves the Android package
directory and the iOS project, so pods and build folders generated beforehand
would point at paths that no longer exist.

Check what it will do first:

```bash
npm run rename -- "My App" com.acme.myapp --dry-run
```

It rewrites, on both platforms:

| | Android | iOS |
|---|---|---|
| Display name | `strings.xml` → `app_name` | `Info.plist` → `CFBundleDisplayName` |
| Project name | `settings.gradle` → `rootProject.name` | `.xcodeproj`, `.xcworkspace`, scheme |
| Bundle id | `namespace`, `applicationId` | `PRODUCT_BUNDLE_IDENTIFIER` |
| Sources | package directory + `package` declarations | `AppDelegate.swift`, `Podfile` target |

Plus `app.json` and `package.json`.

Two details a search-and-replace would miss, and this handles: the Android
package lives in the **directory path**, not just in the source; and the stock
iOS bundle id is derived from `PRODUCT_NAME` behind an
`org.reactjs.native.example` prefix, so it is pinned to the id you pass rather
than left to interpolate.

Display names may contain spaces. The Xcode target and Gradle project name
cannot, so they are derived by stripping everything that is not a letter or
digit — `"My App"` gives target `MyApp`.

If the working tree is a clean git repository the script uses `git mv`, so file
history follows the rename.

## Run

```bash
npm start
npm run android      # or: npm run ios
```

### If port 8081 is taken

Another project's Metro on 8081 will serve your app the wrong bundle, which
surfaces as `'NativeMicrotasksCxx' could not be found` rather than anything
about ports. Use another port:

```bash
npm start -- --port 8082
npm run android -- --port 8082 --no-packager
```

React Native 0.86 ships a prebuilt core, so the `RCT_METRO_PORT` compile-time
macro no longer takes effect on iOS. `AppDelegate.swift` sets the location
directly instead — see the `jsLocation` line, and delete it once 8081 is free.

## What is in here

```
src/
├── app/          store, providers, navigation, bootstrap
├── components/   shared UI
├── core/         api client, storage, logging, network
├── features/     one folder per feature, each self-contained
├── theme/        colours, typography, spacing
├── i18n/         locales
├── hooks/  utils/  types/  constants/  config/
```

### Blur

`@react-native-community/blur`, not `expo-blur`. Both wrap the same Dimezis
BlurView on Android so the blur is real either way, but expo's iOS sources need
a newer Swift than Xcode 26.1.1 provides. It also binds to the activity's
content view, so nothing has to thread a blur target down from the screens.

### Tab bar

A custom `tabBar`, not the stock one with `tabBarStyle` overrides.
`BottomTabItem` lays its icon out from the top of the item, and no style option
reaches the view that decides that — icons cannot be centred any other way.

Offsets are flat numbers, not safe-area insets: measured on device, that inset
is 34pt on iPhone against **0** on Android, so anchoring to it produces visibly
different spacing.

### Bottom sheet

`@gorhom/bottom-sheet`. One component covers both plain content and lists.

Only lists compute their own height. Dynamic sizing measures the content, while
virtualisation exists precisely to avoid rendering it — with both enabled the
sheet opens at the right height but the list will not scroll. Lists therefore
derive their height from `data.length`; pass `rowHeight` if your rows are not
about 45pt.

`BottomSheetFlashList` is deprecated in v5 and does not hand scrolling to
FlashList v2; `useBottomSheetScrollableCreator` is used instead.

## Verified on

- Android — Pixel 6a emulator, API 34
- iOS — iPhone 16e simulator, iOS 26.1
