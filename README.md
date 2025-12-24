# 🎱 Bingo Web App

Uma aplicação web completa de Bingo desenvolvida com React, TypeScript e Firebase. Gere cartelas, registre jogadores, conduza jogos ao vivo e detecte vencedores automaticamente!

## 🎯 Funcionalidades

### ✅ MVP (Versão Mínima Viável)

- **Geração de Cartelas**
  - Gerar N cartelas com números aleatórios únicos (formato BINGO tradicional 1-75)
  - Layout 5x5 com colunas B-I-N-G-O
  - Centro "FREE" opcional
  - IDs únicos para cada cartela

- **Impressão de Cartelas**
  - Impressão em formato print-friendly (PDF)
  - Opções de layout: 1, 2 ou 4 cartelas por página A4
  - IDs legíveis em cada cartela impressa

- **Registro de Cartelas**
  - Associar ID da cartela → nome do jogador
  - Visualizar e gerenciar lista de cartelas registradas
  - Buscar por nome ou ID
  - Remover registros

- **Painel de Jogo**
  - Inserir manualmente números sorteados (1-75)
  - Marcação automática em todas as cartelas
  - Validação de números duplicados
  - Estatísticas em tempo real

- **Ranking de Proximidade**
  - Lista ordenada de cartelas mais próximas de ganhar
  - Baseado em: linhas completas > números marcados
  - Preview visual da cartela ao clicar no ranking

- **Detecção de Vitória**
  - Detecção automática de linha horizontal ou vertical completa
  - Modal grande e animado "BINGOOO!" 🎉
  - Exibição do nome do vencedor em destaque
  - Confirmação manual de vitória

- **Persistência Firebase**
  - Todas as cartelas salvas no Firestore
  - Registros persistentes
  - Sincronização automática

### 🚀 Funcionalidades Avançadas

- **Configurações Personalizáveis**
  - Habilitar/desabilitar diagonais como vitória
  - Toggle para centro livre (FREE)
  - Configurações salvas localmente

- **Exportação de Dados**
  - Exportar lista de cartelas registradas em CSV
  - Inclui IDs, nomes, datas e números das cartelas

- **Controles Avançados**
  - Desfazer último número sorteado
  - Reset completo do jogo
  - Reset total de cartelas (com confirmação)

- **Interface Responsiva**
  - Design adaptável para desktop e mobile
  - Animações suaves e feedback visual
  - Gradientes e cores vibrantes

## 📋 Requisitos

- **Node.js** 18+ e npm/yarn
- **Conta Firebase** (gratuita)
- Navegador moderno (Chrome, Firefox, Edge, Safari)

## � Documentação Completa

| Documento | Descrição |
|-----------|-----------|
| [README.md](README.md) | 📘 **Você está aqui** - Documentação principal |
| [QUICKSTART.md](QUICKSTART.md) | 🚀 Setup em 5 minutos |
| [TROUBLESHOOTING.md](TROUBLESHOOTING.md) | 🛠️ Comandos úteis e solução de problemas |
| [INSTRUCOES_IMPRESSAO.md](INSTRUCOES_IMPRESSAO.md) | 🖨️ Guia detalhado de impressão |
| [EXEMPLOS_TESTES.md](EXEMPLOS_TESTES.md) | 🧪 Cenários de teste e validação |
| [DEPLOY.md](DEPLOY.md) | 🌐 Guia completo de deployment |
| [FIREBASE_DATA_STRUCTURE.md](FIREBASE_DATA_STRUCTURE.md) | 📊 Estrutura de dados Firestore |
| [ESTRUTURA_PROJETO.md](ESTRUTURA_PROJETO.md) | 🗺️ Mapa completo do código |

## �🚀 Como Rodar

### 1. Clonar e Instalar Dependências

```bash
cd "d:\Games Development\Bingo"
npm install
```

### 2. Configurar Firebase

#### 2.1. Criar Projeto Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em "Adicionar projeto"
3. Dê um nome ao projeto (ex: "bingo-webapp")
4. Desabilite Google Analytics (opcional)
5. Clique em "Criar projeto"

#### 2.2. Criar Web App

1. No console do Firebase, clique no ícone da Web (</>) em "Visão geral do projeto"
2. Registre o app com um apelido (ex: "Bingo Web")
3. **NÃO** marque "Firebase Hosting"
4. Copie as credenciais mostradas

#### 2.3. Habilitar Firestore

1. No menu lateral, vá em **Build > Firestore Database**
2. Clique em "Criar banco de dados"
3. Escolha modo "Produção" (começar em modo protegido)
4. Selecione a localização (recomendado: southamerica-east1 para Brasil)
5. Clique em "Ativar"

