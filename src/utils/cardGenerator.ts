// src/utils/cardGenerator.ts
import { BingoCard, GameConfig } from '../types';

// Contador global para IDs sequenciais
let cardIdCounter = 1;

/**
 * Gera um ID sequencial simples para a cartela
 */
function generateCardId(): string {
  return (cardIdCounter++).toString();
}

/**
 * Reseta o contador de IDs (útil para testes)
 */
export function resetCardIdCounter(startFrom: number = 1): void {
  cardIdCounter = startFrom;
}

/**
 * Define o próximo ID baseado nas cartelas existentes
 */
export function initializeCardIdCounter(existingCards: BingoCard[]): void {
  if (existingCards.length === 0) {
    cardIdCounter = 1;
    return;
  }
  
  const maxId = existingCards.reduce((max, card) => {
    const id = parseInt(card.id);
    return isNaN(id) ? max : Math.max(max, id);
  }, 0);
  
  cardIdCounter = maxId + 1;
}

/**
 * Gera números aleatórios para uma coluna específica do Bingo
 * Formato BINGO tradicional:
 * - B: 1-15
 * - I: 16-30
 * - N: 31-45
 * - G: 46-60
 * - O: 61-75
 */
function getNumberRangeForColumn(columnIndex: number): [number, number] {
  const ranges: [number, number][] = [
    [1, 15],   // B
    [16, 30],  // I
    [31, 45],  // N
    [46, 60],  // G
    [61, 75],  // O
  ];
  return ranges[columnIndex];
}

/**
 * Gera números únicos aleatórios dentro de um intervalo
 */
function generateUniqueRandomNumbers(
  min: number,
  max: number,
  count: number
): number[] {
  const numbers: number[] = [];
  const available = Array.from({ length: max - min + 1 }, (_, i) => min + i);
  
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * available.length);
    numbers.push(available[randomIndex]);
    available.splice(randomIndex, 1);
  }
  
  // Retorna números em ordem aleatória (sem ordenar)
  return numbers;
}

/**
 * Gera uma única cartela de Bingo
 * @param config Configuração do jogo
 * @returns BingoCard
 */
export function generateBingoCard(config: GameConfig): BingoCard {
  const { gridSize, freeCenter } = config;
  const grid: number[][] = [];
  
  for (let col = 0; col < gridSize; col++) {
    const [min, max] = getNumberRangeForColumn(col);
    const columnNumbers = generateUniqueRandomNumbers(min, max, gridSize);
    grid.push(columnNumbers);
  }
  
  // Transpor a matriz (colunas -> linhas)
  const transposed: number[][] = [];
  for (let row = 0; row < gridSize; row++) {
    const rowNumbers: number[] = [];
    for (let col = 0; col < gridSize; col++) {
      rowNumbers.push(grid[col][row]);
    }
    transposed.push(rowNumbers);
  }
  
  // Se center livre, marcar como 0 (FREE)
  if (freeCenter && gridSize === 5) {
    const centerRow = Math.floor(gridSize / 2);
    const centerCol = Math.floor(gridSize / 2);
    transposed[centerRow][centerCol] = 0; // 0 indica espaço livre
  }
  
  return {
    id: generateCardId(),
    numbers: transposed,
    createdAt: new Date(),
  };
}

/**
 * Gera múltiplas cartelas de Bingo
 * @param count Número de cartelas a gerar
 * @param config Configuração do jogo
 * @returns Array de BingoCard
 */
export function generateBingoCards(
  count: number,
  config: GameConfig
): BingoCard[] {
  const cards: BingoCard[] = [];
  
  for (let i = 0; i < count; i++) {
    cards.push(generateBingoCard(config));
  }
  
  return cards;
}

/**
 * Obtém a letra BINGO para um índice de coluna
 */
export function getColumnLetter(columnIndex: number): 'B' | 'I' | 'N' | 'G' | 'O' {
  const letters: ('B' | 'I' | 'N' | 'G' | 'O')[] = ['B', 'I', 'N', 'G', 'O'];
  return letters[columnIndex] || 'B';
}

/**
 * Obtém a letra BINGO para um número específico
 */
export function getLetterForNumber(number: number): 'B' | 'I' | 'N' | 'G' | 'O' {
  if (number >= 1 && number <= 15) return 'B';
  if (number >= 16 && number <= 30) return 'I';
  if (number >= 31 && number <= 45) return 'N';
  if (number >= 46 && number <= 60) return 'G';
  if (number >= 61 && number <= 75) return 'O';
  return 'B';
}

/**
 * Valida se uma cartela está corretamente formatada
 */
export function validateCard(card: BingoCard): boolean {
  const { numbers } = card;
  
  // Verifica se é 5x5
  if (numbers.length !== 5) return false;
  if (numbers.some(row => row.length !== 5)) return false;
  
  // Verifica se os números estão nos intervalos corretos
  for (let col = 0; col < 5; col++) {
    const [min, max] = getNumberRangeForColumn(col);
    for (let row = 0; row < 5; row++) {
      const num = numbers[row][col];
      if (num === 0) continue; // FREE space
      if (num < min || num > max) return false;
    }
  }
  
  return true;
}
