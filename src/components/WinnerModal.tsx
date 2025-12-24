// src/components/WinnerModal.tsx
import { useEffect, useState } from 'react';
import { Trophy, X, CheckCircle } from 'lucide-react';
import { BingoCard } from '../types';

interface WinnerModalProps {
  winner: BingoCard | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const WinnerModal: React.FC<WinnerModalProps> = ({
  winner,
  onClose,
  onConfirm,
}) => {
  const [show, setShow] = useState(false);
  
  useEffect(() => {
    if (winner) {
      setShow(true);
    } else {
      setShow(false);
    }
  }, [winner]);
  
  if (!winner || !show) return null;
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-75 transition-opacity animate-pulse" />
      
      {/* Modal */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="relative bg-gradient-to-br from-yellow-400 via-orange-400 to-red-500 rounded-2xl shadow-2xl max-w-2xl w-full p-8 animate-bingo-pulse overflow-visible">
          {/* Botão fechar */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors z-10"
          >
            <X size={32} />
          </button>
          
          {/* Conteúdo */}
          <div className="text-center space-y-6">
            {/* Troféu animado */}
            <div className="flex justify-center">
              <div className="bg-white rounded-full p-6 shadow-xl animate-bounce">
                <Trophy size={80} className="text-yellow-500" />
              </div>
            </div>
            
            {/* Título BINGO com overflow */}
            <div className="relative -mx-24 overflow-visible" style={{ marginLeft: '-10em' }}>
              <h1 className="text-8xl md:text-[10rem] lg:text-[11rem] font-black text-white drop-shadow-2xl tracking-widest whitespace-nowrap">
                BINGOOO!
              </h1>
            </div>
            
            <p className="text-2xl md:text-3xl text-white font-bold pt-4">
              🎉 Temos um vencedor! 🎉
            </p>
            
            {/* Informações do vencedor */}
            <div className="bg-white rounded-xl p-6 shadow-xl">
              <p className="text-gray-600 text-lg mb-2">Vencedor</p>
              <p style={{ padding: '50px' }} className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                {winner.registeredTo || 'Cartela sem registro'}
              </p>
              <p className="text-gray-500 text-sm mt-3 font-mono">
                ID: {winner.id}
              </p>
            </div>
            
            {/* Mensagem de comemoração */}
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <p className="text-white text-lg font-semibold">
                Parabéns pela vitória! 🎊
              </p>
            </div>
            
            {/* Botões de ação */}
            <div className="flex gap-4 justify-center pt-4">
              <button
                onClick={onConfirm}
                className="flex items-center gap-2 px-8 py-4 bg-green-600 text-white text-xl font-bold rounded-xl hover:bg-green-700 transition-colors shadow-lg"
              >
                <CheckCircle size={28} />
                Confirmar Vitória
              </button>
              
              <button
                onClick={onClose}
                className="px-8 py-4 bg-gray-700 text-white text-xl font-bold rounded-xl hover:bg-gray-800 transition-colors shadow-lg"
              >
                Fechar
              </button>
            </div>
          </div>
          
          {/* Confetes decorativos */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-ping"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 3}s`,
                }}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    ['bg-yellow-300', 'bg-pink-400', 'bg-blue-400', 'bg-green-400'][
                      Math.floor(Math.random() * 4)
                    ]
                  }`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
