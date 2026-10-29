// TODO 1: Definisci l'interfaccia per il Prodotto restituito da GET /products.
// INDIZIO: Ti servono almeno l'identificativo numerico, il titolo, il prezzo unitario e la categoria.
export type Product = {
  id: number;
  title: string;
  price: number;
  category: string;
} 


// TODO 2: Definisci l'interfaccia per il singolo elemento dentro un carrello e l'interfaccia per il Carrello restituito da GET /carts.
// INDIZIO: Ogni carrello ha un id, un userId, una data (stringa) e un array di prodotti in cui ciascun elemento ha solo productId e quantity.
export type CartItem = {
  productId: number;
  quantity: number;
};

export type Cart = {
  id: number;
  userId: number;
  date: string;
  products: CartItem[];
};


// TODO 3: Definisci l'interfaccia per l'Utente restituito da GET /users.
// INDIZIO: Controlla la documentazione di Fake Store API o fai una chiamata di prova nel browser: oltre a id, username ed email, l'attributo "name" è un oggetto che contiene "firstname" e "lastname".

export type UserName = {
  firstname: string;
  lastname: string;
};

export type User = {
  id: number;
  username: string;
  email: string;
  name: UserName;
};

// TODO 4: Definisci l'interfaccia per la singola riga in classifica del Report 1 (Prodotti).
// INDIZIO: Assicurati che contenga tutti i 7 attributi richiesti: posizione in classifica, id prodotto, titolo, categoria, prezzo unitario, unità vendute nel periodo e fatturato del periodo.
export type ProductRanking = {
  position: number;
  productId: number;
  title: string;
  category: string;
  price: number;
  unitsSold: number;
  revenue: number;
};

// TODO 5: Definisci l'interfaccia per la singola riga in classifica del Report 2 (Clienti).
// INDIZIO: Assicurati che contenga tutti gli 8 attributi richiesti: posizione in classifica, id utente, username, nome completo, email, numero di ordini nel periodo, totale pezzi acquistati e spesa totale.
export type CustomerRanking = {
  position: number;
  userId: number;
  username: string;
  fullName: string;
  email: string;
  orders: number;
  totalItemsPurchased: number;
  totalSpent: number;
};

// TODO 6: Definisci l'interfaccia (o le interfacce) per l'involucro completo dei due Report JSON.
// INDIZIO: Ogni report deve avere: un'etichetta identificativa, il timestamp di generazione, la data dell'ordine più recente usata come ancoraggio, l'intervallo temporale (inizio e fine) per l'ultimo mese e le due classifiche (all time e ultimo mese).
export type ReportMetadata = {
  label: string;
  generatedAt: string;
  lastOrderDate: string;
  periodStart: string;
  periodEnd: string;
};

export type ProductReport = {
  metadata: ReportMetadata;
  allTimeRanking: ProductRanking[];
  lastMonthRanking: ProductRanking[];
};

export type CustomerReport = {
  metadata: ReportMetadata;
  allTimeRanking: CustomerRanking[];
  lastMonthRanking: CustomerRanking[];
}   