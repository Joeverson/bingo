# Exemplos de Interações e Testes

## 📝 Cenários de Teste

### Cenário 1: Geração Básica de Cartelas

**Entrada:**
- Número de cartelas: 10
- Configuração: Centro livre habilitado

**Resultado Esperado:**
- 10 cartelas geradas com IDs únicos
- Cada cartela possui uma grade 5x5
- Centro da cartela = 0 (FREE)
- Números respeitam intervalos:
  - Coluna B: 1-15
  - Coluna I: 16-30
  - Coluna N: 31-45
  - Coluna G: 46-60
  - Coluna O: 61-75
- Nenhum número repetido dentro da mesma cartela

**Como Testar:**
1. Abra a aba "Gerar Cartelas"
2. Digite `10` no campo
3. Clique em "Gerar"
4. Verifique os IDs únicos
5. Clique em uma cartela para inspecionar os números

---

### Cenário 2: Marcação Automática

**Entrada:**
- Cartela gerada com números: [12, 18, 34, 47, 63, ...]
- Número sorteado: 12

**Resultado Esperado:**
- O número 12 aparece marcado em verde na cartela
- O número 12 aparece na lista "Números Sorteados" sob "B"
- Todas as outras cartelas contendo 12 também são marcadas
- Tempo de marcação < 100ms

**Como Testar:**
1. Gere pelo menos 10 cartelas
2. Vá para a aba "Jogar"
3. Digite `12` e pressione Enter
4. Observe a marcação instantânea
5. Verifique o número na lista "B"

---

### Cenário 3: Detecção de Vitória (Linha Horizontal)

**Setup:**
- Cartela com primeira linha: [3, 18, 34, 52, 70]
- Números sorteados: [3, 18, 34, 52]

**Entrada:**
- Sortear número: 70

**Resultado Esperado:**
- Modal "BINGOOO!" aparece imediatamente
- Nome do jogador (se registrado) ou ID da cartela é exibido grande
- Jogo para de aceitar novos números
- Botão "Confirmar Vitória" está visível

**Como Testar (Manual):**
1. Gere uma cartela e anote a primeira linha
2. Sorteie os primeiros 4 números dessa linha
3. Sorteie o 5º número
4. Verifique se o modal aparece

---

### Cenário 4: Detecção de Vitória (Coluna Vertical)

**Setup:**
- Cartela com primeira coluna (B): [3, 8, 12, 14, 15]
- Números sorteados: [3, 8, 12, 14]

**Entrada:**
- Sortear número: 15

**Resultado Esperado:**
- Modal "BINGOOO!" aparece
- Detecção funciona igualmente para colunas

---

### Cenário 5: Ranking de Proximidade

**Setup:**
- 3 cartelas:
  - Cartela A: 10 números marcados, 1 linha completa
  - Cartela B: 15 números marcados, 0 linhas completas
  - Cartela C: 8 números marcados, 0 linhas completas

**Resultado Esperado:**
- Ranking exibe:
  1. Cartela A (score: 1010)
  2. Cartela B (score: 15)
  3. Cartela C (score: 8)

**Fórmula do Score:**
```
score = (linhas_completas × 1000) + (diagonais_completas × 500) + números_marcados
```

**Como Testar:**
1. Gere 3+ cartelas
2. Sorteie alguns números estratégicos
3. Observe o ranking atualizar
4. Cartelas com linhas quase completas devem aparecer no topo

---

### Cenário 6: Registro de Cartela

**Entrada:**
- ID da cartela: "CARD-1234567890-abc123"
- Nome do jogador: "Maria Silva"

**Resultado Esperado:**
- Cartela aparece na lista de "Cartelas Registradas"
- Nome "Maria Silva" associado ao ID
- Data/hora de registro é registrada
- Cartela some da lista de "disponíveis"

**Como Testar:**
1. Gere cartelas
2. Vá para "Registrar"
3. Selecione uma cartela
4. Digite um nome
5. Clique em "Registrar"
6. Verifique a lista

---

### Cenário 7: Busca no Registro

**Setup:**
- 5 cartelas registradas para: João, Maria, José, Ana, Carlos

**Entrada:**
- Buscar por: "Maria"

**Resultado Esperado:**
- Lista filtra e mostra apenas a cartela de Maria
- Busca é case-insensitive

---

### Cenário 8: Desfazer Número

**Setup:**
- Números sorteados: [5, 12, 23, 45, 67]

