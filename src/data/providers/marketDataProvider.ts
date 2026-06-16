import { MarketData, TokenSymbol } from "../../types";

export interface MarketDataProvider {
  id: "mock" | "cmc";
  label: string;
  getMarketData: (selectedSymbols: TokenSymbol[]) => Promise<MarketData[]>;
}

export const DEFAULT_DATA_MODE_LABEL = "Data mode: Deterministic CMC-compatible demo data";
