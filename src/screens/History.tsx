import React, { useState, useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import { Text, Button, Card } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { styles } from '../styles';
import { i18n } from '../localization';
import { RootStackParamList, GameData } from '../types';
import { cardStyles, theme, spacing } from '../theme';

type HistoryProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'History'>;
};

export function History({ navigation }: HistoryProps) {
  const [games, setGames] = useState<GameData[]>([]);

  const fetchData = async () => {
    const saved = await AsyncStorage.getItem('history');
    if (saved) setGames(JSON.parse(saved) as GameData[]);
  };

  const deleteGame = async (index: number) => {
    const newList = [...games];
    newList.splice(index, 1);
    setGames(newList);
    await AsyncStorage.setItem('history', JSON.stringify(newList));
  };

  const openGame = (game: GameData) => {
    if (game.inProgress) {
      // Continue in-progress game
      navigation.navigate('GameScore', {
        players: game.players,
        holes: game.holes || 9,
        game: game
      });
    } else {
      // View completed game
      navigation.navigate('GameRecap', {
        players: game.players,
        scores: game.scores,
        totalScores: game.totalScores,
        wolfScores: game.wolfScores,
      });
    }
  };

  const endGame = async (index: number) => {
    const newList = [...games];
    // Mark the game as completed
    newList[index].inProgress = false;
    setGames(newList);
    await AsyncStorage.setItem('history', JSON.stringify(newList));
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant="titleLarge" style={styles.title}>{i18n.t('gamesHistory')}</Text>

      {games.length === 0 && (
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.subtitle}>{i18n.t('noGames')}</Text>
          </Card.Content>
        </Card>
      )}

      {games.slice().reverse().map((p, i) => {
        const displayIndex = games.length - 1 - i; // because we reverse()
        return (
          <Card 
            key={i} 
            style={[
              styles.historyItem, 
              p.inProgress && { backgroundColor: theme.colors.secondary + '20' }
            ]}>
            <Card.Content>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={styles.historyDate}>{new Date(p.date).toLocaleString()}</Text>
                {p.inProgress && p.currentHole && p.holes && (
                  <View style={{ 
                    backgroundColor: theme.colors.secondary, 
                    paddingHorizontal: 8, 
                    paddingVertical: 4, 
                    borderRadius: 12 
                  }}>
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>
                      {i18n.t('hole')} {p.currentHole}/{p.holes}
                    </Text>
                  </View>
                )}
              </View>
              {p.players.map((pl: string) => (
                <Text key={pl} style={styles.historyPlayer}>
                  {pl} – <Text style={{ fontWeight: 'bold' }}>{p.wolfScores[pl]} 🦉</Text> ({p.totalScores[pl] > 0 ? '+' + p.totalScores[pl] : p.totalScores[pl]})
                </Text>
              ))}
              <View style={[styles.historyActions, { flexDirection: 'column' }]}>
                <Button
                  mode={p.inProgress ? "contained" : "outlined"}
                  onPress={() => openGame(p)}
                  style={[
                    p.inProgress ? styles.primaryButton : styles.secondaryButton, 
                    { marginBottom: spacing.s }
                  ]}
                  icon={p.inProgress ? "play-circle" : "eye"}
                  textColor={p.inProgress ? "white" : theme.colors.primary}
                  contentStyle={{ paddingHorizontal: spacing.m }}
                >
                  {p.inProgress ? i18n.t('continueGame') : i18n.t('view')}
                </Button>
                {p.inProgress ? (
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Button
                      mode="outlined"
                      onPress={() => endGame(displayIndex)}
                      style={[styles.secondaryButton, { flex: 1, marginRight: spacing.s }]}
                      icon="flag-checkered"
                      textColor={theme.colors.primary}
                      contentStyle={{ paddingHorizontal: spacing.s }}
                    >
                      {i18n.t('endGame')}
                    </Button>
                    <Button
                      mode="outlined"
                      textColor={theme.colors.error}
                      onPress={() => deleteGame(displayIndex)}
                      style={[styles.dangerButton, { flex: 1 }]}
                      icon="delete"
                      contentStyle={{ paddingHorizontal: spacing.s }}
                    >
                      {i18n.t('delete')}
                    </Button>
                  </View>
                ) : (
                  <Button
                    mode="outlined"
                    textColor={theme.colors.error}
                    onPress={() => deleteGame(displayIndex)}
                    style={styles.dangerButton}
                    icon="delete"
                    contentStyle={{ paddingHorizontal: spacing.m }}
                  >
                    {i18n.t('delete')}
                  </Button>
                )}
              </View>
            </Card.Content>
          </Card>
        );
      })}
    </ScrollView>
  );
}
