# 🛠️ Comandos Úteis e Troubleshooting

## 📋 Comandos NPM

### Desenvolvimento
```bash
# Instalar dependências
npm install

# Rodar servidor de desenvolvimento
npm run dev
# Acessível em: http://localhost:3000

# Rodar com porta específica
npm run dev -- --port 3001
```

### Build
```bash
# Build para produção
npm run build
# Gera arquivos em: dist/

# Preview do build
npm run preview
# Acessível em: http://localhost:4173

# Build + Preview
npm run build && npm run preview
```

### Qualidade de Código
```bash
# Lint (verificar erros)
npm run lint

# Lint + Fix automático
npm run lint -- --fix

# Type checking
npx tsc --noEmit
```

### Limpeza
```bash
# Limpar node_modules e reinstalar
rmdir /s /q node_modules
del package-lock.json
npm install

# Limpar cache do npm
npm cache clean --force

# Limpar build
rmdir /s /q dist
```

---

## 🔥 Firebase

### Comandos Firebase CLI
```bash
# Instalar Firebase CLI globalmente
npm install -g firebase-tools

# Login
firebase login

# Logout
firebase logout

# Ver projetos
firebase projects:list

# Selecionar projeto
firebase use nome-do-projeto

# Deploy
firebase deploy
```

### Emulators (Desenvolvimento Local)
```bash
# Inicializar emulators
firebase init emulators

# Rodar emulators
firebase emulators:start

# Rodar apenas Firestore
firebase emulators:start --only firestore
```

### Backup/Restore
```bash
# Export Firestore
firebase firestore:export gs://seu-bucket/backup

# Import Firestore
firebase firestore:import gs://seu-bucket/backup
```

---

## 🐛 Troubleshooting

### ❌ Problema: "npm install" falha

**Sintomas:**
```
npm ERR! code ENOENT
npm ERR! syscall open
```

**Soluções:**
```bash
# 1. Verificar versão do Node
node --version  # Deve ser 18+

# 2. Limpar cache
npm cache clean --force

# 3. Deletar e reinstalar
rmdir /s /q node_modules
del package-lock.json
npm install

# 4. Se persistir, usar yarn
npm install -g yarn
yarn install
```

---

### ❌ Problema: "Firebase não configurado"

**Sintomas:**
- Mensagem no console: "⚠️ Firebase não configurado!"
- Erro ao salvar cartelas

**Soluções:**
```bash
# 1. Verificar se .env existe
dir .env

# 2. Se não existir, copiar exemplo
copy .env.example .env

# 3. Editar .env com credenciais corretas
notepad .env

# 4. Verificar se variáveis começam com VITE_
# Correto: VITE_FIREBASE_API_KEY=abc123
# Errado: FIREBASE_API_KEY=abc123

# 5. Reiniciar servidor
# Ctrl+C para parar
npm run dev
```

**Checklist de Verificação:**
- [ ] Arquivo `.env` existe
- [ ] Todas as 6 variáveis estão preenchidas
- [ ] Variáveis começam com `VITE_`
- [ ] Não há espaços antes/depois do `=`
- [ ] Servidor foi reiniciado após editar `.env`

---

### ❌ Problema: Erro ao salvar cartelas no Firebase

**Sintomas:**
```
Error: Missing or insufficient permissions
```

**Soluções:**

1. **Verificar Regras do Firestore:**
   - Acesse: Firebase Console > Firestore > Regras
   - Use regras permissivas para desenvolvimento:
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

2. **Verificar se Firestore está habilitado:**
   - Firebase Console > Build > Firestore Database
   - Se não estiver, clique em "Criar banco de dados"

3. **Verificar credenciais:**
   - Confirme que as variáveis no `.env` estão corretas
   - Teste com outro projeto Firebase

---

### ❌ Problema: Impressão não funciona

**Sintomas:**
- Botão "Imprimir" não faz nada
- Preview de impressão vazio
- Cores não aparecem

**Soluções:**

1. **Navegador bloqueando popups:**
   - Permita popups para localhost
   - Chrome: Ícone de cadeado > Configurações do site > Popups

2. **Cores não aparecem:**
   - Na janela de impressão, marque "Gráficos de fundo"
   - Chrome: Mais configurações > Opções > Gráficos de fundo

3. **Layout quebrado:**
   - Certifique-se de usar papel A4
   - Zoom deve estar em 100%
   - Prefira Chrome ou Edge

4. **Teste manual:**
   ```bash
   # Abra o DevTools (F12)
   # Console > Digite:
   window.print()
   ```

---

### ❌ Problema: Números não marcam automaticamente

**Sintomas:**
- Cartelas não ficam verdes ao sortear números
- Ranking não atualiza

**Soluções:**

1. **Verificar se há cartelas:**
   - Vá na aba "Gerar Cartelas"
   - Gere pelo menos 1 cartela

