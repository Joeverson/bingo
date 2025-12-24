// src/components/CardRegistry.tsx
import React, { useState } from 'react';
import { UserPlus, Search, X, Users } from 'lucide-react';
import { BingoCard } from '../types';

interface CardRegistryProps {
  cards: BingoCard[];
  onRegisterCard: (cardId: string, playerName: string) => void;
  onUnregisterCard: (cardId: string) => void;
}

export const CardRegistry: React.FC<CardRegistryProps> = ({
  cards,
  onRegisterCard,
  onUnregisterCard,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCardId, setSelectedCardId] = useState('');
  const [playerName, setPlayerName] = useState('');
  
  const registeredCards = cards.filter(card => card.registeredTo);
  const unregisteredCards = cards.filter(card => !card.registeredTo);
  
  const filteredCards = registeredCards.filter(
    card =>
      card.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.registeredTo?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleRegister = () => {
    if (selectedCardId && playerName.trim()) {
      onRegisterCard(selectedCardId, playerName.trim());
      setSelectedCardId('');
      setPlayerName('');
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Formulário de registro */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <UserPlus size={28} />
          Registrar Cartela
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ID da Cartela
            </label>
            <select
              value={selectedCardId}
              onChange={(e) => setSelectedCardId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Selecione uma cartela...</option>
              {unregisteredCards.map(card => (
                <option key={card.id} value={card.id}>
                  Cartela #{card.id}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome do Jogador
            </label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Digite o nome..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-end">
            <button
              onClick={handleRegister}
              disabled={!selectedCardId || !playerName.trim()}
              className="w-full px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Registrar
            </button>
          </div>
        </div>
        
        <div className="mt-4 text-sm text-gray-600">
          <p>Cartelas disponíveis: {unregisteredCards.length}</p>
          <p>Cartelas registradas: {registeredCards.length}</p>
        </div>
      </div>
      
      {/* Lista de cartelas registradas */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Users size={24} />
            Cartelas Registradas ({registeredCards.length})
          </h3>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nome ou ID..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        {filteredCards.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {registeredCards.length === 0
              ? 'Nenhuma cartela registrada ainda'
              : 'Nenhuma cartela encontrada'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID da Cartela
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jogador
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data de Registro
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCards.map(card => (
                  <tr key={card.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-mono text-gray-900">
                      {card.id}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-semibold">
                      {card.registeredTo}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {card.registeredAt?.toLocaleString('pt-BR')}
                    </td>
                    <td className="px-4 py-3 text-right text-sm">
                      <button
                        onClick={() => onUnregisterCard(card.id)}
                        className="text-red-600 hover:text-red-800 font-medium flex items-center gap-1 ml-auto"
                      >
                        <X size={16} />
                        Remover
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
