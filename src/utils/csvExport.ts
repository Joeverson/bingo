// src/utils/csvExport.ts
import { BingoCard } from '../types';

/**
 * Converte array de cartelas para CSV
 * @param cards Array de cartelas
 * @returns String CSV
 */
export function cardsToCSV(cards: BingoCard[]): string {
  const headers = [
    'ID da Cartela',
    'Registrada Para',
    'Data de Criação',
    'Data de Registro',
    'Números (Linha 1)',
    'Números (Linha 2)',
    'Números (Linha 3)',
    'Números (Linha 4)',
    'Números (Linha 5)',
  ];
  
  const rows = cards.map(card => {
    const rowStrings = card.numbers.map(row =>
      row.map(num => (num === 0 ? 'FREE' : num.toString())).join(' ')
    );
    
    return [
      card.id,
      card.registeredTo || '-',
      card.createdAt.toLocaleString('pt-BR'),
      card.registeredAt ? card.registeredAt.toLocaleString('pt-BR') : '-',
      ...rowStrings,
    ];
  });
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
  ].join('\n');
  
  return csvContent;
}

/**
 * Faz download de um CSV
 * @param content Conteúdo do CSV
 * @param filename Nome do arquivo
 */
export function downloadCSV(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

/**
 * Exporta cartelas para CSV
 * @param cards Array de cartelas
 * @param filename Nome do arquivo (opcional)
 */
export function exportCardsToCSV(
  cards: BingoCard[],
  filename: string = `bingo-cards-${new Date().toISOString()}.csv`
): void {
  const csv = cardsToCSV(cards);
  downloadCSV(csv, filename);
}
