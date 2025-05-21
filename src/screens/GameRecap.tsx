import React from 'react';
import { View, ScrollView } from 'react-native';
import { Text, Button, Card, Divider, Surface } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { styles } from '../styles';
import { i18n } from '../localization';
import { scoreValue, getMedals } from '../utils';
import { RootStackParamList, HoleScore, PlayerScore, PlayerHoleScore } from '../types';
import { theme, cardStyles } from '../theme';

type GameRecapProps = {
  route: RouteProp<RootStackParamList, 'GameRecap'>;
  navigation: NativeStackNavigationProp<RootStackParamList, 'GameRecap'>;
};

export function GameRecap({ route, navigation }: GameRecapProps) {
  const { players, scores, totalScores, wolfScores } = route.params;

  const sortedPlayers = [...players].sort((a, b) => wolfScores[b] - wolfScores[a]);
  const playerMedals = getMedals(players, wolfScores);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant="titleLarge" style={[styles.title, { marginBottom: 20 }]}>{i18n.t('recap')}</Text>

      {/* Summary Card */}
      <Card style={styles.recapCard}>
        <Card.Title title={i18n.t('scores')} titleStyle={cardStyles.title} />
        <Card.Content>
          <View style={styles.gridRow}>
            {sortedPlayers.map((player) => (
              <View key={player} style={styles.recapPlayerCol}>
                <Text style={styles.playerName}>{player}</Text>
                <Text style={cardStyles.scoreText}>
                  {i18n.t('scores')}: {totalScores[player] > 0 ? '+' + totalScores[player] : totalScores[player]}
                </Text>
                <Text style={[styles.recapScoreValue, { color: theme.colors.primary }]}>
                  {playerMedals[player]} {wolfScores[player]} 🦉
                </Text>
              </View>
            ))}
          </View>
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        onPress={() => navigation.reset({
          index: 0,
          routes: [{ name: 'GameSetup' }],
        })}
        style={styles.primaryButton}
        textColor="white"
      >
        {i18n.t('returnHome')}
      </Button>

      <Text variant="titleMedium" style={[styles.subtitle, { marginTop: 20 }]}>
        {i18n.t('holeByHoleScore')}
      </Text>
      {scores.map((hole, index) => {
        const holeScores: PlayerHoleScore[] = players.map(p => ({
          name: p,
          label: hole[p],
          value: scoreValue(hole[p]),
        }));

        // Ranking to assign Owl points (4-2-0 or shared)
        holeScores.sort((a, b) => a.value - b.value);
        const a = holeScores[0], b = holeScores[1], c = holeScores[2];

        const points: PlayerScore = {
          [a.name]: 0, [b.name]: 0, [c.name]: 0,
        };

        if (a.value === b.value && b.value === c.value) {
          players.forEach(p => points[p] = 1);
        } else if (a.value === b.value) {
          points[a.name] = 3;
          points[b.name] = 3;
        } else if (b.value === c.value) {
          points[a.name] = 4;
          points[b.name] = 1;
          points[c.name] = 1;
        } else {
          points[a.name] = 4;
          points[b.name] = 2;
        }

        return (
          <Card key={index} style={styles.recapCard}>
            <Card.Title 
              title={`${i18n.t('hole')} ${index + 1}`} 
              titleStyle={cardStyles.title}
            />
            <Card.Content>
              <View style={styles.recapSection}>
                <Text style={styles.recapSectionTitle}>{i18n.t('scores')}</Text>
                <View style={styles.gridRow}>
                  {players.map(p => {
                    // Determine score color based on value
                    const value = scoreValue(hole[p]);
                    let scoreColor = theme.colors.text;
                    if (value < 0) scoreColor = theme.colors.success; // Under par (good)
                    else if (value > 0) scoreColor = theme.colors.error; // Over par (bad)

                    return (
                      <View key={p} style={styles.recapPlayerCol}>
                        <Text style={styles.recapPlayerName}>{p}</Text>
                        <Text style={[styles.recapScoreValue, { color: scoreColor }]}>
                          {hole[p] || '-'}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>

              <View style={styles.recapSection}>
                <Text style={styles.recapSectionTitle}>🦉 {i18n.t('scores')}</Text>
                <View style={styles.gridRow}>
                  {players.map(p => {
                    // Determine owl point color based on value
                    let pointColor;
                    if (points[p] >= 3) pointColor = theme.colors.success; // Best score
                    else if (points[p] >= 2) pointColor = theme.colors.secondary; // Medium score
                    else if (points[p] >= 1) pointColor = theme.colors.warning; // Low score
                    else pointColor = theme.colors.disabled; // No points

                    return (
                      <View key={p} style={styles.recapPlayerCol}>
                        <Text style={styles.recapPlayerName}>{p}</Text>
                        <Text style={[styles.recapScoreValue, { color: pointColor }]}>
                          {points[p]} 🦉
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            </Card.Content>
          </Card>
        );
      })}
    </ScrollView>
  );
}