#### 2.4. Configurar Regras de Segurança

No Firestore, vá em **Regras** e cole:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Cartelas: leitura pública, escrita para todos (em produção, adicione autenticação)
    match /cards/{cardId} {
      allow read: if true;
      allow write: if true; // Em produção: if request.auth != null;
    }
    
    // Estado do jogo: leitura pública, escrita para todos
    match /gameState/{gameId} {
      allow read: if true;
      allow write: if true; // Em produção: if request.auth != null;
    }
  }
}
```

Clique em **Publicar**.

#### 2.5. Configurar Variáveis de Ambiente

1. Copie o arquivo de exemplo:
   ```bash
   copy .env.example .env
   ```

2. Edite o arquivo `.env` e preencha com suas credenciais do Firebase:
   ```env
   VITE_FIREBASE_API_KEY=sua-api-key-aqui
   VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=seu-projeto-id
   VITE_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=seu-sender-id
   VITE_FIREBASE_APP_ID=seu-app-id
   ```

### 3. Executar em Desenvolvimento

```bash
npm run dev
```

Acesse: http://localhost:3000

### 4. Build para Produção

```bash
npm run build
npm run preview
```

## 📖 Como Usar

### Fluxo de Uso Típico

1. **Gerar Cartelas**
   - Vá para a aba "Gerar Cartelas"
   - Defina o número de cartelas desejado (ex: 50)
   - Clique em "Gerar"
   - Preview de 6 cartelas aparecerá

2. **Imprimir Cartelas**
   - Na mesma tela, escolha o layout (1, 2 ou 4 por página)
   - Clique em "Imprimir"
   - Salve como PDF ou imprima diretamente
   - Cada cartela mostrará seu ID único

3. **Registrar Cartelas**
   - Vá para a aba "Registrar"
   - Selecione o ID da cartela impressa
   - Digite o nome do jogador
   - Clique em "Registrar"
   - A cartela agora está associada ao jogador

4. **Conduzir o Jogo**
   - Vá para a aba "Jogar"
   - Digite o número sorteado (1-75)
   - Pressione Enter ou clique em "Sortear"
   - Todas as cartelas são marcadas automaticamente
   - Veja o ranking de proximidade atualizar em tempo real

5. **Acompanhar Ranking**
   - O ranking mostra as cartelas mais próximas de ganhar
   - Clique em uma cartela para ver o preview
   - Números marcados aparecem em verde

6. **Vitória!**
   - Quando uma cartela completar uma linha ou coluna
   - Modal grande "BINGOOO!" aparece automaticamente
   - Nome do vencedor é mostrado em destaque
   - Clique em "Confirmar Vitória" para validar

7. **Exportar Dados**
   - Clique em "Exportar CSV" no header
   - Arquivo contém todos os registros e números das cartelas

### Configurações

- **Diagonais**: Habilite para contar diagonais como vitória
- **Centro Livre**: Deixe o centro da cartela marcado por padrão
- **Reset**: Use "Deletar Todas as Cartelas" apenas para limpar tudo

## 🎯 Critérios de Aceite

### ✅ Geração de Cartelas

- **DADO** que o usuário insere N = 10
- **QUANDO** clica em "Gerar"
- **ENTÃO** 10 cartelas únicas são criadas com números não repetidos por cartela
- **E** cada cartela possui um ID único legível
- **E** os números respeitam os intervalos B(1-15), I(16-30), N(31-45), G(46-60), O(61-75)

### ✅ Impressão

- **DADO** que existem cartelas geradas
- **QUANDO** o usuário seleciona layout "2 por página" e clica em "Imprimir"
- **ENTÃO** uma prévia de impressão abre com 2 cartelas por página A4
- **E** cada cartela exibe seu ID de forma legível

### ✅ Registro

- **DADO** que uma cartela com ID "CARD-123" está disponível
- **QUANDO** o usuário a registra para "João Silva"
- **ENTÃO** a cartela aparece na lista de registradas
- **E** o nome "João Silva" é associado a "CARD-123"

### ✅ Marcação Automática

- **DADO** que o número 12 é sorteado
- **QUANDO** o usuário insere "12" no painel de jogo
- **ENTÃO** todas as cartelas contendo o número 12 ficam marcadas visualmente em verde
- **E** o número 12 aparece na lista de "Números Sorteados" sob a coluna "B"
- **E** o ranking é atualizado em menos de 100ms

### ✅ Detecção de Vitória

- **DADO** que uma cartela tem 4 números marcados em uma linha
- **QUANDO** o 5º número dessa linha é sorteado
- **ENTÃO** o modal "BINGOOO!" aparece imediatamente
- **E** o nome do jogador (ou ID se não registrado) é exibido em fonte grande
- **E** o jogo para de aceitar novos números até confirmação

### ✅ Ranking de Proximidade

- **DADO** que múltiplas cartelas têm números marcados
- **QUANDO** o ranking é exibido
- **ENTÃO** cartelas com mais linhas completas aparecem primeiro
- **E** em caso de empate, cartelas com mais números marcados aparecem primeiro
- **E** o ranking atualiza automaticamente a cada número sorteado

## 🏗️ Estrutura do Projeto

```
bingo/
├── src/
│   ├── components/          # Componentes React
│   │   ├── BingoCard.tsx           # Cartela visual
│   │   ├── CardGenerator.tsx       # Gerador de cartelas
│   │   ├── CardRegistry.tsx        # Registro de jogadores
│   │   ├── GamePanel.tsx           # Painel de jogo
│   │   ├── PrintableCards.tsx      # Cartelas para impressão
│   │   └── WinnerModal.tsx         # Modal de vitória
│   ├── config/              # Configurações
│   │   └── firebase.ts             # Setup do Firebase
│   ├── services/            # Serviços externos
│   │   └── firebaseService.ts      # CRUD Firebase
│   ├── types/               # Tipos TypeScript
│   │   └── index.ts                # Interfaces e tipos
│   ├── utils/               # Utilitários
│   │   ├── cardGenerator.ts        # Lógica de geração
│   │   ├── gameLogic.ts            # Lógica do jogo (otimizada)
│   │   └── csvExport.ts            # Exportação CSV
│   ├── App.tsx              # Componente principal
│   ├── main.tsx             # Entrada da aplicação
│   └── index.css            # Estilos globais
├── .env.example             # Exemplo de variáveis
├── package.json             # Dependências
├── tsconfig.json            # Config TypeScript
├── tailwind.config.js       # Config Tailwind
├── vite.config.ts           # Config Vite
└── README.md                # Esta documentação
```

## 🔒 Segurança

### Versão Atual (MVP)

- Regras do Firestore permitem leitura/escrita pública
- Adequado para ambientes controlados ou testes
- **NÃO recomendado para produção sem autenticação**

### Para Produção

1. **Habilite Autenticação**:
   ```javascript
   // firebaseService.ts
   import { signInAnonymously } from 'firebase/auth';
   signInAnonymously(auth); // Autenticação anônima
   ```

2. **Atualize as Regras**:
   ```javascript
   allow write: if request.auth != null; // Apenas usuários autenticados
   ```

3. **Validação de Entrada**:
   - Todas as entradas são validadas antes do envio
   - Números de bingo verificados (1-75)
   - IDs únicos gerados com timestamp

## ⚡ Otimizações

### Algoritmo de Detecção

- **Índice de números**: O(1) para busca de números nas cartelas
- **Marcação**: Usa Set para verificação instantânea
- **Ranking**: Calcula apenas quando necessário
- **Complexidade**: O(n) onde n = número de cartelas

### Performance

- Renderização condicional para listas grandes
- Lazy loading de cartelas no ranking (primeiras 10)
- Memoização de componentes pesados
- Debounce em buscas

## 🐛 Troubleshooting

### "Firebase não configurado"

- Verifique se o arquivo `.env` existe e está preenchido
- Confirme que as variáveis começam com `VITE_`
- Reinicie o servidor de desenvolvimento após editar `.env`

### "Erro ao salvar cartelas"

- Verifique as regras do Firestore
- Confirme que o Firestore está habilitado no console
- Verifique a conexão com a internet

### Números não marcam automaticamente

- Verifique se o número está entre 1-75
- Confirme que as cartelas foram geradas corretamente
- Abra o console do navegador para ver erros

## 📦 Tecnologias Utilizadas

- **React 18** - Framework UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool ultra-rápido
- **Tailwind CSS** - Estilos utilitários
- **Firebase Firestore** - Banco de dados NoSQL
- **react-to-print** - Impressão de cartelas
- **lucide-react** - Ícones modernos

## 📝 Versões Futuras (Roadmap)

- [ ] Multiusuário em tempo real via WebSocket
- [ ] Espectadores podem ver marcações ao vivo
- [ ] Autenticação de organizadores
- [ ] Histórico de jogos anteriores
- [ ] Temas customizáveis
- [ ] Sons e efeitos visuais
- [ ] App mobile (React Native)
- [ ] Modo escuro

## 📄 Licença

Este projeto é livre para uso pessoal e educacional.

## 👨‍💻 Autor

Desenvolvido com ❤️ usando React, TypeScript e Firebase.

---

**Divirta-se jogando Bingo! 🎱🎉**
