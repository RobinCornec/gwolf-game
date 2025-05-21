# GWolf App

A mobile application to track golf scores with the "Chouette" points system.

## Project Structure

The project has a modular architecture for better maintainability:

```
gwolf-app/
├── App.tsx                  # Application entry point
├── src/                     # Main source folder
│   ├── components/          # Reusable UI components
│   ├── localization/        # Internationalization (i18n)
│   │   ├── i18n.ts          # Configuration and translations
│   │   └── index.ts         # Exports
│   ├── navigation/          # Navigation configuration
│   │   ├── AppNavigator.tsx # Main navigator
│   │   └── index.ts         # Exports
│   ├── screens/             # Application screens
│   │   ├── GameSetup.tsx    # Game configuration screen
│   │   ├── GameScore.tsx    # Score entry screen
│   │   ├── GameRecap.tsx    # Summary screen
│   │   ├── History.tsx      # History screen
│   │   └── index.ts         # Exports
│   ├── utils/               # Utilities
│   │   ├── scoreUtils.ts    # Score calculation functions
│   │   └── index.ts         # Exports
│   ├── styles.ts            # Global styles
│   ├── theme.ts             # Theme configuration
│   ├── types.ts             # TypeScript types
│   └── index.ts             # Main exports
└── assets/                  # Images and static resources
```

## Features

- Game configuration with 3 players
- Score entry for 9 or 18 holes with a modern card-based UI
- Support for custom scores beyond standard golf scoring
- Color-coded score buttons for better visual feedback
- Automatic calculation of "Chouette" points
- Game summary with medals and detailed hole-by-hole analysis
- History of played games with the ability to view past games
- Responsive design that adapts to different screen sizes

## Technologies Used

- React Native
- TypeScript
- React Navigation
- React Native Paper (Material Design components)
- Expo
- AsyncStorage for data persistence
- i18n-js for internationalization

## Installation

```bash
# Install dependencies
npm install

# Start the application
npx expo start
```

## Usage

1. Configure a new game by entering player names and selecting 9 or 18 holes
2. Enter scores for each player on each hole
3. Use the custom score option for scores beyond Double Bogey
4. Navigate between holes using the hole selection bar
5. View the game summary at the end with detailed statistics
6. Access game history to review past games

## Internationalization

The application is available in French and English, with automatic detection of the device language.