**Entrada:**
- Clicar em "Desfazer Último"

**Resultado Esperado:**
- Número 67 é removido da lista
- Marcações do 67 são desfeitas
- Ranking é recalculado
- É possível desfazer múltiplas vezes

---

### Cenário 9: Reset Completo

**Setup:**
- Jogo em andamento com 20 números sorteados

**Entrada:**
- Clicar em "Resetar" e confirmar

**Resultado Esperado:**
- Todos os números sorteados são limpos
- Todas as marcações são desfeitas
- Ranking volta ao estado inicial
- Cartelas permanecem salvas

---

### Cenário 10: Exportação CSV

**Setup:**
- 10 cartelas geradas, 5 registradas

**Entrada:**
- Clicar em "Exportar CSV"

**Resultado Esperado:**
- Arquivo CSV baixado com nome: `bingo-cards-YYYY-MM-DD.csv`
- Contém colunas: ID, Registrado Para, Datas, Números (5 linhas)
- Formato correto para Excel/Google Sheets

**Estrutura CSV:**
```csv
"ID da Cartela","Registrada Para","Data de Criação","Data de Registro","Números (Linha 1)","Números (Linha 2)","Números (Linha 3)","Números (Linha 4)","Números (Linha 5)"
"CARD-123","-","24/12/2025 10:30","24/12/2025 11:00","3 18 34 52 70","2 17 FREE 48 63","..."
```

---

## 🔍 Casos de Borda

### Número Inválido

**Entrada:** 0, -5, 76, 100, "abc"

**Resultado Esperado:**
- Alert: "Por favor, insira um número válido entre 1 e 75"
- Número não é adicionado

---

### Número Duplicado

**Entrada:** Sortear "12" duas vezes

**Resultado Esperado:**
- Alert: "Este número já foi sorteado!"
- Número não é adicionado novamente

---

### Imprimir sem Cartelas

**Entrada:** Clicar em "Imprimir" sem cartelas geradas

**Resultado Esperado:**
- Botão desabilitado (cinza)
- Não é possível clicar

---

### Registrar Cartela Já Registrada

**Entrada:** Tentar registrar a mesma cartela duas vezes

**Resultado Esperado:**
- Cartela não aparece na lista de disponíveis
- Só é possível "Remover" o registro atual

---

### Vitória com Centro Livre

**Setup:**
- Centro livre habilitado
- Linha do meio: [31, 42, FREE, 58, 64]
- Sorteados: [31, 42, 58, 64]

**Resultado Esperado:**
- Vitória detectada (FREE conta como marcado)
- Modal "BINGOOO!" aparece

---

### Múltiplas Vitórias Simultâneas

**Setup:**
- 2 cartelas completam linha no mesmo número sorteado

**Resultado Esperado:**
- Modal mostra o primeiro vencedor detectado
- Sistema pode ser melhorado para mostrar múltiplos vencedores

---

## ✅ Checklist de Validação Final

- [ ] Gerar 10 cartelas funciona
- [ ] Imprimir PDF funciona
- [ ] Registrar cartela funciona
- [ ] Busca por nome funciona
- [ ] Sortear número marca automaticamente
- [ ] Números aparecem agrupados por letra (B-I-N-G-O)
- [ ] Ranking atualiza em tempo real
- [ ] Clicar no ranking mostra preview da cartela
- [ ] Vitória é detectada (linha horizontal)
- [ ] Vitória é detectada (coluna vertical)
- [ ] Modal "BINGOOO!" aparece corretamente
- [ ] Desfazer último número funciona
- [ ] Reset limpa tudo
- [ ] Exportar CSV baixa arquivo correto
- [ ] Configurações (diagonais, centro livre) funcionam
- [ ] Firebase salva e carrega cartelas
- [ ] Números duplicados são bloqueados
- [ ] Números inválidos são bloqueados
- [ ] Interface é responsiva em mobile

---

## 🎯 Critérios de Aceite Resumidos

### ✅ PASS: Sistema está funcionando corretamente
- Todos os cenários de teste passam
- Sem erros no console do navegador
- Firebase conectado e salvando dados
- Impressão gera PDF legível
- Vitória é detectada instantaneamente

### ❌ FAIL: Sistema precisa de ajustes
- Números não marcam automaticamente
- Modal de vitória não aparece
- Erros no console
- Firebase não salva dados
- Impressão quebrada

---

**Use este guia para validar o sistema antes de usar em produção!**
