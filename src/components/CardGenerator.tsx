// src/components/CardGenerator.tsx
import { useState, useRef } from 'react';
import { Plus, Printer } from 'lucide-react';
import { BingoCard as BingoCardType, GameConfig, PrintLayout } from '../types';
import { generateBingoCards } from '../utils/cardGenerator';
import { BingoCard } from './BingoCard';
import { PrintableCards } from './PrintableCards';
import { useReactToPrint } from 'react-to-print';

interface CardGeneratorProps {
  onCardsGenerated: (cards: Omit<BingoCardType, 'userId'>[]) => void;
  gameConfig: GameConfig;
  generatedCards: Omit<BingoCardType, 'userId'>[];
  setGeneratedCards: (cards: Omit<BingoCardType, 'userId'>[]) => void;
}

export const CardGenerator: React.FC<CardGeneratorProps> = ({
  onCardsGenerated,
  gameConfig,
  generatedCards,
  setGeneratedCards,
}) => {
  const [cardCount, setCardCount] = useState<number>(10);
  const [printLayout, setPrintLayout] = useState<PrintLayout>(2);
  const printRef = useRef<HTMLDivElement>(null);
  
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Bingo-Cards-${new Date().toISOString().split('T')[0]}`,
  });
  
  const handleGenerate = () => {
    const cards = generateBingoCards(cardCount, gameConfig);
    setGeneratedCards(cards);
    onCardsGenerated(cards);
  };
  
  return (
    <div className="space-y-6">
      {/* Controles de geração */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Gerar Cartelas
        </h2>
        
        <div className="flex items-end gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Número de Cartelas
            </label>
            <input
              type="number"
              min="1"
              max="1000"
              value={cardCount}
              onChange={(e) => setCardCount(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <button
            onClick={handleGenerate}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            Gerar
          </button>
        </div>
      </div>
      
      {/* Cartelas geradas */}
      {generatedCards.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800">
              {generatedCards.length} Cartelas Geradas
            </h3>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Cartelas por página:
                </label>
                <select
                  value={printLayout}
                  onChange={(e) => setPrintLayout(Number(e.target.value) as PrintLayout)}
                  className="px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                >
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={4}>4</option>
                </select>
              </div>
              
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
              >
                <Printer size={20} />
                Imprimir
              </button>
            </div>
          </div>
          
          {/* Preview das primeiras 6 cartelas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {generatedCards.slice(0, 6).map((card) => (
              <BingoCard key={card.id} card={card} showId={true} />
            ))}
          </div>
          
          {generatedCards.length > 6 && (
            <p className="text-center text-gray-600 text-sm">
              ... e mais {generatedCards.length - 6} cartelas
            </p>
          )}
        </div>
      )}
      
      {/* Componente de impressão (invisível) */}
      <div className="hidden">
        <PrintableCards
          ref={printRef}
          cards={generatedCards}
          layout={printLayout}
        />
      </div>
    </div>
  );
};
