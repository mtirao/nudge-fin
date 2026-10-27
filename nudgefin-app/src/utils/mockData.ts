export const mockTransactions = [
  { amount: 12.50, category: 'Coffee Shops', transaction_timestamp: '2026-10-20T08:30:00Z' },
  { amount: 45.00, category: 'Utilities', transaction_timestamp: '2026-10-21T10:15:00Z' }, // Esencial (Ignorado)
  { amount: 55.00, category: 'Restaurants', transaction_timestamp: '2026-10-23T20:45:00Z' }, // Viernes Noche 🚨
  { amount: 30.00, category: 'Bars', transaction_timestamp: '2026-10-23T22:15:00Z' },        // Viernes Noche 🚨
  { amount: 15.00, category: 'Shopping', transaction_timestamp: '2026-10-24T15:00:00Z' },
  { amount: 62.00, category: 'Restaurants', transaction_timestamp: '2026-10-16T19:30:00Z' }, // Viernes Noche anterior 🚨
  { amount: 25.00, category: 'Bars', transaction_timestamp: '2026-10-16T21:00:00Z' },        // Viernes Noche anterior 🚨
];
