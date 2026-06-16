export function formatCurrency(value: number, compact = true): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: compact && Math.abs(value) >= 100000 ? "compact" : "standard",
    maximumFractionDigits: value < 10 ? 3 : 2
  }).format(value);
}

export function formatPercent(value: number, digits = 2): string {
  return `${value >= 0 ? "+" : ""}${value.toFixed(digits)}%`;
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US", {
    notation: Math.abs(value) >= 100000 ? "compact" : "standard",
    maximumFractionDigits: 2
  }).format(value);
}

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
