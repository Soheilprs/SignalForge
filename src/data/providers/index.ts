import { cmcMarketDataProvider } from "./cmcProvider";
import { mockMarketDataProvider } from "./mockProvider";

export { DATA_MODE_LABELS } from "./marketDataProvider";
export type { MarketDataProvider } from "./marketDataProvider";

export const marketDataProviders = {
  mock: mockMarketDataProvider,
  "live-cmc": cmcMarketDataProvider
};
