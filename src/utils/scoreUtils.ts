import { ScoreLabel, HoleScore, PlayerScore, PlayerMedal } from '../types';

/**
 * Converts a score label to its numerical value
 * @param label The score label (Eagle, Birdie, Par, etc.)
 * @returns The numerical value of the score
 */
export const scoreValue = (label: ScoreLabel | string): number => {
  switch (label) {
    case 'Eagle': return -2;
    case 'Birdie': return -1;
    case 'Par': return 0;
    case 'Bogey': return 1;
    case 'Double': return 2;
    case '': return NaN; // not entered
    default:
      // Handle custom scores (format: "Custom:N" where N is a number)
      if (typeof label === 'string' && label.startsWith('Custom:')) {
        const value = parseInt(label.split(':')[1], 10);
        return isNaN(value) ? NaN : value;
      }
      return NaN;
  }
};

/**
 * Calculates the total scores for each player
 * @param players Array of player names
 * @param scores Array of hole scores
 * @returns Record of player names to total scores
 */
export const calculateTotalScores = (
  players: string[], 
  scores: HoleScore[]
): PlayerScore => {
  return players.reduce((acc, player) => {
    const total = scores.reduce((sum, hole) => {
      const val = scoreValue(hole[player]);
      return isNaN(val) ? sum : sum + val;
    }, 0);
    return { ...acc, [player]: total };
  }, {} as PlayerScore);
};

/**
 * Calculates the wolf scores for each player
 * @param players Array of player names
 * @param scores Array of hole scores
 * @returns Record of player names to wolf scores
 */
export const calculateWolfScores = (
  players: string[], 
  scores: HoleScore[]
): PlayerScore => {
  const wolfScores = players.reduce((acc, player) => {
    acc[player] = 0;
    return acc;
  }, {} as PlayerScore);

  scores.forEach(hole => {
    const holeScores = players.map(p => ({
      name: p,
      value: scoreValue(hole[p]),
    }));

    // Ignore hole not entered
    if (holeScores.some(s => isNaN(s.value))) return;

    // Check that at least one score has been modified (default is "Par")
    const isPlayed = holeScores.some(s => s.value !== 0);
    if (!isPlayed) return; // Ignore this hole, it hasn't been played

    // Ranking from best to worst
    holeScores.sort((a, b) => a.value - b.value);

    const a = holeScores[0];
    const b = holeScores[1];
    const c = holeScores[2];

    if (a.value === b.value && b.value === c.value) {
      wolfScores[a.name] += 2;
      wolfScores[b.name] += 2;
      wolfScores[c.name] += 2;
    } else if (a.value === b.value) {
      wolfScores[a.name] += 3;
      wolfScores[b.name] += 3;
    } else if (b.value === c.value) {
      wolfScores[a.name] += 4;
      wolfScores[b.name] += 1;
      wolfScores[c.name] += 1;
    } else {
      wolfScores[a.name] += 4;
      wolfScores[b.name] += 2;
    }
  });

  return wolfScores;
};

/**
 * Adjusts wolf scores to make the minimum score 0
 * @param players Array of player names
 * @param wolfScores Record of player names to wolf scores
 * @returns Record of player names to adjusted wolf scores
 */
export const adjustWolfScores = (
  players: string[], 
  wolfScores: PlayerScore
): PlayerScore => {
  const minWolf = Math.min(...players.map(p => wolfScores[p]));
  return players.reduce((acc, p) => {
    acc[p] = wolfScores[p] - minWolf;
    return acc;
  }, {} as PlayerScore);
};

/**
 * Gets medals for players based on their scores
 * @param players Array of player names
 * @param scores Record of player names to scores
 * @returns Record of player names to medal emojis
 */
export const getMedals = (
  players: string[], 
  scores: PlayerScore
): PlayerMedal => {
  const sortedPlayers = [...players].sort((a, b) => scores[b] - scores[a]);
  const medalList: PlayerMedal = {};
  const medals = ['🥇', '🥈', '🥉'];
  let currentRank = 0;
  let previousScore: number | null = null;
  let actualMedalIndex = 0;

  for (const player of sortedPlayers) {
    const score = scores[player];

    if (previousScore === null || score < previousScore) {
      currentRank++;
      actualMedalIndex = currentRank - 1;
    }

    if (actualMedalIndex < medals.length) {
      medalList[player] = medals[actualMedalIndex];
    } else {
      medalList[player] = ''; // No medal beyond 🥉
    }

    previousScore = score;
  }

  return medalList;
};
