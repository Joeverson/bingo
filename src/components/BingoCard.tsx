// src/components/BingoCard.tsx
import { BingoCard as BingoCardType } from '../types';

interface BingoCardProps {
  card: Omit<BingoCardType, 'userId'> | BingoCardType;
  markedNumbers?: Set<number>;
  showId?: boolean;
  compact?: boolean;
  fluid?: boolean;
}

export const BingoCard: React.FC<BingoCardProps> = ({
  card,
  markedNumbers = new Set(),
  showId = true,
  compact = false,
  fluid = false,
}) => {
  const gridSize = card.numbers.length;
  const cellSize = fluid 
    ? 'w-full aspect-square text-xl' 
    : compact 
      ? 'w-10 h-10 text-sm' 
      : 'w-16 h-16 text-lg';
  
  return (
    <div className={`bg-white ${compact ? 'p-2' : 'p-4'} ${fluid ? 'w-full' : ''}`}>
      {showId && (
        <div className={`text-center font-bold text-gray-900 mb-3 ${compact ? 'text-lg' : 'text-2xl'}`}>
          #{card.id}
          {card.registeredTo && (
            <div className="text-gray-600 text-sm font-normal mt-1">{card.registeredTo}</div>
          )}
        </div>
      )}
      
      {/* Grade simples com BINGO no topo */}
      <div className={`inline-block border-2 border-gray-800 ${fluid ? 'w-full' : ''}`}>
        {/* Cabeçalho BINGO */}
        <div className="grid grid-cols-5 border-b-2 border-gray-800">
          {['B', 'I', 'N', 'G', 'O'].slice(0, gridSize).map((letter, index) => (
            <div
              key={index}
              className={`${cellSize} flex items-center justify-center font-black text-2xl text-gray-900 bg-white`}
            >
              {letter}
            </div>
          ))}
        </div>
        
        {/* Grade de números */}
        {card.numbers.map((row, rowIndex) => (
          <div key={rowIndex} className={`grid grid-cols-5 ${rowIndex < gridSize - 1 ? 'border-b border-gray-400' : ''}`}>
            {row.map((number, colIndex) => {
              const isMarked = number === 0 || markedNumbers.has(number);
              const isFree = number === 0;
              
              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`${cellSize} flex items-center justify-center font-semibold ${
                    colIndex < gridSize - 1 ? 'border-r border-gray-400' : ''
                  } ${
                    isMarked
                      ? 'bg-gray-200 text-gray-900'
                      : 'bg-white text-gray-900'
                  }`}
                >
                  {isFree ? (
                    <span className="text-xs font-bold">FREE</span>
                  ) : (
                    number
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
