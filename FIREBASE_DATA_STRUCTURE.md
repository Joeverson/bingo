# 📊 Estrutura de Dados Firebase

## Coleções Firestore

### 📝 Collection: `cards`

Armazena todas as cartelas de Bingo geradas.

**Estrutura de Documento:**

```typescript
{
  id: string;                    // ID único da cartela (ex: "CARD-1234567890-abc123")
  numbers: number[][];           // Grid 5x5 de números [[linha1], [linha2], ...]
  createdAt: Timestamp;          // Data/hora de criação
  registeredTo?: string;         // Nome do jogador (opcional, null se não registrado)
  registeredAt?: Timestamp;      // Data/hora de registro (opcional)
}
```

**Exemplo:**

```json
{
  "id": "CARD-1703433600000-x7k2m9",
  "numbers": [
    [3, 18, 34, 52, 70],
    [7, 22, 0, 48, 63],
    [12, 27, 31, 54, 68],
    [1, 19, 38, 60, 72],
    [15, 29, 45, 59, 75]
  ],
  "createdAt": "2025-12-24T10:00:00.000Z",
  "registeredTo": "João Silva",
  "registeredAt": "2025-12-24T10:30:00.000Z"
}
```

**Índices Recomendados:**
- `id` (Ascending)
- `registeredTo` (Ascending)
- `createdAt` (Descending)

---

### 🎮 Collection: `gameState`

Armazena o estado atual dos jogos.

**Estrutura de Documento:**

```typescript
{
  id: string;                    // ID único do jogo
  drawnNumbers: number[];        // Array de números sorteados [5, 12, 23, ...]
  startedAt: Timestamp;          // Data/hora de início
  isActive: boolean;             // Se o jogo está ativo
  winnerCardId?: string;         // ID da cartela vencedora (opcional)
  winnerName?: string;           // Nome do vencedor (opcional)
  wonAt?: Timestamp;             // Data/hora da vitória (opcional)
  gameConfig: {
    enableDiagonals: boolean;    // Se diagonais contam
    gridSize: number;            // Tamanho da grade (padrão: 5)
    freeCenter: boolean;         // Se centro é livre
  }
}
```

**Exemplo:**

```json
{
  "id": "GAME-1703433600000-abc123",
  "drawnNumbers": [5, 12, 18, 23, 34, 45, 52, 63, 70],
  "startedAt": "2025-12-24T14:00:00.000Z",
  "isActive": true,
  "gameConfig": {
    "enableDiagonals": false,
    "gridSize": 5,
    "freeCenter": true
  }
}
```

**Índices Recomendados:**
- `isActive` (Ascending)
- `startedAt` (Descending)

---

## 🔒 Regras de Segurança

### Desenvolvimento (Permissivo)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // Acesso total para desenvolvimento
    }
  }
}
```

### Produção (Recomendado)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Cartelas: leitura pública, escrita autenticada
    match /cards/{cardId} {
      allow read: if true;
      allow create: if request.auth != null && 
                      request.resource.data.id is string &&
                      request.resource.data.numbers is list &&
                      request.resource.data.numbers.size() == 5;
      allow update: if request.auth != null;
      allow delete: if request.auth != null;
    }
    
    // Estado do jogo: leitura pública, escrita autenticada
    match /gameState/{gameId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### Produção Avançada (Com Roles)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Função helper para verificar admin
    function isAdmin() {
      return request.auth != null && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Cartelas
    match /cards/{cardId} {
      allow read: if true; // Todos podem ler
      allow create: if isAdmin(); // Apenas admins criam
      allow update: if isAdmin(); // Apenas admins editam
      allow delete: if isAdmin(); // Apenas admins deletam
    }
    
    // Estado do jogo
    match /gameState/{gameId} {
      allow read: if true; // Todos podem ler
      allow write: if isAdmin(); // Apenas admins modificam
    }
    
    // Usuários (se implementar roles)
    match /users/{userId} {
      allow read: if request.auth.uid == userId;
      allow write: if false; // Apenas backend pode modificar roles
    }
  }
}
```

---

## 📈 Consultas Otimizadas

### Buscar cartelas registradas

```typescript
const registeredCards = await getDocs(
  query(
    collection(db, 'cards'),
    where('registeredTo', '!=', null),
    orderBy('registeredAt', 'desc')
  )
);
```

### Buscar jogo ativo

```typescript
const activeGame = await getDocs(
  query(
    collection(db, 'gameState'),
    where('isActive', '==', true),
    orderBy('startedAt', 'desc'),
    limit(1)
  )
);
```

### Buscar cartelas por jogador

