/** Precio en pesos ARS sin decimales, estilo local (ej. `$ 27.000`). */
export function formatPriceAr(amountPesos: number): string {
  const n = Math.round(amountPesos);
  const formatted = n.toLocaleString("es-AR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return `$ ${formatted}`;
}
