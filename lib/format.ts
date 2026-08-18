export function formatEUR(value: number): string {
  const formatted = new Intl.NumberFormat("fr-FR", {
    maximumFractionDigits: 0,
  }).format(value)
  return `${formatted} F CFA`
}

export function formatKm(value: number): string {
  return new Intl.NumberFormat("fr-FR").format(value) + " km"
}
