# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

## [1.0.0] - 2025-12-24

### 🎉 Lançamento Inicial

#### ✨ Funcionalidades Principais

- **Geração de Cartelas**
  - Geração de N cartelas com números aleatórios únicos
  - Formato BINGO tradicional (5x5, colunas B-I-N-G-O)
  - Intervalos corretos: B(1-15), I(16-30), N(31-45), G(46-60), O(61-75)
  - Centro "FREE" opcional
  - IDs únicos para cada cartela

- **Impressão**
  - Sistema de impressão print-friendly
  - Layouts: 1, 2 ou 4 cartelas por página A4
  - Suporte para PDF e impressão direta
  - IDs legíveis em cada cartela

- **Registro de Jogadores**
  - Interface para associar cartela → jogador
  - Busca por nome ou ID
  - Lista de cartelas registradas com data
  - Opção de remover registros

- **Painel de Jogo**
  - Inserção manual de números sorteados (1-75)
  - Marcação automática em todas as cartelas
  - Validação de números duplicados
  - Estatísticas em tempo real
  - Números sorteados agrupados por letra (B-I-N-G-O)

- **Ranking de Proximidade**
  - Lista ordenada das 10 cartelas mais próximas de ganhar
  - Score baseado em: linhas completas > números marcados
  - Preview visual ao clicar na cartela
  - Atualização automática a cada número sorteado

- **Detecção de Vitória**
  - Algoritmo otimizado de detecção (O(n))
  - Modal animado "BINGOOO!" em tela cheia
  - Exibição do nome do vencedor em destaque
  - Confirmação manual de vitória

- **Persistência**
  - Integração com Firebase Firestore
  - Salvamento automático de cartelas
  - Sincronização de registros
  - Carregamento automático ao iniciar

#### 🚀 Funcionalidades Extras

- **Exportação CSV**
  - Exportar todas as cartelas em formato CSV
  - Inclui IDs, nomes, datas e números
  
- **Configurações**
  - Toggle para habilitar diagonais como vitória
  - Toggle para centro livre (FREE)
  - Estatísticas do sistema
  - Reset de todas as cartelas

- **Controles Avançados**
  - Desfazer último número sorteado
  - Reset completo do jogo
  - Confirmações para ações destrutivas

#### 🎨 Interface

- Design responsivo com Tailwind CSS
- Gradientes e cores vibrantes
- Animações suaves
- Ícones Lucide React
- Feedback visual em todas as ações
- Sistema de abas para navegação

#### 🔧 Tecnologias

- React 18 + TypeScript
- Vite (build tool)
- Firebase Firestore
- Tailwind CSS
- react-to-print
- lucide-react

#### 📚 Documentação

- README completo com instruções
- Guia de configuração do Firebase
- Instruções de impressão detalhadas
- Critérios de aceite documentados
- Troubleshooting guide

#### ⚡ Otimizações

- Índice de números para busca O(1)
- Algoritmo de detecção otimizado
- Renderização condicional
- Memoização de componentes

---

**Formato do versionamento**: [Major.Minor.Patch] seguindo [Semantic Versioning](https://semver.org/)