2. **Verificar número válido:**
   - Use números entre 1 e 75
   - Não use números já sorteados

3. **Verificar console:**
   - Abra DevTools (F12)
   - Veja se há erros em vermelho
   - Copie e pesquise o erro

4. **Recarregar página:**
   ```
   Ctrl+Shift+R (hard reload)
   ```

---

### ❌ Problema: Modal de vitória não aparece

**Sintomas:**
- Linha completa mas nenhum modal
- Console mostra erro

**Soluções:**

1. **Verificar configuração:**
   - Aba "Configurações"
   - Se diagonais desabilitadas, apenas linhas/colunas contam

2. **Testar manualmente:**
   - Anote uma linha de uma cartela
   - Sorteie todos os 5 números dessa linha
   - Modal deve aparecer

3. **Verificar se jogo está ativo:**
   - Status deve mostrar "Em Jogo"
   - Se não, sorteie o primeiro número

---

### ❌ Problema: Build falha

**Sintomas:**
```
npm run build
ERROR: Build failed
```

**Soluções:**

1. **Verificar erros de TypeScript:**
   ```bash
   npx tsc --noEmit
   ```

2. **Corrigir imports:**
   - Certifique-se de que todos os imports estão corretos
   - Use caminhos relativos corretos

3. **Limpar e rebuildar:**
   ```bash
   rmdir /s /q dist
   rmdir /s /q node_modules
   npm install
   npm run build
   ```

4. **Verificar variáveis de ambiente:**
   - Build usa as variáveis do `.env`
   - Certifique-se de que estão corretas

---

### ❌ Problema: Página em branco após deploy

**Sintomas:**
- Build funciona localmente
- Após deploy, página em branco
- Console mostra: "Failed to load module"

**Soluções:**

1. **Verificar base path (GitHub Pages):**
   ```typescript
   // vite.config.ts
   export default defineConfig({
     base: '/nome-do-repo/',
     // ...
   })
   ```

2. **Verificar variáveis de ambiente:**
   - Adicione variáveis na plataforma de hosting
   - Vercel/Netlify: Settings > Environment Variables

3. **Verificar console de erros:**
   - F12 > Console
   - Procure por erros de CORS ou 404

4. **Testar build localmente:**
   ```bash
   npm run build
   npm run preview
   ```

---

## 🔍 Logs Úteis

### Verificar Estado do Firebase
```bash
# No console do navegador (F12)
import { db } from './src/config/firebase';
console.log(db); // Deve mostrar objeto Firestore
```

### Verificar Cartelas no Firestore
```bash
# Firebase Console
# Firestore > Data > cards
# Deve mostrar documentos
```

### Limpar Estado Local
```bash
# Console do navegador
localStorage.clear();
sessionStorage.clear();
location.reload();
```

---

## 📊 Monitoramento

### Verificar Performance
```javascript
// Console do navegador
performance.now(); // Tempo desde carregamento

// Medir tempo de marcação
console.time('marcacao');
// ... sortear número
console.timeEnd('marcacao'); // Deve ser < 100ms
```

### Verificar Uso do Firebase
- Firebase Console > Usage and Billing
- Veja reads/writes/deletes do dia
- Certifique-se de estar dentro do free tier

---

## 🆘 Ajuda Adicional

### Links Úteis
- [Vite Docs](https://vitejs.dev/)
- [React Docs](https://react.dev/)
- [Firebase Docs](https://firebase.google.com/docs)
- [Tailwind Docs](https://tailwindcss.com/docs)

### Comunidades
- [Stack Overflow](https://stackoverflow.com/questions/tagged/reactjs)
- [Reddit r/reactjs](https://reddit.com/r/reactjs)
- [Discord Reactiflux](https://discord.gg/reactiflux)

### Reportar Bug
Se encontrar um bug, anote:
1. O que você estava fazendo
2. O que esperava acontecer
3. O que realmente aconteceu
4. Mensagem de erro (se houver)
5. Console do navegador (F12)

---

## ✅ Checklist de Validação

Antes de reportar um problema, verifique:

- [ ] Node.js 18+ instalado
- [ ] `npm install` executado sem erros
- [ ] Arquivo `.env` existe e está correto
- [ ] Firebase Firestore habilitado
- [ ] Regras do Firestore configuradas
- [ ] Servidor de desenvolvimento rodando
- [ ] Navegador moderno (Chrome/Edge/Firefox)
- [ ] Console sem erros (F12)
- [ ] Tentou hard reload (Ctrl+Shift+R)
- [ ] Leu a documentação relevante

---

**Se nada funcionar, delete tudo e recomeçe:**

```bash
cd "d:\Games Development"
rmdir /s /q Bingo
# Baixe o projeto novamente
cd Bingo
npm install
copy .env.example .env
# Configure .env
npm run dev
```

**Na dúvida, consulte: [README.md](README.md) ou [QUICKSTART.md](QUICKSTART.md)**
