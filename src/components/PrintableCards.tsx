// src/components/PrintableCards.tsx
import { forwardRef } from 'react';
import { BingoCard as BingoCardType, PrintLayout } from '../types';
import { BingoCard } from './BingoCard';

interface PrintableCardsProps {
  cards: BingoCardType[];
  layout: PrintLayout;
}

export const PrintableCards = forwardRef<HTMLDivElement, PrintableCardsProps>(
  ({ cards, layout }, ref) => {
    const cardsPerPage = layout;
    const pages: BingoCardType[][] = [];
    
    // Divide as cartelas em páginas
    for (let i = 0; i < cards.length; i += cardsPerPage) {
      pages.push(cards.slice(i, i + cardsPerPage));
    }
    
    const getGridClass = () => {
      switch (layout) {
        case 1:
          return 'grid-cols-1 gap-8';
        case 2:
          return 'grid-cols-2 gap-8';
        case 4:
          return 'grid-cols-2 grid-rows-2 gap-4';
        default:
          return 'grid-cols-1 gap-8';
      }
    };
    
    const getPageClass = () => {
      switch (layout) {
        case 4:
          return 'p-4';
        default:
          return 'p-8';
      }
    };
    
    return (
      <div ref={ref} className="print-container">
        <style>
          {`
            @media print {
              @page {
                size: A4;
                margin: 0.5cm;
              }
              
              .print-page {
                page-break-after: always;
                height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
              }
              
              .print-page:last-child {
                page-break-after: auto;
              }
              
              body {
                print-color-adjust: exact;
                -webkit-print-color-adjust: exact;
              }
            }
          `}
        </style>
        
        {pages.map((pageCards, pageIndex) => (
          <div key={pageIndex} className="print-page">
            <div className={`grid ${getGridClass()} ${getPageClass()} w-full h-full`}>
              {pageCards.map((card) => (
                <div key={card.id} className="flex items-center justify-center w-full h-full">
                  <BingoCard 
                    card={card} 
                    showId={true} 
                    fluid={layout === 4} 
                    compact={layout !== 4 && layout !== 1} 
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }
);

PrintableCards.displayName = 'PrintableCards';
