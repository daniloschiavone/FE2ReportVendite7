// TODO 1: Crea una funzione che riceve l'array dei carrelli e trova la data dell'ordine più recente (data di ancoraggio).

import type {
  Cart,
  CustomerRanking,
  Product,
  ProductRanking,
  User
} from "./types.ts";


// INDIZIO: Converti la proprietà "date" di ogni carrello in un oggetto Date (o in millisecondi con getTime()), trova il valore massimo e restituiscilo. Gestisci anche il caso limite di un array di carrelli vuoto.
export function findLatestOrderDate(carts: Cart[]): string {
  if (carts.length === 0) {
    throw new Error("No carts available");
  }
  const latestDate = carts.reduce((latest, cart) => {
    const cartDate = new Date(cart.date);
    return cartDate > latest ? cartDate : latest;
  }, new Date(0));
  return latestDate.toISOString();
}


// TODO 2: Crea una funzione che, data la data di ancoraggio, calcola la data di inizio dell'«ultimo mese».
// INDIZIO: Clona la data di ancoraggio per non mutarla e sottrai 30 giorni (oppure 1 mese). Restituisci un oggetto contenente la data di inizio e la data di fine (che coincide con l'ancoraggio) formattate in ISO string.
export function calculateLastMonthPeriod(anchorDate: string): { start: string; end: string } {
  const date = new Date(anchorDate);
  const start = new Date(date);
  start.setDate(start.getDate() - 30);
  return {
    start: start.toISOString(),
    end: date.toISOString()
  };
}

// TODO 3: Crea una funzione che filtra i carrelli appartenenti all'intervallo dell'ultimo mese.
// INDIZIO: Usa il metodo .filter() sull'array dei carrelli verificando che la data del carrello sia maggiore o uguale alla data di inizio e minore o uguale alla data di ancoraggio.
export function filterLastMonthCarts(carts: Cart[], period: { start: string; end: string }): Cart[] {
  const { start, end } = period;
  return carts.filter(cart => {
    const cartDate = new Date(cart.date);
    const startDate = new Date(start);
    const endDate = new Date(end);
    return cartDate >= startDate && cartDate <= endDate;
  });
}

export function calculateTop3Products(
  carts: Cart[],
  products: Product[]
): ProductRanking[] {
  const productMap = new Map(products.map(product => [product.id, product]));
  const totalsByProduct = new Map<number, { unitsSold: number; revenue: number }>();

  for (const cart of carts) {
    for (const item of cart.products) {
      const product = productMap.get(item.productId);
      if (!product) {
        continue;
      }

      const totals = totalsByProduct.get(product.id) ?? { unitsSold: 0, revenue: 0 };
      totals.unitsSold += item.quantity;
      totals.revenue += item.quantity * product.price;
      totalsByProduct.set(product.id, totals);
    }
  }

  return Array.from(totalsByProduct, ([productId, totals]) => {
    const product = productMap.get(productId);
    if (!product) {
      throw new Error(`Product ${productId} was not found`);
    }

    return {
      position: 0,
      productId,
      title: product.title,
      category: product.category,
      price: product.price,
      unitsSold: totals.unitsSold,
      revenue: Math.round(totals.revenue * 100) / 100
    };
  })
    .sort((a, b) => b.revenue - a.revenue || a.productId - b.productId)
    .slice(0, 3)
    .map((product, index) => ({ ...product, position: index + 1 }));
}

// TODO 5: Crea una funzione che calcola la Top 3 clienti per una data lista di carrelli, il catalogo prodotti e l'anagrafica utenti.
// INDIZIO 5.1: Crea una Map per i prodotti e una Map per gli utenti usando i rispettivi id come chiave.
// INDIZIO 5.2: Crea una Map di accumulo per gli utenti che hanno acquistato nel periodo (chiave: userId, valore: { numeroOrdini, totalePezzi, spesaTotale }).
// INDIZIO 5.3: Cicla sui carrelli. Se lo userId non esiste nella Map utenti, ignora il carrello e passa al successivo (gestione utente assente dall'anagrafica).
// INDIZIO 5.4: Se l'utente esiste, incrementa di 1 il suo numeroOrdini. Poi cicla sui prodotti del carrello: se il prodotto esiste nella Map prodotti, somma la quantity a totalePezzi e somma (quantity * prezzo) a spesaTotale.
// INDIZIO 5.5: Combina i dati accumulati con i dati anagrafici dell'utente. Costruisci il nome completo concatenando "firstname", uno spazio " " e "lastname" esattamente come sono, senza modificare maiuscole/minuscole.
// INDIZIO 5.6: Ordina l'array per spesaTotale decrescente (con tie-break coerente), estrai i primi 3 con .slice(0, 3) e aggiungi l'attributo della posizione in classifica (1, 2, 3).

export function calculateTop3Customers(
  carts: Cart[],
  products: Product[],
  users: User[]
): CustomerRanking[] {
  const productMap = new Map(products.map(product => [product.id, product]));
  const userMap = new Map(users.map(user => [user.id, user]));
  const totalsByUser = new Map<number, {
    orders: number;
    totalItemsPurchased: number;
    totalSpent: number;
  }>();

  for (const cart of carts) {
    if (!userMap.has(cart.userId)) {
      continue;
    }

    const totals = totalsByUser.get(cart.userId) ?? {
      orders: 0,
      totalItemsPurchased: 0,
      totalSpent: 0
    };
    totals.orders += 1;

    for (const item of cart.products) {
      const product = productMap.get(item.productId);
      if (product) {
        totals.totalItemsPurchased += item.quantity;
        totals.totalSpent += item.quantity * product.price;
      }
    }

    totalsByUser.set(cart.userId, totals);
  }

  return Array.from(totalsByUser, ([userId, totals]) => {
    const user = userMap.get(userId);
    if (!user) {
      throw new Error(`User ${userId} was not found`);
    }

    return {
      userId,
      username: user.username,
      fullName: `${user.name.firstname} ${user.name.lastname}`,
      email: user.email,
      orders: totals.orders,
      totalItemsPurchased: totals.totalItemsPurchased,
      totalSpent: Math.round(totals.totalSpent * 100) / 100
    };
  })
    .sort((a, b) => b.totalSpent - a.totalSpent || a.userId - b.userId)
    .slice(0, 3)
    .map((customer, index) => ({
      position: index + 1,
      ...customer
    }));
}