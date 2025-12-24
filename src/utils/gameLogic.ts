// src/utils/gameLogic.ts
import { BingoCard, CardProgress, GameConfig } from '../types';

/**
 * Estrutura otimizada para busca rápida de números nas cartelas
 * Mapa: número -> array de { cardId, row, col }
 */
interface NumberIndex {
  [number: number]: Array<{
    cardId: string;
    row: number;
    col: number;
  }>;
}

/**
 * Cria um índice de números para busca otimizada O(1)
 * @param cards Array de cartelas
 * @returns Índice de números
 */
export function createNumberIndex(cards: BingoCard[]): NumberIndex {
  const index: NumberIndex = {};
  
  cards.forEach(card => {
    card.numbers.forEach((row, rowIndex) => {
      row.forEach((number, colIndex) => {
        if (number === 0) return; // FREE space
        
        if (!index[number]) {
          index[number] = [];
        }
        
        index[number].push({
          cardId: card.id,
          row: rowIndex,
          col: colIndex,
        });
      });
    });
  });
  
  return index;
}

/**
 * Verifica quais números de uma cartela foram sorteados
 * @param card Cartela
 * @param drawnNumbers Números sorteados
 * @returns Set com números marcados
 */
export function getMarkedNumbers(
  card: BingoCard,
  drawnNumbers: number[]
): Set<number> {
  const drawnSet = new Set(drawnNumbers);
  const marked = new Set<number>();
  
  card.numbers.forEach(row => {
    row.forEach(num => {
      if (num === 0 || drawnSet.has(num)) {
        marked.add(num);
      }
    });
  });
  
  return marked;
}

/**
 * Cria uma matriz de marcação (true = marcado, false = não marcado)
 * @param card Cartela
 * @param drawnNumbers Números sorteados
 * @returns Matriz booleana 5x5
 */
export function createMarkedGrid(
  card: BingoCard,
  drawnNumbers: number[]
): boolean[][] {
  const drawnSet = new Set(drawnNumbers);
  
  return card.numbers.map(row =>
    row.map(num => num === 0 || drawnSet.has(num))
  );
}

/**
 * Verifica se uma linha está completa
 * @param markedGrid Grade de marcação
 * @param row Índice da linha
 * @returns true se a linha está completa
 */
function isRowComplete(markedGrid: boolean[][], row: number): boolean {
  return markedGrid[row].every(marked => marked);
}

/**
 * Verifica se uma coluna está completa
 * @param markedGrid Grade de marcação
 * @param col Índice da coluna
 * @returns true se a coluna está completa
 */
function isColumnComplete(markedGrid: boolean[][], col: number): boolean {
  return markedGrid.every(row => row[col]);
}

/**
 * Verifica se a diagonal principal está completa
 * @param markedGrid Grade de marcação
 * @returns true se a diagonal está completa
 */
function isDiagonalDownComplete(markedGrid: boolean[][]): boolean {
  return markedGrid.every((row, i) => row[i]);
}

/**
 * Verifica se a diagonal secundária está completa
 * @param markedGrid Grade de marcação
 * @returns true se a diagonal está completa
 */
function isDiagonalUpComplete(markedGrid: boolean[][]): boolean {
  const size = markedGrid.length;
  return markedGrid.every((row, i) => row[size - 1 - i]);
}

/**
 * Verifica se uma cartela ganhou
 * @param card Cartela
 * @param drawnNumbers Números sorteados
 * @param config Configuração do jogo
 * @returns true se a cartela ganhou
 */
export function checkWin(
  card: BingoCard,
  drawnNumbers: number[],
  config: GameConfig
): boolean {
  const markedGrid = createMarkedGrid(card, drawnNumbers);
  const size = config.gridSize;
  
  // Verifica linhas horizontais
  for (let row = 0; row < size; row++) {
    if (isRowComplete(markedGrid, row)) return true;
  }
  
  // Verifica colunas verticais
  for (let col = 0; col < size; col++) {
    if (isColumnComplete(markedGrid, col)) return true;
  }
  
  // Verifica diagonais (se habilitado)
  if (config.enableDiagonals) {
    if (isDiagonalDownComplete(markedGrid)) return true;
    if (isDiagonalUpComplete(markedGrid)) return true;
  }
  
  return false;
}

/**
 * Calcula o progresso de uma cartela (OTIMIZADO)
 * @param card Cartela
 * @param drawnNumbers Números sorteados
 * @param config Configuração do jogo
 * @returns CardProgress
 */
export function calculateCardProgress(
  card: BingoCard,
  drawnNumbers: number[],
  config: GameConfig
): CardProgress {
  const markedGrid = createMarkedGrid(card, drawnNumbers);
  const drawnSet = new Set(drawnNumbers);
  const size = config.gridSize;
  
  let markedCount = 0;
  let completedLines = 0;
  let completedDiagonals = 0;
  
  // Conta números marcados (excluindo FREE space)
  card.numbers.forEach(row => {
    row.forEach(num => {
      if (num !== 0 && drawnSet.has(num)) {
        markedCount++;
      }
    });
  });
  
  // Conta linhas completas
  for (let row = 0; row < size; row++) {
    if (isRowComplete(markedGrid, row)) completedLines++;
  }
  
  // Conta colunas completas
  for (let col = 0; col < size; col++) {
    if (isColumnComplete(markedGrid, col)) completedLines++;
  }
  
  // Conta diagonais completas
  if (config.enableDiagonals) {
    if (isDiagonalDownComplete(markedGrid)) completedDiagonals++;
    if (isDiagonalUpComplete(markedGrid)) completedDiagonals++;
  }
  
  // Score de proximidade: linhas completas valem muito mais
  const proximityScore = 
    (completedLines * 1000) + 
    (completedDiagonals * 500) + 
    markedCount;
  
  return {
    cardId: card.id,
    playerName: card.registeredTo,
    markedCount,
    completedLines,
    completedDiagonals,
    proximityScore,
  };
}

/**
 * Calcula progresso de todas as cartelas e ordena por proximidade
 * @param cards Array de cartelas
 * @param drawnNumbers Números sorteados
 * @param config Configuração do jogo
 * @returns Array ordenado de CardProgress
 */
export function calculateAllProgress(
  cards: BingoCard[],
  drawnNumbers: number[],
  config: GameConfig
): CardProgress[] {
  const progressList = cards.map(card =>
    calculateCardProgress(card, drawnNumbers, config)
  );
  
  // Ordena por proximityScore (maior primeiro)
  return progressList.sort((a, b) => b.proximityScore - a.proximityScore);
}

/**
 * Encontra todas as cartelas vencedoras
 * @param cards Array de cartelas
 * @param drawnNumbers Números sorteados
 * @param config Configuração do jogo
 * @returns Array de cartelas vencedoras
 */
export function findWinners(
  cards: BingoCard[],
  drawnNumbers: number[],
  config: GameConfig
): BingoCard[] {
  return cards.filter(card => checkWin(card, drawnNumbers, config));
}
