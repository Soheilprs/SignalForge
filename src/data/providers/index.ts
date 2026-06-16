import { cmcMarketDataProvider } from "./cmcProvider";
import { mockMarketDataProvider } from "./mockProvider";

export { DEFAULT_DATA_MODE_LABEL } from "./marketDataProvider";
export type { MarketDataProvider } from "./marketDataProvider";

export const marketDataProviders = {
  mock: mockMarketDataProvider,
  cmc: cmcMarketDataProvider
};
