// src/types/index.ts
export interface BingoCard {
  id: string;
  numbers: number[][]; // 5x5 grid
  createdAt: Date;
  registeredTo?: string; // Nome da pessoa que recebeu a cartela
  registeredAt?: Date;
}

export interface GameState {
  id: string;
  drawnNumbers: number[]; // Números sorteados
  startedAt: Date;
  isActive: boolean;
  winnerCardId?: string;
  winnerName?: string;
  wonAt?: Date;
  gameConfig: GameConfig;
}

export interface GameConfig {
  enableDiagonals: boolean; // Se diagonais contam como vitória
  gridSize: number; // Tamanho da grade (padrão 5x5)
  freeCenter: boolean; // Se o centro é livre
}

export interface CardProgress {
  cardId: string;
  playerName?: string;
  markedCount: number; // Total de números marcados
  completedLines: number; // Linhas completas (horizontal ou vertical)
  completedDiagonals: number; // Diagonais completas (se habilitado)
  proximityScore: number; // Score de proximidade da vitória
}

export interface DrawnNumber {
  number: number;
  drawnAt: Date;
  letter: 'B' | 'I' | 'N' | 'G' | 'O';
}

export type PrintLayout = 1 | 2 | 4; // Cartelas por página
