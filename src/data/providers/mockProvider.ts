import { getMockMarketData } from "../mockMarketData";
import { MarketDataProvider } from "./marketDataProvider";

export const mockMarketDataProvider: MarketDataProvider = {
  id: "mock",
  label: "Deterministic CMC-compatible demo data",
  async getMarketData(selectedSymbols) {
    return getMockMarketData(selectedSymbols);
  }
};
