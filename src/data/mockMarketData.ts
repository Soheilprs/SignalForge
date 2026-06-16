import { MarketData, TokenSymbol } from "../types";

export const DEFAULT_TOKEN_UNIVERSE: TokenSymbol[] = [
  "BNB",
  "CAKE",
  "TWT",
  "XVS",
  "ALPACA",
  "BAKE",
  "USDT"
];

const MOCK_MARKET_DATA: MarketData[] = [
  {
    symbol: "BNB",
    name: "BNB",
    price: 612.42,
    marketCap: 94100000000,
    volume24h: 1780000000,
    percentChange1h: 0.28,
    percentChange24h: 2.95,
    percentChange7d: 8.2,
    volatility: 0.32,
    liquidityScore: 94
  },
  {
    symbol: "CAKE",
    name: "PancakeSwap",
    price: 2.74,
    marketCap: 711000000,
    volume24h: 84000000,
    percentChange1h: -0.18,
    percentChange24h: 5.82,
    percentChange7d: 13.4,
    volatility: 0.58,
    liquidityScore: 82
  },
  {
    symbol: "TWT",
    name: "Trust Wallet Token",
    price: 1.17,
    marketCap: 487000000,
    volume24h: 31800000,
    percentChange1h: 0.62,
    percentChange24h: 3.36,
    percentChange7d: 6.9,
    volatility: 0.41,
    liquidityScore: 76
  },
  {
    symbol: "XVS",
    name: "Venus",
    price: 9.82,
    marketCap: 162000000,
    volume24h: 19300000,
    percentChange1h: 0.74,
    percentChange24h: 6.88,
    percentChange7d: 19.6,
    volatility: 0.73,
    liquidityScore: 67
  },
  {
    symbol: "ALPACA",
    name: "Alpaca Finance",
    price: 0.142,
    marketCap: 21400000,
    volume24h: 4800000,
    percentChange1h: -0.32,
    percentChange24h: 4.24,
    percentChange7d: 10.1,
    volatility: 0.86,
    liquidityScore: 51
  },
  {
    symbol: "BAKE",
    name: "BakeryToken",
    price: 0.261,
    marketCap: 76000000,
    volume24h: 14900000,
    percentChange1h: 1.12,
    percentChange24h: 9.74,
    percentChange7d: 15.7,
    volatility: 0.91,
    liquidityScore: 58
  },
  {
    symbol: "USDT",
    name: "Tether USD",
    price: 1,
    marketCap: 112000000000,
    volume24h: 52800000000,
    percentChange1h: 0.01,
    percentChange24h: 0.02,
    percentChange7d: -0.01,
    volatility: 0.02,
    liquidityScore: 98
  }
];

export function getMockMarketData(selectedSymbols: TokenSymbol[]): MarketData[] {
  // Future CoinMarketCap integration belongs here: replace the static dataset with
  // an API-backed provider that maps CMC quote fields into the MarketData type.
  const selected = new Set(selectedSymbols);
  return MOCK_MARKET_DATA.filter((token) => selected.has(token.symbol));
}
