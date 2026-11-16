# LabSpace — React Native Workspace

LabSpace is a multi-screen mobile workspace built with React Native and Expo. It is intended to be a reusable home for current and future laboratory activities, with a consistent visual system and simple navigation.

## What's included

- **Home:** a compact overview of activity totals, current work, and progress.
- **My Work:** create, search, filter, and delete your own activities. New activities and their checklist items are saved locally.
- **Activity details:** a persistent checklist, automatically calculated progress, and a delete action.
- **Settings:** a Light/Dark appearance switch that updates every screen immediately.
- **Saved preference:** the selected appearance is stored locally with AsyncStorage.
- **Reusable interface:** shared buttons, cards, badges, progress bars, and screen containers.
- **Fixed-height layouts:** screens are arranged to fit within the device viewport; there is no vertical scrolling UI. On shorter screens, the work list uses page controls instead of scrolling.

The activity library starts empty. Add your own activity title, category, description, and checklist items; no sample activity records are preloaded. Activities and checklist completion are stored on the device using AsyncStorage.

## 1. Requirements

- Node.js and npm
- Android phone with a compatible Expo Go build, or an Android emulator
- Optional: VS Code

## 2. Install and run

Open a terminal inside the `labspace-react-native` folder and run:

```bash
npm install
npx expo install --fix
npx expo-doctor
npx expo start
```

To launch on an Android emulator:

```bash
npm run android
```

For a physical Android phone, install Expo Go compatible with the project's Expo SDK, connect the phone and computer to the same Wi-Fi network, and scan the QR code displayed by Expo CLI.

## 3. Project structure

```text
labspace-react-native/
├── App.js
├── app.json
├── package.json
├── src/
│   ├── app/                         # Presentation layer
│   │   ├── components/              # Shared interface components
│   │   ├── hooks/                   # Screen-facing data hooks
│   │   ├── navigation/              # Tab and stack navigation
│   │   ├── providers/               # App-wide providers
│   │   └── screens/                 # Home, My Work, Detail, Settings
│   ├── core/                        # Theme, constants, dependency setup
│   │   ├── di/container.js
│   │   └── theme/themes.js
│   ├── data/                        # Local data and implementations
│   │   ├── datasources/
│   │   ├── models/
│   │   └── repositories/
│   └── domain/                      # Business rules and contracts
│       ├── entities/
│       ├── repositories/
│       └── usecases/
└── ARCHITECTURE.md
```

## 4. Architecture

The project follows a Clean Architecture separation adapted from the supplied Flutter starter:

- **Presentation (`src/app`)** displays screens, handles navigation, local interactions, and providers.
- **Domain (`src/domain`)** contains the Activity entity, repository contract, and use cases. It does not depend on React Native or the data layer.
- **Data (`src/data`)** loads and saves user-created records with AsyncStorage and implements the domain repository contract.
- **Core (`src/core`)** contains shared theme definitions and the dependency composition root.

The dependency direction points inward. Screens call domain use cases; the data implementation fulfils domain contracts; the domain layer remains independent.

## 5. App-wide appearance

`src/app/providers/ThemeProvider.js` uses React Context, `useState`, and `useEffect`. `AppProviders` wraps the navigation tree with the provider. The Settings screen calls `toggleTheme()`, while every screen reads the same theme through `useAppTheme()`. The change is immediate across the app, and AsyncStorage remembers the selected mode between launches.

## 6. Layout and interactions

The screens use Flexbox with `flex`, `flexDirection`, `justifyContent`, and `alignItems`. Shared interface elements keep spacing and styling consistent. `useState` and `useEffect` handle screen-level interactions and data loading. The app does not use `ScrollView`; its content is sized for a single screen. When the device is shorter, the work list displays fewer rows and provides paging controls.

## 7. Suggested screen recording

1. Open Home and show the overview cards and current activity.
2. Open **My Work**, search for an activity, and try the status filters.
3. Open an item, tap checklist rows, and show the progress indicator changing.
4. Open **Settings** and switch the appearance. Return to Home and My Work to show the updated appearance on other screens.
5. Show the screen on another emulator size or device size to demonstrate the layout adapting without vertical scrolling.

On Windows, use `Win + Alt + R` (Xbox Game Bar) or OBS Studio to record the emulator window.

## 8. Publish to GitHub

Create an empty repository on GitHub, then run these commands from this project folder (replace the URL with your own repository URL):

```bash
git init
git add .
git commit -m "Create LabSpace mobile workspace"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/labspace-react-native.git
git push -u origin main
```

Submit the repository URL together with your screen recording.

## Activity status behavior

The Home dashboard status cards are interactive shortcuts, not static labels:

- **Active** opens My Work filtered to activities with at least one completed checklist item and at least one unfinished item.
- **All done** opens My Work filtered to activities whose checklist is fully complete.
- **Planned** opens My Work filtered to activities with no completed checklist items yet.

New activities start as Planned. Checking the first checklist item changes the activity to Active. Completing every item changes it to All done. Unchecking items recalculates the status and progress again. The status cards show counts from the saved activity records.


### Activity status behavior

- **Planned**: a newly created activity that has not been opened to begin work.
- **Active**: an activity becomes active when opened for the first time; checking any checklist item also keeps it active.
- **All done**: every checklist item has been completed.

The Dashboard counts and Laboratory Activities filters use the same derived status rule. Older saved status labels are normalized when records are loaded. Opening a status card clears the search field and resets pagination before applying the requested filter.
