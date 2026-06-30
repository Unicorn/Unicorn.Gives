import AsyncStorage from '@react-native-async-storage/async-storage';

const keyFor = (gameId: string) => `@uni-gives/bingo-age/${gameId}`;

export async function getAgeAccepted(gameId: string): Promise<boolean> {
  try {
    return (await AsyncStorage.getItem(keyFor(gameId))) === 'true';
  } catch {
    return false;
  }
}

export async function setAgeAccepted(gameId: string): Promise<void> {
  try {
    await AsyncStorage.setItem(keyFor(gameId), 'true');
  } catch {
    // best-effort; non-fatal
  }
}
