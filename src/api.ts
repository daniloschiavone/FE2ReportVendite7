import type { Product, Cart, User } from "./types.ts";
// TODO 1: Definisci una costante con l'URL di base "https://fakestoreapi.com".
const BASE_URL = "https://fakestoreapi.com";


// TODO 2: Crea una funzione asincrona generica per effettuare il fetch di un endpoint.
// INDIZIO: Usa la funzione nativa fetch(), verifica che "response.ok" sia true (altrimenti lancia un errore esplicito) e restituisci il risultato di "response.json()" tipizzato con un Generic <T>.
async function fetchApi<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`);
  if (!response.ok) {
    throw new Error(`Error fetching ${endpoint}: ${response.status}`);
  }
  return response.json() as Promise<T>;
}


// TODO 3: Crea ed esporta una funzione asincrona che recupera contemporaneamente prodotti, carrelli e utenti.
// INDIZIO: Usa Promise.all() invocando la funzione del TODO 2 per "/products", "/carts" e "/users", restituendo un oggetto con le tre collezioni pronte all'uso.
export async function fetchAllData() {
  const [products, carts, users] = await Promise.all([
    fetchApi<Product[]>("/products"),
    fetchApi<Cart[]>("/carts"),
    fetchApi<User[]>("/users")
  ]);
  return { products, carts, users };
}


