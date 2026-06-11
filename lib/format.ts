export function formatEUR(value: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XOF",
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatKm(value: number): string {
  return new Intl.NumberFormat("fr-FR").format(value) + " km"
}
