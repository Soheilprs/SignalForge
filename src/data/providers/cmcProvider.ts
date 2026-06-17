import { MarketData } from "../../types";
import { MarketDataProvider } from "./marketDataProvider";

export const cmcMarketDataProvider: MarketDataProvider = {
  id: "live-cmc",
  label: "Live CMC latest quotes",
  async getMarketData(selectedSymbols) {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 2500);

    try {
      const health = await fetch("/api/health", { signal: controller.signal });

      if (!health.ok) {
        throw new Error("SignalForge API server is not healthy.");
      }
    } catch {
      throw new Error("SignalForge API server is not running. Start it with `npm run server` or use Demo Data.");
    } finally {
      window.clearTimeout(timeoutId);
    }

    const response = await fetch(`/api/cmc/quotes?symbols=${encodeURIComponent(selectedSymbols.join(","))}`);

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      throw new Error(payload?.error ?? `Live CMC quote request failed with ${response.status}`);
    }

    const payload = (await response.json()) as { data?: MarketData[] };

    return payload.data ?? [];
  }
};
