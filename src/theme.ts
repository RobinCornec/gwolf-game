import { MD3LightTheme, configureFonts } from 'react-native-paper';
import { Dimensions } from 'react-native';

// Get screen dimensions for responsive design
export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Define a modern color palette
const colors = {
  primary: '#4A6572', // Slate blue
  primaryDark: '#344955', // Dark slate blue
  secondary: '#F9AA33', // Golden yellow
  background: '#F5F5F5', // Light gray
  surface: '#FFFFFF', // White
  error: '#B00020', // Red
  text: '#212121', // Almost black
  textSecondary: '#757575', // Medium gray
  disabled: '#BDBDBD', // Light gray
  placeholder: '#9E9E9E', // Gray
  backdrop: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black
  notification: '#F9AA33', // Golden yellow
  success: '#4CAF50', // Green
  warning: '#FF9800', // Orange
  info: '#2196F3', // Blue
};

// Define font configuration
const fontConfig = {
  fontFamily: 'System',
};

// Create the theme
export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    ...colors,
  },
  fonts: configureFonts({ config: fontConfig }),
  roundness: 8,
};

// Responsive spacing
export const spacing = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 48,
};

// Card styles
export const cardStyles = {
  container: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: spacing.s,
    marginVertical: spacing.xs,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: 'bold',
    marginBottom: spacing.s,
    color: colors.text,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 19,
    color: colors.textSecondary,
    marginBottom: spacing.s,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.s,
  },
  scoreText: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '500',
  },
  scoreValue: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  medal: {
    fontSize: 20,
    lineHeight: 26,
    marginRight: spacing.xs,
  },
};

// Button styles
export const buttonStyles = {
  primary: {
    marginVertical: spacing.s,
  },
  secondary: {
    marginVertical: spacing.s,
  },
  icon: {
    marginRight: spacing.xs,
  },
};

// Helper for responsive sizing
export const responsiveSize = (size: number) => {
  const baseWidth = 375; // Base width (iPhone X)
  return (SCREEN_WIDTH / baseWidth) * size;
};
