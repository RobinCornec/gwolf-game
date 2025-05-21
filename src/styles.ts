import { StyleSheet } from 'react-native';
import { theme, spacing, cardStyles, responsiveSize } from './theme';

export const styles = StyleSheet.create({
  // Container styles
  container: { 
    flexGrow: 1, 
    padding: spacing.m, 
    backgroundColor: theme.colors.background,
  },
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  contentContainer: {
    padding: spacing.m,
  },

  // Typography
  title: { 
    fontSize: responsiveSize(22), 
    lineHeight: responsiveSize(28), 
    marginBottom: spacing.m, 
    textAlign: 'center', 
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  subtitle: {
    fontSize: responsiveSize(18),
    lineHeight: responsiveSize(24),
    marginBottom: spacing.m,
    color: theme.colors.textSecondary,
  },

  // Form elements
  input: { 
    marginBottom: spacing.m,
    backgroundColor: theme.colors.surface,
  },
  radioRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: spacing.s,
    paddingVertical: spacing.xs,
  },
  radioLabel: { 
    fontSize: responsiveSize(16),
    lineHeight: responsiveSize(22),
    marginLeft: spacing.xs,
    color: theme.colors.text,
  },

  // Grid layouts
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.s,
  },
  gridCol: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: spacing.xs / 2,
  },

  // Player elements
  playerName: {
    fontSize: responsiveSize(16),
    lineHeight: responsiveSize(20),
    fontWeight: 'bold',
    marginBottom: spacing.s,
    textAlign: 'center',
    color: theme.colors.primary,
  },

  // Score elements
  scoreButton: {
    marginBottom: spacing.s,
    width: responsiveSize(100),
    borderRadius: theme.roundness,
  },
  scoreButtonSelected: {
    backgroundColor: theme.colors.primary,
  },
  score: { 
    fontSize: responsiveSize(16), 
    lineHeight: responsiveSize(22),
    width: responsiveSize(40), 
    textAlign: 'center',
    color: theme.colors.text,
  },

  // Cards
  card: {
    ...cardStyles.container,
    marginBottom: spacing.s,
  },
  cardTitle: {
    ...cardStyles.title,
  },
  cardContent: {
    marginVertical: spacing.s,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: spacing.s,
  },

  // Hole navigation
  holeNavigation: {
    height: responsiveSize(50),
    marginVertical: spacing.s,
  },
  holeButton: {
    marginHorizontal: spacing.xs,
    minWidth: responsiveSize(40),
  },

  // Game history
  historyItem: {
    ...cardStyles.container,
    marginBottom: spacing.m,
  },
  historyDate: {
    fontSize: responsiveSize(16),
    lineHeight: responsiveSize(22),
    fontWeight: 'bold',
    marginBottom: spacing.s,
    color: theme.colors.primary,
  },
  historyPlayer: {
    fontSize: responsiveSize(14),
    lineHeight: responsiveSize(19),
    marginBottom: spacing.xs,
    color: theme.colors.text,
  },
  historyActions: {
    marginTop: spacing.s,
  },

  // Game recap
  recapCard: {
    ...cardStyles.container,
    marginBottom: spacing.m,
    borderRadius: 12,
  },
  recapSection: {
    elevation: 1,
    borderRadius: 8,
    padding: spacing.m,
    marginBottom: spacing.m,
    backgroundColor: theme.colors.surface,
  },
  recapSectionTitle: {
    fontSize: responsiveSize(16),
    lineHeight: responsiveSize(22),
    fontWeight: 'bold',
    marginBottom: spacing.s,
    color: theme.colors.primary,
  },
  recapScoreValue: {
    fontSize: responsiveSize(18),
    lineHeight: responsiveSize(24),
    fontWeight: 'bold',
    textAlign: 'center',
  },
  recapPlayerCol: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.s,
    borderRadius: 4,
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  recapPlayerName: {
    fontSize: responsiveSize(14),
    lineHeight: responsiveSize(18),
    fontWeight: 'bold',
    marginBottom: spacing.xs,
    textAlign: 'center',
    color: theme.colors.primary,
  },

  // Buttons
  buttonContainer: {
    marginVertical: spacing.m,
  },
  primaryButton: {
    marginVertical: spacing.s,
    backgroundColor: theme.colors.primary,
  },
  secondaryButton: {
    marginVertical: spacing.s,
    borderColor: theme.colors.primary,
  },
  dangerButton: {
    marginVertical: spacing.s,
    borderColor: theme.colors.error,
  },
});
