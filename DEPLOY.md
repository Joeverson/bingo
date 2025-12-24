# 🚀 Guia de Deploy

## Opções de Deploy

### 1. Firebase Hosting (Recomendado) ⭐

**Vantagens:**
- Integração nativa com Firebase
- CDN global
- HTTPS automático
- Domínio gratuito (.web.app)
- Deploy com um comando

**Passos:**

```bash
# 1. Instalar Firebase CLI
npm install -g firebase-tools

# 2. Login no Firebase
firebase login

# 3. Inicializar Firebase Hosting
firebase init hosting

# Selecione:
# - Use existing project (seu projeto)
# - Public directory: dist
# - Single-page app: Yes
# - Automatic builds: No

# 4. Build do projeto
npm run build

# 5. Deploy!
firebase deploy --only hosting
```

Seu app estará em: `https://seu-projeto.web.app`

---

### 2. Vercel

**Vantagens:**
- Deploy automático do GitHub
- Preview de pull requests
- Domínio gratuito (.vercel.app)
- Zero configuração

**Passos:**

1. Crie conta em [vercel.com](https://vercel.com)
2. Conecte seu repositório GitHub
3. Configure:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Adicione variáveis de ambiente (VITE_FIREBASE_*)
5. Deploy automático!

---

### 3. Netlify

**Vantagens:**
- Interface amigável
- Preview de branches
- Formulários e functions gratuitos
- Domínio gratuito (.netlify.app)

**Passos:**

1. Crie conta em [netlify.com](https://netlify.com)
2. New site from Git
3. Conecte GitHub
4. Configure:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Adicione Environment Variables
6. Deploy!

---

### 4. GitHub Pages

**Vantagens:**
- Grátis para repos públicos
- Integração com GitHub Actions
- Simples para projetos pessoais

**Limitações:**
- Requer configuração de base path
- Sem variáveis de ambiente secretas (use Firebase public config)

**Passos:**

1. Instale gh-pages:
```bash
npm install --save-dev gh-pages
```

2. Adicione ao package.json:
```json
{
  "homepage": "https://seuusuario.github.io/bingo",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

3. Deploy:
```bash
npm run deploy
```

---

## ⚙️ Configurações Importantes

### Variáveis de Ambiente

**Nunca commite o arquivo `.env` com credenciais reais!**

Para cada plataforma, adicione as variáveis:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

### Domínio Customizado

#### Firebase Hosting:
```bash
firebase hosting:channel:deploy production --only hosting
```

Adicione domínio em: Console Firebase > Hosting > Adicionar domínio customizado

#### Vercel/Netlify:
- Vá em Settings > Domains
- Adicione seu domínio
- Configure DNS (A record ou CNAME)

---

## 🔒 Segurança em Produção

### 1. Atualizar Regras do Firestore

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Apenas leitura pública, escrita requer autenticação
    match /cards/{cardId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /gameState/{gameId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### 2. Adicionar Autenticação (Opcional)

```typescript
// src/config/firebase.ts
import { signInAnonymously } from 'firebase/auth';

// No componente App
useEffect(() => {
  signInAnonymously(auth).catch(console.error);
}, []);
```

### 3. Rate Limiting

Configure em Firebase Console:
- Cloud Firestore > Usage
- Configure quotas e alertas

### 4. Backup Automático

Configure backups diários no Firebase:
- Firestore > Backups
- Habilite backup automático

---

## 📊 Monitoramento

### Firebase Analytics

```bash
# Adicione ao projeto
npm install firebase/analytics

# Em firebase.ts
import { getAnalytics } from "firebase/analytics";
export const analytics = getAnalytics(app);
```

### Sentry (Erros)

```bash
npm install @sentry/react

# Adicione em main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: "production",
});
```

---

## 🧪 Checklist Pré-Deploy

- [ ] Testar build local: `npm run build && npm run preview`
- [ ] Verificar todas as funcionalidades funcionam
- [ ] Testar em mobile/tablet
- [ ] Verificar console sem erros
- [ ] Firebase configurado corretamente
- [ ] Variáveis de ambiente definidas
- [ ] Regras de segurança atualizadas
- [ ] README atualizado com URL de produção
- [ ] Backup dos dados importantes

---

## 🔄 Deploy Contínuo (CI/CD)

### GitHub Actions + Firebase

Crie `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Firebase

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
        env:
          VITE_FIREBASE_API_KEY: ${{ secrets.VITE_FIREBASE_API_KEY }}
          VITE_FIREBASE_AUTH_DOMAIN: ${{ secrets.VITE_FIREBASE_AUTH_DOMAIN }}
          # ... outras variáveis
      
      - name: Deploy to Firebase
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          channelId: live
          projectId: seu-projeto-id
```

---

## 📱 PWA (Progressive Web App) - Opcional

Para transformar em app instalável:

```bash
npm install vite-plugin-pwa -D
```

```typescript
// vite.config.ts
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Bingo Web App',
        short_name: 'Bingo',
        description: 'Sistema completo de Bingo online',
        theme_color: '#2563eb',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})
```

---

## 🆘 Troubleshooting Deploy

### Erro: "Build failed"
- Verifique versão do Node (use 18+)
- Delete `node_modules` e `package-lock.json`
- Rode `npm install` novamente

### Erro: "Firebase not found"
- Verifique se variáveis de ambiente estão definidas
- Verifique se começa com `VITE_`

### Página em branco
- Abra DevTools > Console
- Verifique erros de carregamento
- Teste build local primeiro

---

**Boa sorte com o deploy! 🚀**
