import { fetchAllData } from "./api.ts";
import {
  calculateTop3Customers,
  calculateTop3Products,
  calculateLastMonthPeriod,
  filterLastMonthCarts,
  findLatestOrderDate
} from "./analytics.ts";
import type { CustomerReport, ProductReport } from "./types.ts";

export async function main(): Promise<void> {
  const { products, carts, users } = await fetchAllData();
  const generatedAt = new Date().toISOString();
  const lastOrderDate = findLatestOrderDate(carts);
  const period = calculateLastMonthPeriod(lastOrderDate);
  const lastMonthCarts = filterLastMonthCarts(carts, period);

  const baseMetadata = {
  generatedAt,
  lastOrderDate,
  periodStart: period.start,
  periodEnd: period.end
};

const productReport: ProductReport = {
  metadata: {
    label: "Report Top 3 Prodotti più venduti",
    ...baseMetadata
  },
  allTimeRanking: calculateTop3Products(carts, products),
  lastMonthRanking: calculateTop3Products(lastMonthCarts, products)
};

const customerReport: CustomerReport = {
  metadata: {
    label: "Report Top 3 Clienti per volume di acquisto",
    ...baseMetadata
  },
  allTimeRanking: calculateTop3Customers(carts, products, users),
  lastMonthRanking: calculateTop3Customers(lastMonthCarts, products, users)
};

  console.log("Report prodotti:");
  console.log(JSON.stringify(productReport, null, 2));
  console.log("Report clienti:");
  console.log(JSON.stringify(customerReport, null, 2));
}

main().catch(error => {
  console.error("Impossibile generare i report:", error);
  process.exitCode = 1;
});