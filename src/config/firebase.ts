// src/config/firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

/**
 * Configuração do Firebase
 * 
 * INSTRUÇÕES PARA CONFIGURAR:
 * 1. Acesse https://console.firebase.google.com/
 * 2. Crie um novo projeto ou selecione um existente
 * 3. Vá em Project Settings > General
 * 4. Em "Your apps", adicione um Web App
 * 5. Copie as credenciais para o arquivo .env
 * 6. Habilite Firestore Database em Build > Firestore Database
 * 7. Configure as regras de segurança do Firestore (veja abaixo)
 * 
 * REGRAS DE SEGURANÇA RECOMENDADAS (Firestore Rules):
 * 
 * rules_version = '2';
 * service cloud.firestore {
 *   match /databases/{database}/documents {
 *     // Cartelas: leitura pública, escrita apenas autenticada
 *     match /cards/{cardId} {
 *       allow read: if true;
 *       allow write: if request.auth != null;
 *     }
 *     
 *     // Estado do jogo: leitura pública, escrita apenas autenticada
 *     match /gameState/{gameId} {
 *       allow read: if true;
 *       allow write: if request.auth != null;
 *     }
 *   }
 * }
 */

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Verifica se as variáveis de ambiente estão configuradas
const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
];

const missingVars = requiredEnvVars.filter(
  (varName) => !import.meta.env[varName]
);

if (missingVars.length > 0) {
  console.error(
    '⚠️ Firebase não configurado! Variáveis faltando:',
    missingVars.join(', ')
  );
  console.info(
    '📝 Copie .env.example para .env e preencha com suas credenciais do Firebase'
  );
}

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Serviços Firebase
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
