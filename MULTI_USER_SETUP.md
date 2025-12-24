# 🔐 Atualização de Segurança - Cartelas por Usuário

## ✅ Alterações Implementadas

### 1. **Modelo de Dados Atualizado**
- Adicionado campo `userId` à interface `BingoCard`
- Cada cartela agora está vinculada ao usuário que a criou

### 2. **Serviços Firebase Atualizados**
Todas as funções agora requerem e filtram por `userId`:
- `getAllCards(userId)` - Busca apenas cartelas do usuário
- `registerCard(cardId, playerName, userId)` - Registra com verificação de propriedade
- `unregisterCard(cardId, userId)` - Remove registro com verificação
- `deleteAllCards(userId)` - Deleta apenas cartelas do usuário

### 3. **App.tsx Atualizado**
- Todas as operações agora passam o `user.uid` do Firebase Auth
- Cartelas geradas automaticamente recebem o `userId` do usuário logado
- Validações adicionadas para garantir que usuário está autenticado

### 4. **Regras de Segurança do Firestore**
Criado arquivo `firestore.rules` com regras que garantem:
- Usuários só podem ler suas próprias cartelas
- Usuários só podem criar cartelas vinculadas ao seu UID
- Usuários só podem atualizar/deletar suas próprias cartelas

## 📋 Próximos Passos

### 1. Aplicar as Regras de Segurança no Firebase

Acesse o [Firebase Console](https://console.firebase.google.com/):

1. Vá para **Firestore Database**
2. Clique na aba **Rules**
3. Copie o conteúdo do arquivo `firestore.rules` e cole no editor
4. Clique em **Publish**

**OU** use o Firebase CLI:
```bash
firebase deploy --only firestore:rules
```

### 2. Criar Índice Composto no Firestore

Como agora usamos `where('userId')` + `orderBy('createdAt')`, você precisa criar um índice:

**Opção A - Automático:**
1. Execute o app e tente carregar cartelas
2. Você receberá um erro com um link
3. Clique no link e o Firebase criará o índice automaticamente

**Opção B - Manual:**
1. Vá para **Firestore Database** > **Indexes**
2. Clique em **Create Index**
3. Configure:
   - Collection: `cards`
   - Fields:
     - `userId` (Ascending)
     - `createdAt` (Descending)
   - Query scope: Collection
4. Clique em **Create**

### 3. Migração de Dados Existentes (Se Necessário)

Se você já tem cartelas no Firestore sem o campo `userId`, você precisa:

**Opção 1 - Deletar dados antigos:**
```bash
# No Firebase Console > Firestore Database
# Delete manualmente a coleção 'cards'
```

**Opção 2 - Migrar dados (script):**
Crie um script para adicionar `userId` às cartelas existentes:

```javascript
// migration-script.js
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();

async function migrateCards() {
  const cardsRef = db.collection('cards');
  const snapshot = await cardsRef.get();
  
  const batch = db.batch();
  
  snapshot.forEach(doc => {
    if (!doc.data().userId) {
      // Substitua 'SEU_USER_ID_AQUI' pelo UID do usuário correto
      batch.update(doc.ref, { userId: 'SEU_USER_ID_AQUI' });
    }
  });
  
  await batch.commit();
  console.log('Migração concluída!');
}

migrateCards();
```

### 4. Testar o Sistema

1. Faça login com uma conta Google
2. Gere algumas cartelas
3. Faça logout
4. Faça login com outra conta
5. Verifique que as cartelas anteriores não aparecem
6. Gere novas cartelas para a segunda conta

## 🎯 Benefícios

✅ **Isolamento de Dados**: Cada usuário vê apenas suas cartelas
✅ **Segurança**: Regras do Firestore impedem acesso não autorizado
✅ **Multi-usuário**: Suporte completo para múltiplos usuários
✅ **Escalável**: Pronto para crescer com mais usuários

## ⚠️ Notas Importantes

- As cartelas antigas (sem userId) não serão mais acessíveis após aplicar as regras
- Cada usuário terá seu próprio conjunto de cartelas independente
- O contador de IDs é reiniciado por usuário (cada usuário tem IDs 1, 2, 3...)

## 🆘 Troubleshooting

### Erro: "Missing or insufficient permissions"
- Verifique se as regras do Firestore foram aplicadas corretamente
- Confirme que o usuário está autenticado (console.log(user))

### Cartelas não aparecem
- Verifique se o índice composto foi criado
- Aguarde alguns minutos para o índice ser construído

### Dados antigos desapareceram
- Normal! As regras de segurança bloqueiam cartelas sem userId
- Faça a migração de dados ou recrie as cartelas
