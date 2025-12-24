// src/components/GamePanel.tsx
import { useState, useEffect } from 'react';
import { Play, RotateCcw, Trophy } from 'lucide-react';
import { BingoCard, GameConfig, CardProgress } from '../types';
import { calculateAllProgress, findWinners } from '../utils/gameLogic';
import { getLetterForNumber } from '../utils/cardGenerator';
import { BingoCard as BingoCardComponent } from './BingoCard';

interface GamePanelProps {
  cards: BingoCard[];
  gameConfig: GameConfig;
  onWinner: (winner: BingoCard) => void;
  drawnNumbers: number[];
  setDrawnNumbers: (numbers: number[]) => void;
  isGameActive: boolean;
  setIsGameActive: (active: boolean) => void;
}

export const GamePanel: React.FC<GamePanelProps> = ({
  cards,
  gameConfig,
  onWinner,
  drawnNumbers,
  setDrawnNumbers,
  isGameActive,
  setIsGameActive,
}) => {
  const [currentNumber, setCurrentNumber] = useState('');
  const [rankings, setRankings] = useState<CardProgress[]>([]);
  const [selectedCard, setSelectedCard] = useState<BingoCard | null>(null);
  
  // Atualiza rankings quando números são sorteados
  useEffect(() => {
    if (cards.length > 0 && drawnNumbers.length > 0) {
      const progress = calculateAllProgress(cards, drawnNumbers, gameConfig);
      // Filtrar apenas cartelas registradas
      const registeredProgress = progress.filter(p => {
        const card = cards.find(c => c.id === p.cardId);
        return card?.registeredTo;
      });
      setRankings(registeredProgress);
      
      // Verifica se há vencedor
      const winners = findWinners(cards, drawnNumbers, gameConfig);
      if (winners.length > 0 && isGameActive) {
        onWinner(winners[0]);
        setIsGameActive(false);
      }
    }
  }, [drawnNumbers, cards, gameConfig, isGameActive, onWinner]);
  
  const handleDrawNumber = () => {
    const num = parseInt(currentNumber);
    
    if (isNaN(num) || num < 1 || num > 75) {
      // Validação silenciosa - não mostra nada
      return;
    }
    
    if (drawnNumbers.includes(num)) {
      // Validação silenciosa - não mostra nada
      return;
    }
    
    if (!isGameActive) {
      setIsGameActive(true);
    }
    
    setDrawnNumbers([...drawnNumbers, num]);
    setCurrentNumber('');
  };
  
  const handleReset = () => {
    if (confirm('Tem certeza que deseja resetar o jogo?')) {
      setDrawnNumbers([]);
      setIsGameActive(false);
      setRankings([]);
      setSelectedCard(null);
    }
  };
  
  const handleRemoveLastNumber = () => {
    if (drawnNumbers.length > 0) {
      setDrawnNumbers(drawnNumbers.slice(0, -1));
    }
  };
  
  const groupedNumbers = {
    B: drawnNumbers.filter(n => n >= 1 && n <= 15),
    I: drawnNumbers.filter(n => n >= 16 && n <= 30),
    N: drawnNumbers.filter(n => n >= 31 && n <= 45),
    G: drawnNumbers.filter(n => n >= 46 && n <= 60),
    O: drawnNumbers.filter(n => n >= 61 && n <= 75),
  };
  
  return (
    <div className="space-y-6">
      {/* Controles do jogo */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Play size={28} />
            Painel do Jogo
          </h2>
          
          <div className="flex gap-2">
            <button
              onClick={handleRemoveLastNumber}
              disabled={drawnNumbers.length === 0}
              className="px-4 py-2 bg-yellow-600 text-white font-semibold rounded-lg hover:bg-yellow-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Desfazer Último
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
            >
              <RotateCcw size={20} />
              Resetar
            </button>
          </div>
        </div>
        
        <div className="flex gap-4 items-end mb-6">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Inserir Número Sorteado (1-75)
            </label>
            <input
              type="number"
              min="1"
              max="75"
              value={currentNumber}
              onChange={(e) => setCurrentNumber(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleDrawNumber()}
              placeholder="Digite o número..."
              className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <button
            onClick={handleDrawNumber}
            disabled={!currentNumber}
            className="px-8 py-3 bg-green-600 text-white text-lg font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Sortear
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="text-sm text-gray-600">Números Sorteados</div>
            <div className="text-3xl font-bold text-blue-600">{drawnNumbers.length}</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-3">
            <div className="text-sm text-gray-600">Cartelas no Jogo</div>
            <div className="text-3xl font-bold text-purple-600">{cards.length}</div>
          </div>
          <div className="bg-green-50 rounded-lg p-3">
            <div className="text-sm text-gray-600">Cartelas Registradas</div>
            <div className="text-3xl font-bold text-green-600">
              {cards.filter(c => c.registeredTo).length}
            </div>
          </div>
          <div className="bg-orange-50 rounded-lg p-3">
            <div className="text-sm text-gray-600">Status</div>
            <div className={`text-lg font-bold ${isGameActive ? 'text-green-600' : 'text-gray-400'}`}>
              {isGameActive ? 'Em Jogo' : 'Aguardando'}
            </div>
          </div>
        </div>
      </div>
      
      {/* Números sorteados */}
      {drawnNumbers.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Números Sorteados
          </h3>
          
          <div className="space-y-3">
            {Object.entries(groupedNumbers).map(([letter, numbers]) => (
              <div key={letter}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 flex items-center justify-center bg-blue-600 text-white font-bold text-xl rounded">
                    {letter}
                  </div>
                  <div className="flex-1 flex flex-wrap gap-2">
                    {numbers.length === 0 ? (
                      <span className="text-gray-400">-</span>
                    ) : (
                      numbers.map(num => (
                        <span
                          key={num}
                          className="inline-flex items-center justify-center w-10 h-10 bg-green-100 text-green-800 font-semibold rounded-full"
                        >
                          {num}
                        </span>
                      ))
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {drawnNumbers.length > 0 && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Último sorteado:</strong> {getLetterForNumber(drawnNumbers[drawnNumbers.length - 1])}-{drawnNumbers[drawnNumbers.length - 1]}
              </p>
            </div>
          )}
        </div>
      )}
      
      {/* Ranking e preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ranking */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Trophy size={24} className="text-yellow-500" />
            Ranking (Mais Próximos de Ganhar)
          </h3>
          
          {rankings.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              Sorteie números para ver o ranking
            </p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {rankings.slice(0, 10).map((progress, index) => (
                <div
                  key={progress.cardId}
                  onClick={() => {
                    const card = cards.find(c => c.id === progress.cardId);
                    setSelectedCard(card || null);
                  }}
                  className={`p-3 rounded-lg cursor-pointer transition-all ${
                    index === 0
                      ? 'bg-yellow-50 border-2 border-yellow-400'
                      : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold ${
                        index === 0
                          ? 'bg-yellow-400 text-white'
                          : 'bg-gray-300 text-gray-700'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">
                          {progress.playerName || `Cartela #${progress.cardId}`}
                        </div>
                        <div className="text-xs text-gray-600">
                          {progress.markedCount} marcados • {progress.completedLines} linhas completas
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-blue-600">
                        {progress.proximityScore}
                      </div>
                      <div className="text-xs text-gray-500">pontos</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Preview da cartela selecionada */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Preview da Cartela
          </h3>
          
          {selectedCard ? (
            <div className="flex justify-center">
              <BingoCardComponent
                card={selectedCard}
                markedNumbers={new Set(drawnNumbers)}
                showId={true}
              />
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              Clique em uma cartela no ranking para visualizar
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
