import { DataMode, MarketData, TokenSymbol } from "../../types";

export interface MarketDataProvider {
  id: DataMode;
  label: string;
  getMarketData: (selectedSymbols: TokenSymbol[]) => Promise<MarketData[]>;
}

export const DATA_MODE_LABELS: Record<DataMode, string> = {
  mock: "Data mode: Deterministic CMC-compatible demo data",
  "live-cmc": "Data mode: Live CMC latest quotes"
};
