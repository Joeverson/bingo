// src/services/firebaseService.ts
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { BingoCard, GameState } from '../types';

const CARDS_COLLECTION = 'cards';
const GAME_STATE_COLLECTION = 'gameState';

/**
 * Converte Date para Timestamp do Firebase
 */
function dateToTimestamp(date: Date): Timestamp {
  return Timestamp.fromDate(date);
}

/**
 * Converte Timestamp do Firebase para Date
 */
function timestampToDate(timestamp: any): Date {
  if (timestamp?.toDate) {
    return timestamp.toDate();
  }
  return new Date(timestamp);
}

/**
 * Converte matriz 2D (number[][]) para formato Firestore compatível
 * Firestore não suporta arrays aninhados, então flatten o array
 */
function serializeNumbers(numbers: number[][]): number[] {
  return numbers.flat();
}

/**
 * Reconstrói matriz 2D a partir do formato Firestore
 */
function deserializeNumbers(flatNumbers: number[], gridSize: number = 5): number[][] {
  const matrix: number[][] = [];
  for (let i = 0; i < gridSize; i++) {
    matrix.push(flatNumbers.slice(i * gridSize, (i + 1) * gridSize));
  }
  return matrix;
}

// ============= CARTELAS =============

/**
 * Salva uma cartela no Firestore
 */
export async function saveCard(card: BingoCard): Promise<string> {
  const cardData = {
    ...card,
    numbers: serializeNumbers(card.numbers), // Converte array 2D para flat array
    createdAt: dateToTimestamp(card.createdAt),
    registeredAt: card.registeredAt ? dateToTimestamp(card.registeredAt) : null,
  };
  
  const docRef = await addDoc(collection(db, CARDS_COLLECTION), cardData);
  return docRef.id;
}

/**
 * Salva múltiplas cartelas no Firestore
 */
export async function saveCards(cards: BingoCard[]): Promise<void> {
  const promises = cards.map(card => saveCard(card));
  await Promise.all(promises);
}

/**
 * Busca todas as cartelas
 */
export async function getAllCards(): Promise<BingoCard[]> {
  const querySnapshot = await getDocs(collection(db, CARDS_COLLECTION));
  
  return querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      ...data,
      numbers: deserializeNumbers(data.numbers, 5), // Reconstrói matriz 2D
      createdAt: timestampToDate(data.createdAt),
      registeredAt: data.registeredAt ? timestampToDate(data.registeredAt) : undefined,
    } as BingoCard;
  });
}

/**
 * Busca uma cartela pelo ID
 */
export async function getCardById(cardId: string): Promise<BingoCard | null> {
  const cards = await getAllCards();
  return cards.find(card => card.id === cardId) || null;
}

/**
 * Busca cartelas registradas (com nome)
 */
export async function getRegisteredCards(): Promise<BingoCard[]> {
  const cards = await getAllCards();
  return cards.filter(card => card.registeredTo);
}

/**
 * Registra uma cartela para um jogador
 */
export async function registerCard(
  cardId: string,
  playerName: string
): Promise<void> {
  const cards = await getAllCards();
  const card = cards.find(c => c.id === cardId);
  
  if (!card) {
    throw new Error('Cartela não encontrada');
  }
  
  // Encontra o documento no Firestore pelo ID da cartela
  const querySnapshot = await getDocs(
    query(collection(db, CARDS_COLLECTION), where('id', '==', cardId))
  );
  
  if (querySnapshot.empty) {
    throw new Error('Documento da cartela não encontrado no Firestore');
  }
  
  const docId = querySnapshot.docs[0].id;
  const docRef = doc(db, CARDS_COLLECTION, docId);
  
  await updateDoc(docRef, {
    registeredTo: playerName,
    registeredAt: dateToTimestamp(new Date()),
  });
}

/**
 * Remove o registro de uma cartela
 */
export async function unregisterCard(cardId: string): Promise<void> {
  const querySnapshot = await getDocs(
    query(collection(db, CARDS_COLLECTION), where('id', '==', cardId))
  );
  
  if (querySnapshot.empty) return;
  
  const docId = querySnapshot.docs[0].id;
  const docRef = doc(db, CARDS_COLLECTION, docId);
  
  await updateDoc(docRef, {
    registeredTo: null,
    registeredAt: null,
  });
}

/**
 * Deleta todas as cartelas
 */
export async function deleteAllCards(): Promise<void> {
  const querySnapshot = await getDocs(collection(db, CARDS_COLLECTION));
  const promises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
  await Promise.all(promises);
}

// ============= ESTADO DO JOGO =============

/**
 * Salva o estado do jogo
 */
export async function saveGameState(gameState: GameState): Promise<string> {
  const gameData = {
    ...gameState,
    startedAt: dateToTimestamp(gameState.startedAt),
    wonAt: gameState.wonAt ? dateToTimestamp(gameState.wonAt) : null,
  };
  
  const docRef = await addDoc(collection(db, GAME_STATE_COLLECTION), gameData);
  return docRef.id;
}

/**
 * Atualiza o estado do jogo
 */
export async function updateGameState(
  gameId: string,
  updates: Partial<GameState>
): Promise<void> {
  const querySnapshot = await getDocs(
    query(collection(db, GAME_STATE_COLLECTION), where('id', '==', gameId))
  );
  
  if (querySnapshot.empty) return;
  
  const docId = querySnapshot.docs[0].id;
  const docRef = doc(db, GAME_STATE_COLLECTION, docId);
  
  const updateData: any = { ...updates };
  if (updates.wonAt) {
    updateData.wonAt = dateToTimestamp(updates.wonAt);
  }
  
  await updateDoc(docRef, updateData);
}

/**
 * Busca o estado do jogo ativo
 */
export async function getActiveGameState(): Promise<GameState | null> {
  const querySnapshot = await getDocs(
    query(
      collection(db, GAME_STATE_COLLECTION),
      where('isActive', '==', true),
      orderBy('startedAt', 'desc')
    )
  );
  
  if (querySnapshot.empty) return null;
  
  const data = querySnapshot.docs[0].data();
  return {
    ...data,
    startedAt: timestampToDate(data.startedAt),
    wonAt: data.wonAt ? timestampToDate(data.wonAt) : undefined,
  } as GameState;
}

/**
 * Deleta o estado do jogo
 */
export async function deleteGameState(gameId: string): Promise<void> {
  const querySnapshot = await getDocs(
    query(collection(db, GAME_STATE_COLLECTION), where('id', '==', gameId))
  );
  
  const promises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
  await Promise.all(promises);
}
