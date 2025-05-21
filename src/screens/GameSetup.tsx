import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { Text, TextInput, Button, Card } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { styles } from '../styles';
import { i18n } from '../localization';
import { RootStackParamList, GameData } from '../types';
import { cardStyles, theme, spacing, responsiveSize } from '../theme';

type GameSetupProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'GameSetup'>;
};

export function GameSetup({ navigation }: GameSetupProps) {
  const [players, setPlayers] = useState(['', '', '']);
  const [holes, setHoles] = useState('9');
  const [inProgressGame, setInProgressGame] = useState<GameData | null>(null);

  // Check for in-progress games when component mounts
  useEffect(() => {
    const checkForInProgressGame = async () => {
      try {
        const existing = await AsyncStorage.getItem('history');
        if (existing) {
          const history: GameData[] = JSON.parse(existing);
          const inProgress = history.find(game => game.inProgress === true);
          if (inProgress) {
            setInProgressGame(inProgress);
          }
        }
      } catch (err) {
        console.error('Error checking for in-progress games:', err);
      }
    };

    checkForInProgressGame();
  }, []);

  const updatePlayerName = (index: number, name: string) => {
    const newPlayers = [...players];
    newPlayers[index] = name;
    setPlayers(newPlayers);
  };

  const startGame = () => {
    if (players.some(name => name.trim() === '')) {
      Alert.alert(i18n.t('error'), i18n.t('missingPlayerNames'));
      return;
    }
    navigation.navigate('GameScore', { players, holes: parseInt(holes, 10) });
  };

  const continueGame = () => {
    if (!inProgressGame || !inProgressGame.holes || !inProgressGame.currentHole) return;

    navigation.navigate('GameScore', { 
      players: inProgressGame.players, 
      holes: inProgressGame.holes,
      game: inProgressGame
    });
  };

  const endGame = async () => {
    if (!inProgressGame) return;

    try {
      const existing = await AsyncStorage.getItem('history');
      if (existing) {
        const history: GameData[] = JSON.parse(existing);
        const gameIndex = history.findIndex(g => g.date === inProgressGame.date);

        if (gameIndex >= 0) {
          // Mark the game as completed
          history[gameIndex].inProgress = false;
          await AsyncStorage.setItem('history', JSON.stringify(history));
          setInProgressGame(null);
        }
      }
    } catch (err) {
      console.error('Error ending game:', err);
    }
  };

  const deleteGame = async () => {
    if (!inProgressGame) return;

    try {
      const existing = await AsyncStorage.getItem('history');
      if (existing) {
        const history: GameData[] = JSON.parse(existing);
        const filteredHistory = history.filter(g => g.date !== inProgressGame.date);
        await AsyncStorage.setItem('history', JSON.stringify(filteredHistory));
        setInProgressGame(null);
      }
    } catch (err) {
      console.error('Error deleting game:', err);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant="titleLarge" style={styles.title}>{i18n.t('title')}</Text>

      {inProgressGame && (
        <Card style={[styles.card, { backgroundColor: theme.colors.secondary + '20' }]}>
          <Card.Title 
            title={i18n.t('continueGame')} 
            titleStyle={[cardStyles.title, { color: theme.colors.secondary }]} 
          />
          <Card.Content>
            <Text style={styles.subtitle}>
              {new Date(inProgressGame.date).toLocaleDateString()} - {i18n.t('hole')} {inProgressGame.currentHole}/{inProgressGame.holes}
            </Text>
            <View style={styles.gridRow}>
              {inProgressGame.players.map(player => (
                <View key={player} style={styles.gridCol}>
                  <Text style={styles.playerName}>{player}</Text>
                  <Text style={styles.historyPlayer}>
                    <Text style={{ fontWeight: 'bold' }}>{inProgressGame.wolfScores[player]} 🦉</Text> ({inProgressGame.totalScores[player] > 0 ? '+' + inProgressGame.totalScores[player] : inProgressGame.totalScores[player]})
                  </Text>
                </View>
              ))}
            </View>
            <View style={[styles.historyActions, { flexDirection: 'column' }]}>
              <Button
                mode="contained"
                onPress={continueGame}
                style={[styles.primaryButton, { marginBottom: spacing.s, backgroundColor: theme.colors.secondary }]}
                icon="play-circle"
                textColor="white"
                contentStyle={{ paddingHorizontal: spacing.m }}
              >
                {i18n.t('continueGame')}
              </Button>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Button
                  mode="outlined"
                  onPress={endGame}
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
                  onPress={deleteGame}
                  style={[styles.dangerButton, { flex: 1 }]}
                  icon="delete"
                  contentStyle={{ paddingHorizontal: spacing.s }}
                >
                  {i18n.t('delete')}
                </Button>
              </View>
            </View>
          </Card.Content>
        </Card>
      )}

      <Card style={styles.card}>
        <Card.Title title={i18n.t('playerName')} titleStyle={cardStyles.title} />
        <Card.Content>
          {players.map((name, i) => (
            <TextInput
              key={i}
              label={i18n.t('playerName') + ` ${i + 1}`}
              value={name}
              onChangeText={text => updatePlayerName(i, text)}
              mode="outlined"
              style={styles.input}
              autoCapitalize="words"
            />
          ))}
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title={i18n.t('golfHolesPlayed')} titleStyle={cardStyles.title} />
        <Card.Content>
          <View style={styles.gridRow}>
            <Button
              mode={holes === '9' ? 'contained' : 'outlined'}
              onPress={() => setHoles('9')}
              style={[{ flex: 1, marginRight: spacing.s }]}
              contentStyle={{ paddingVertical: spacing.s }}
              labelStyle={{ fontSize: responsiveSize(16), fontWeight: 'bold' }}
              icon="flag"
              buttonColor={holes === '9' ? theme.colors.primary : undefined}
              textColor={holes === '9' ? 'white' : theme.colors.primary}
            >
              9 {i18n.t('holes')}
            </Button>
            <Button
              mode={holes === '18' ? 'contained' : 'outlined'}
              onPress={() => setHoles('18')}
              style={[{ flex: 1, marginLeft: spacing.s }]}
              contentStyle={{ paddingVertical: spacing.s }}
              labelStyle={{ fontSize: responsiveSize(16), fontWeight: 'bold' }}
              icon="flag-checkered"
              buttonColor={holes === '18' ? theme.colors.primary : undefined}
              textColor={holes === '18' ? 'white' : theme.colors.primary}
            >
              18 {i18n.t('holes')}
            </Button>
          </View>
        </Card.Content>
      </Card>

      <View style={styles.buttonContainer}>
        <Button 
          mode="contained" 
          onPress={startGame} 
          style={styles.primaryButton}
          textColor="white"
        >
          {i18n.t('start')}
        </Button>
        <Button
          mode="outlined"
          onPress={() => navigation.navigate('History')}
          style={styles.secondaryButton}
          textColor={theme.colors.primary}
        >
          {i18n.t('seeHistory')}
        </Button>
      </View>
    </ScrollView>
  );
}
