# Architecture notes

LabSpace adapts the uploaded `FlutterBlocCleanArchTemplate` structure to React Native. Flutter-specific BLoC, Dart, GetIt, and auto_route code is not copied; the responsibility boundaries are retained using React Context, React Navigation, and a small dependency composition root.

## Layer mapping

| Uploaded Flutter template | This React Native project | Responsibility |
| --- | --- | --- |
| `lib/app/` | `src/app/` | Presentation: screens, reusable components, hooks, navigation, providers |
| `lib/data/` | `src/data/` | Data source, model mapping, repository implementation |
| `lib/domain/` | `src/domain/` | Entity, repository contract, use cases |
| `lib/core/` | `src/core/` | Shared theme, constants, dependency composition |

## Dependency direction

```text
Presentation (src/app)
        │ calls
        ▼
Domain (src/domain) ◄──── Data (src/data)
        ▲                         │
        └──── repository contract ┘

Core (src/core) wires concrete implementations together.
```

- Screens do not own hard-coded activity records.
- Screens call use cases through `src/core/di/container.js`.
- Use cases depend on the domain repository contract.
- The repository implementation obtains records from the local data source and maps them to domain entities.
- App-wide appearance is application/presentation state, so its Context provider belongs under `src/app/providers/`.

## State and interactions

- **App-wide state:** `ThemeProvider` uses React Context API. The selected mode is persisted with AsyncStorage and consumed by all screens through `useAppTheme()`.
- **Local state:** the My Work screen owns its search query, status filter, and current page. Activity Details owns the temporary checklist selection.
- **Data loading:** `useActivities` uses `useState` and `useEffect` to load the activity list from the domain use case.

## Layout strategy

The app uses fixed-viewport screens with Flexbox-based layout. No `ScrollView` is used. The activity list adapts its visible row count to the available screen height and uses page controls when the full set cannot fit at once. Shared components keep the visual language consistent across screens.

The sample repository is local and in-memory/read-only. To add a backend later, create a new data source and repository implementation while keeping the same domain contract and use cases.
