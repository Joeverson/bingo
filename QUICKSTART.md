# 🚀 Guia de Início Rápido

## Setup em 5 Minutos

### 1️⃣ Instalar Dependências (1 min)

```bash
cd "d:\Games Development\Bingo"
npm install
```

### 2️⃣ Configurar Firebase (2 min)

1. Acesse: https://console.firebase.google.com/
2. Crie um projeto novo
3. Adicione um Web App
4. Copie as credenciais

### 3️⃣ Configurar .env (1 min)

```bash
# Copie o exemplo
copy .env.example .env

# Edite .env com suas credenciais do Firebase
```

### 4️⃣ Habilitar Firestore (1 min)

1. No Firebase Console: **Build > Firestore Database**
2. Clique em **Criar banco de dados**
3. Modo: **Produção**
4. Localização: **southamerica-east1** (Brasil)

Copie as regras de segurança:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### 5️⃣ Rodar! (30 seg)

```bash
npm run dev
```

Acesse: **http://localhost:3000** 🎉

---

## Primeiro Uso

### 1. Gerar Cartelas
- Aba "Gerar Cartelas"
- Digite: `10` cartelas
- Clique: **Gerar**
- Clique: **Imprimir** (opcional)

### 2. Registrar Jogadores
- Aba "Registrar"
- Selecione uma cartela
- Digite o nome
- Clique: **Registrar**

### 3. Jogar!
- Aba "Jogar"
- Digite um número (1-75)
- Pressione **Enter**
- Veja as cartelas marcarem automaticamente
- Acompanhe o ranking

### 4. Vitória
- Quando uma linha completar
- Modal **BINGOOO!** aparece
- Confirme o vencedor

---

## Troubleshooting Rápido

### ❌ "Firebase não configurado"
**Solução**: Verifique se o `.env` existe e está preenchido

### ❌ "Erro ao salvar cartelas"
**Solução**: Verifique as regras do Firestore

### ❌ Números não marcam
**Solução**: Use números entre 1-75

---

## Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Build produção
npm run build

# Preview produção
npm run preview

# Lint
npm run lint
```

---

## Próximos Passos

1. ✅ Gere suas primeiras cartelas
2. ✅ Teste a impressão em PDF
3. ✅ Registre alguns jogadores
4. ✅ Faça um jogo de teste
5. ✅ Exporte os dados em CSV
6. 📖 Leia o [README.md](README.md) completo

---

**Pronto! Você está pronto para usar o Bingo Web App! 🎱**
