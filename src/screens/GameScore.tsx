import React, { useState, useEffect } from 'react';
import { View, ScrollView, Alert, TextInput } from 'react-native';
import { Text, Button, Dialog, Portal, Card } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { styles } from '../styles';
import { i18n } from '../localization';
import { 
  scoreValue, 
  calculateTotalScores, 
  calculateWolfScores, 
  adjustWolfScores 
} from '../utils';
import { RootStackParamList, GameData, HoleScore } from '../types';
import { cardStyles, theme } from '../theme';

type GameScoreProps = {
  route: RouteProp<RootStackParamList, 'GameScore'>;
  navigation: NativeStackNavigationProp<RootStackParamList, 'GameScore'>;
};

export function GameScore({ route, navigation }: GameScoreProps) {
  const { players, holes, game } = route.params;
  const [currentHole, setCurrentHole] = useState(game?.currentHole || 1);
  const [scores, setScores] = useState<HoleScore[]>(
    game?.scores || 
    Array(holes)
      .fill(null)
      .map(() => players.reduce((acc, p) => ({ ...acc, [p]: '' }), {} as HoleScore))
  );
  const [customScoreDialogVisible, setCustomScoreDialogVisible] = useState(false);
  const [customScoreValue, setCustomScoreValue] = useState('');
  const [currentPlayer, setCurrentPlayer] = useState('');
  const [gameId] = useState<string>(game?.date || new Date().toISOString());

  const totalScores = calculateTotalScores(players, scores);
  const wolfScores = calculateWolfScores(players, scores);
  const adjustedWolfScores = adjustWolfScores(players, wolfScores);

  // Auto-save when scores change
  useEffect(() => {
    const autoSave = async () => {
      await saveGame(false);
    };
    autoSave();
  }, [scores, currentHole]);

  const saveGame = async (isCompleted: boolean = false) => {
    const gameData: GameData = {
      date: gameId,
      players,
      scores,
      totalScores,
      wolfScores: adjustedWolfScores,
      inProgress: !isCompleted,
      holes,
      currentHole,
    };

    try {
      const existing = await AsyncStorage.getItem('history');
      let history: GameData[] = existing ? JSON.parse(existing) : [];

      // Check if this game already exists in history
      const existingGameIndex = history.findIndex(g => g.date === gameId);

      if (existingGameIndex >= 0) {
        // Update existing game
        history[existingGameIndex] = gameData;
      } else {
        // Add new game
        history.push(gameData);
      }

      await AsyncStorage.setItem('history', JSON.stringify(history));
    } catch (err) {
      console.error('Save error:', err);
    }
  };

  const nextHole = async () => {
    if (currentHole < holes) {
      setCurrentHole(currentHole + 1);
      await saveGame(false); // Save as in-progress
    } else {
      await saveGame(true); // Save as completed
      navigation.navigate('GameRecap', {
        players,
        scores,
        totalScores,
        wolfScores: adjustedWolfScores
      });
    }
  };

  const handleCustomScoreSubmit = () => {
    if (customScoreValue.trim() === '') {
      Alert.alert(i18n.t('error'), i18n.t('enterValidScore'));
      return;
    }

    const scoreNum = parseInt(customScoreValue, 10);
    if (isNaN(scoreNum)) {
      Alert.alert(i18n.t('error'), i18n.t('enterValidNumber'));
      return;
    }

    const newScores = [...scores];
    newScores[currentHole - 1][currentPlayer] = `Custom:${scoreNum}`;
    setScores(newScores);
    setCustomScoreDialogVisible(false);
  };

  return (
    <View style={styles.container}>
      <Portal>
        <Dialog visible={customScoreDialogVisible} onDismiss={() => setCustomScoreDialogVisible(false)}>
          <Dialog.Title>{i18n.t('enterCustomScore')}</Dialog.Title>
          <Dialog.Content>
            <TextInput
              style={{
                height: 50,
                borderColor: theme.colors.primary,
                borderWidth: 1,
                borderRadius: 4,
                marginTop: 8,
                paddingHorizontal: 12,
                fontSize: 16
              }}
              keyboardType="numeric"
              value={customScoreValue}
              onChangeText={setCustomScoreValue}
              placeholder={i18n.t('enterScoreHere')}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button 
              onPress={() => setCustomScoreDialogVisible(false)}
              style={styles.secondaryButton}
              textColor={theme.colors.primary}
            >
              {i18n.t('cancel')}
            </Button>
            <Button 
              onPress={handleCustomScoreSubmit}
              style={styles.primaryButton}
              textColor="white"
            >
              {i18n.t('ok')}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <Text variant="titleLarge" style={styles.title}>{i18n.t('hole')} {currentHole} / {holes}</Text>

      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.gridRow}>
            {players.map(player => (
              <View key={player} style={styles.gridCol}>
                <Text style={styles.playerName}>{player}</Text>
                {['Eagle', 'Birdie', 'Par', 'Bogey', 'Double'].map(label => {
                  // Determine score color based on value
                  const val = scoreValue(label);
                  let buttonColor;
                  if (val < 0) buttonColor = theme.colors.success; // Under par (good)
                  else if (val > 0) buttonColor = theme.colors.error; // Over par (bad)

                  return (
                    <Button
                      key={label}
                      mode={scores[currentHole - 1][player] === label && scores[currentHole - 1][player] !== '' ? 'contained' : 'outlined'}
                      onPress={() => {
                        const newScores = [...scores];
                        newScores[currentHole - 1][player] = label;
                        setScores(newScores);
                      }}
                      style={[
                        styles.scoreButton, 
                        scores[currentHole - 1][player] === label && { 
                          backgroundColor: buttonColor || theme.colors.primary 
                        }
                      ]}
                    >
                      {label}
                    </Button>
                  );
                })}
                <Button
                  key="custom"
                  mode={typeof scores[currentHole - 1][player] === 'string' && scores[currentHole - 1][player].startsWith('Custom:') ? 'contained' : 'outlined'}
                  onPress={() => {
                    setCurrentPlayer(player);
                    setCustomScoreValue('');
                    setCustomScoreDialogVisible(true);
                  }}
                  style={[
                    styles.scoreButton, 
                    typeof scores[currentHole - 1][player] === 'string' && 
                    scores[currentHole - 1][player].startsWith('Custom:') && { 
                      backgroundColor: theme.colors.warning 
                    }
                  ]}
                  icon="plus-circle"
                >
                  {typeof scores[currentHole - 1][player] === 'string' && scores[currentHole - 1][player].startsWith('Custom:') 
                    ? scores[currentHole - 1][player].split(':')[1] 
                    : i18n.t('custom')}
                </Button>
              </View>
            ))}
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title={i18n.t('holeSelection')} titleStyle={cardStyles.title} />
        <Card.Content>
          <ScrollView
            horizontal
            contentContainerStyle={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 4 }}
            style={styles.holeNavigation}
            showsHorizontalScrollIndicator={false}
          >
            {Array.from({ length: holes }, (_, i) => {
              const hole = scores[i];
              const complete = players.every(p => hole[p] !== '');

              return (
                <Button
                  key={i}
                  mode={currentHole === i + 1 ? 'contained' : 'outlined'}
                  onPress={() => setCurrentHole(i + 1)}
                  style={styles.holeButton}
                  icon={complete ? 'check-circle' : 'alert-circle-outline'}
                  textColor={complete ? theme.colors.success : theme.colors.error}
                >
                  {i + 1}
                </Button>
              );
            })}
          </ScrollView>

          <Button
            mode="contained"
            onPress={() => {
              if (currentHole < holes) {
                setCurrentHole(currentHole + 1);
              } else {
                // End of game call
                nextHole();
              }
            }}
            style={styles.primaryButton}
            icon={currentHole < holes ? 'chevron-right' : 'flag-checkered'}
            textColor="white"
          >
            {currentHole < holes ? i18n.t('nextHole') : i18n.t('finish')}
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title={i18n.t('scores')} titleStyle={cardStyles.title} />
        <Card.Content>
          <View style={styles.gridRow}>
            {players.map(player => (
              <View key={player} style={styles.recapPlayerCol}>
                <Text style={styles.recapPlayerName}>{player}</Text>
                <Text style={cardStyles.scoreText}>
                  {i18n.t('scores')}: {totalScores[player] > 0 ? '+' + totalScores[player] : totalScores[player]}
                </Text>
                <Text style={[styles.recapScoreValue, { color: theme.colors.primary }]}>
                  {adjustedWolfScores[player]} 🦉
                </Text>
              </View>
            ))}
          </View>
        </Card.Content>
      </Card>
    </View>
  );
}
