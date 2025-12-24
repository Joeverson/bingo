// src/App.tsx
import { useState, useEffect } from 'react';
import { Gamepad2, FileText, Users, Settings, Download, LogOut } from 'lucide-react';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth } from './config/firebase';
import { BingoCard, GameConfig } from './types';
import { CardGenerator } from './components/CardGenerator';
import { CardRegistry } from './components/CardRegistry';
import { GamePanel } from './components/GamePanel';
import { WinnerModal } from './components/WinnerModal';
import { Login } from './components/Login';
import { NotificationContainer, NotificationType } from './components/Notification';
import { exportCardsToCSV } from './utils/csvExport';
import { initializeCardIdCounter } from './utils/cardGenerator';
import {
  saveCards,
  getAllCards,
  registerCard,
  unregisterCard,
  deleteAllCards,
} from './services/firebaseService';

type Tab = 'generate' | 'register' | 'play' | 'settings';

interface Notification {
  id: string;
  message: string;
  type: NotificationType;
}

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('generate');
  const [cards, setCards] = useState<BingoCard[]>([]);
  const [winner, setWinner] = useState<BingoCard | null>(null);
  const [gameConfig, setGameConfig] = useState<GameConfig>({
    enableDiagonals: false,
    gridSize: 5,
    freeCenter: true,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  // Estados do GamePanel preservados entre abas
  const [drawnNumbers, setDrawnNumbers] = useState<number[]>([]);
  const [isGameActive, setIsGameActive] = useState(false);
  
  // Estados do CardGenerator preservados entre abas
  const [generatedCards, setGeneratedCards] = useState<BingoCard[]>([]);
  
  // Estado de autenticação
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const showNotification = (message: string, type: NotificationType = 'info') => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, message, type }]);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };
  
  // Monitora estado de autenticação
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
      if (currentUser) {
        showNotification(`Bem-vindo, ${currentUser.displayName || 'Usuário'}!`, 'success');
      }
    });
    
    return () => unsubscribe();
  }, []);
  
  // Carrega cartelas do Firebase ao iniciar (apenas se autenticado)
  useEffect(() => {
    if (user) {
      loadCards();
    }
  }, [user]);
  
  const loadCards = async () => {
    try {
      setIsLoading(true);
      const loadedCards = await getAllCards();
      setCards(loadedCards);
      // Inicializa o contador de IDs baseado nas cartelas existentes
      initializeCardIdCounter(loadedCards);
    } catch (error) {
      console.error('Erro ao carregar cartelas:', error);
      showNotification('Erro ao carregar cartelas do Firebase', 'error');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCardsGenerated = async (newCards: BingoCard[]) => {
    try {
      await saveCards(newCards);
      setCards([...cards, ...newCards]);
      setGeneratedCards(newCards);
      showNotification(`${newCards.length} cartelas geradas e salvas com sucesso!`, 'success');
    } catch (error) {
      console.error('Erro ao salvar cartelas:', error);
      showNotification('Erro ao salvar cartelas. Verifique a conexão com o Firebase.', 'error');
    }
  };
  
  const handleRegisterCard = async (cardId: string, playerName: string) => {
    try {
      await registerCard(cardId, playerName);
      await loadCards(); // Recarrega as cartelas
      showNotification('Cartela registrada com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao registrar cartela:', error);
      showNotification('Erro ao registrar cartela.', 'error');
    }
  };
  
  const handleUnregisterCard = async (cardId: string) => {
    try {
      await unregisterCard(cardId);
      await loadCards();
      showNotification('Registro removido com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao remover registro:', error);
      showNotification('Erro ao remover registro.', 'error');
    }
  };
  
  const handleWinner = (winnerCard: BingoCard) => {
    setWinner(winnerCard);
  };
  
  const handleConfirmWinner = () => {
    showNotification(`Vitória confirmada para ${winner?.registeredTo || `Cartela #${winner?.id}`}!`, 'success');
    setWinner(null);
  };
  
  const handleExportCSV = () => {
    exportCardsToCSV(cards);
    showNotification('Arquivo CSV exportado com sucesso!', 'success');
  };
  
  const handleResetAllCards = async () => {
    if (
      confirm(
        'ATENÇÃO: Isso irá deletar TODAS as cartelas do sistema. Deseja continuar?'
      )
    ) {
      try {
        await deleteAllCards();
        setCards([]);
        showNotification('Todas as cartelas foram deletadas.', 'success');
      } catch (error) {
        console.error('Erro ao deletar cartelas:', error);
        showNotification('Erro ao deletar cartelas.', 'error');
      }
    }
  };
  
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setCards([]);
      setGeneratedCards([]);
      setDrawnNumbers([]);
      setIsGameActive(false);
      showNotification('Logout realizado com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      showNotification('Erro ao fazer logout.', 'error');
    }
  };
  
  // Se ainda está verificando autenticação
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }
  
  // Se não está autenticado, mostra tela de login
  if (!user) {
    return <Login onLoginSuccess={() => {}} />;
  }
  
  const tabs = [
    { id: 'generate' as Tab, label: 'Gerar Cartelas', icon: FileText },
    { id: 'register' as Tab, label: 'Registrar', icon: Users },
    { id: 'play' as Tab, label: 'Jogar', icon: Gamepad2 },
    { id: 'settings' as Tab, label: 'Configurações', icon: Settings },
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              🎱 Bingo Web App
            </h1>
            
            <div className="flex items-center gap-2">
              <div className="text-sm text-gray-600 mr-4">
                <span className="font-semibold">{user.displayName}</span>
              </div>
              
              <button
                onClick={handleExportCSV}
                disabled={cards.length === 0}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <Download size={20} />
                Exportar CSV
              </button>
              
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
              >
                <LogOut size={20} />
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Navigation Tabs */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-semibold transition-all ${
                    activeTab === tab.id
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={20} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Carregando...</p>
          </div>
        ) : (
          <>
            {activeTab === 'generate' && (
              <CardGenerator
                onCardsGenerated={handleCardsGenerated}
                gameConfig={gameConfig}
                generatedCards={generatedCards}
                setGeneratedCards={setGeneratedCards}
              />
            )}
            
            {activeTab === 'register' && (
              <CardRegistry
                cards={cards}
                onRegisterCard={handleRegisterCard}
                onUnregisterCard={handleUnregisterCard}
              />
            )}
            
            {activeTab === 'play' && (
              <>
                {cards.length === 0 ? (
                  <div className="bg-white rounded-lg shadow-md p-12 text-center">
                    <p className="text-gray-600 text-lg mb-4">
                      Nenhuma cartela disponível. Gere cartelas primeiro!
                    </p>
                    <button
                      onClick={() => setActiveTab('generate')}
                      className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Ir para Geração de Cartelas
                    </button>
                  </div>
                ) : (
                  <GamePanel
                    cards={cards}
                    gameConfig={gameConfig}
                    onWinner={handleWinner}
                    drawnNumbers={drawnNumbers}
                    setDrawnNumbers={setDrawnNumbers}
                    isGameActive={isGameActive}
                    setIsGameActive={setIsGameActive}
                  />
                )}
              </>
            )}
            
            {activeTab === 'settings' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Configurações do Jogo
                </h2>
                
                <div className="space-y-6">
                  {/* Configuração de diagonais */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        Diagonais Contam como Vitória
                      </h3>
                      <p className="text-sm text-gray-600">
                        Habilitar vitória por diagonais completas
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={gameConfig.enableDiagonals}
                        onChange={(e) =>
                          setGameConfig({
                            ...gameConfig,
                            enableDiagonals: e.target.checked,
                          })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  {/* Configuração de centro livre */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        Centro Livre (FREE)
                      </h3>
                      <p className="text-sm text-gray-600">
                        O centro da cartela começa marcado
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={gameConfig.freeCenter}
                        onChange={(e) =>
                          setGameConfig({
                            ...gameConfig,
                            freeCenter: e.target.checked,
                          })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  {/* Estatísticas */}
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 className="font-semibold text-blue-900 mb-3">
                      Estatísticas
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-blue-700">Total de Cartelas</p>
                        <p className="text-2xl font-bold text-blue-900">{cards.length}</p>
                      </div>
                      <div>
                        <p className="text-sm text-blue-700">Registradas</p>
                        <p className="text-2xl font-bold text-blue-900">
                          {cards.filter((c) => c.registeredTo).length}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-blue-700">Disponíveis</p>
                        <p className="text-2xl font-bold text-blue-900">
                          {cards.filter((c) => !c.registeredTo).length}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-blue-700">Tamanho Grade</p>
                        <p className="text-2xl font-bold text-blue-900">
                          {gameConfig.gridSize}x{gameConfig.gridSize}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Ações perigosas */}
                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <h3 className="font-semibold text-red-900 mb-3">
                      Zona de Perigo
                    </h3>
                    <button
                      onClick={handleResetAllCards}
                      className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Deletar Todas as Cartelas
                    </button>
                    <p className="text-sm text-red-700 mt-2">
                      Esta ação não pode ser desfeita!
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>
      
      {/* Modal de Vitória */}
      <WinnerModal
        winner={winner}
        onClose={() => setWinner(null)}
        onConfirm={handleConfirmWinner}
      />
      
      {/* Footer */}
      <footer className="bg-white mt-12 border-t">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-gray-600">
          <p>© 2025 Bingo Web App • Desenvolvido com React + TypeScript + Firebase</p>
        </div>
      </footer>

      {/* Notificações */}
      <NotificationContainer
        notifications={notifications}
        onRemove={removeNotification}
      />
    </div>
  );
}

export default App;