```typescript
const playerCards = await getDocs(
  query(
    collection(db, 'cards'),
    where('registeredTo', '==', 'João Silva')
  )
);
```

---

## 💾 Estratégias de Backup

### 1. Export Manual

No Firebase Console:
1. Vá em Firestore Database
2. Clique nos três pontos (...)
3. Selecione "Export data"
4. Escolha as coleções
5. Especifique bucket do Cloud Storage

### 2. Backup Automático (Firebase CLI)

```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Fazer backup
firebase firestore:export gs://seu-bucket/backup-$(date +%Y%m%d)
```

### 3. Scheduled Backups (Cloud Functions)

```typescript
// functions/src/index.ts
import * as functions from 'firebase-functions';
import * as firestore from '@google-cloud/firestore';

const client = new firestore.v1.FirestoreAdminClient();

export const scheduledFirestoreBackup = functions.pubsub
  .schedule('every 24 hours')
  .onRun(async (context) => {
    const projectId = process.env.GCP_PROJECT || process.env.GCLOUD_PROJECT;
    const databaseName = client.databasePath(projectId, '(default)');
    const bucket = `gs://${projectId}-firestore-backups`;

    await client.exportDocuments({
      name: databaseName,
      outputUriPrefix: bucket,
      collectionIds: ['cards', 'gameState']
    });
    
    console.log('Backup completed');
  });
```

---

## 📊 Estrutura CSV de Export

### Formato de Exportação

```csv
ID da Cartela,Registrada Para,Data de Criação,Data de Registro,Números (Linha 1),Números (Linha 2),Números (Linha 3),Números (Linha 4),Números (Linha 5)
"CARD-123","João Silva","24/12/2025 10:00","24/12/2025 11:00","3 18 34 52 70","7 22 FREE 48 63","12 27 31 54 68","1 19 38 60 72","15 29 45 59 75"
"CARD-456","Maria Santos","24/12/2025 10:01","-","5 17 45 59 62","8 21 32 51 70","1 29 FREE 47 63","14 24 44 55 71","10 19 38 60 68"
```

### Campos

- **ID da Cartela**: Identificador único
- **Registrada Para**: Nome do jogador ou "-" se não registrado
- **Data de Criação**: Timestamp de criação
- **Data de Registro**: Timestamp de registro ou "-"
- **Números (Linhas 1-5)**: Números separados por espaço, "FREE" para centro

---

## 🔄 Migração de Dados

### Script de Migração (se necessário)

```typescript
// scripts/migrate.ts
import { db } from '../src/config/firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';

async function migrateCards() {
  const cardsSnapshot = await getDocs(collection(db, 'cards'));
  
  for (const cardDoc of cardsSnapshot.docs) {
    const data = cardDoc.data();
    
    // Adicionar campo novo se não existir
    if (!data.hasOwnProperty('registeredTo')) {
      await updateDoc(doc(db, 'cards', cardDoc.id), {
        registeredTo: null,
        registeredAt: null
      });
      console.log(`Migrated card ${cardDoc.id}`);
    }
  }
  
  console.log('Migration complete!');
}

migrateCards().catch(console.error);
```

---

## 📏 Limites do Firestore (Free Tier)

### Quotas Diárias
- **Reads**: 50,000 / dia
- **Writes**: 20,000 / dia
- **Deletes**: 20,000 / dia
- **Storage**: 1 GB

### Limites por Documento
- **Tamanho máximo**: 1 MB
- **Campos máximos**: ~20,000
- **Nested depth**: 20 níveis

### Estimativa de Uso

**Cenário: 100 jogadores, 10 jogos/dia**

- Criação de 100 cartelas: **100 writes**
- Registro de cartelas: **100 updates**
- Carregar cartelas: **100 reads**
- Salvar estado do jogo: **~50 writes** (atualizações)
- Carregar estado: **~50 reads**

**Total aproximado por dia**: 
- Writes: ~250
- Reads: ~150

✅ Bem dentro do limite gratuito!

---

## 🛠️ Ferramentas Úteis

### Firebase Emulator (Desenvolvimento Local)

```bash
# Instalar emulator
firebase init emulators

# Rodar localmente
firebase emulators:start
```

```typescript
// Usar emulator em desenvolvimento
if (location.hostname === 'localhost') {
  connectFirestoreEmulator(db, 'localhost', 8080);
}
```

### Visualizar Dados

- **Firebase Console**: https://console.firebase.google.com/
- **Postman**: Pode fazer queries REST API
- **VSCode Extension**: Firebase Explorer

---

**Esta documentação cobre toda a estrutura de dados do sistema!**
