export type TokenSymbol = "BNB" | "CAKE" | "TWT" | "XVS" | "ALPACA" | "BAKE" | "USDT";

export type RiskProfile = "Conservative" | "Balanced" | "Aggressive";

export type VolatilityFilter = "strict" | "medium" | "loose";

export type VolumeTrend = "Rising" | "Stable" | "Falling";

export type MarketRegimeName = "Bullish" | "Neutral" | "Bearish" | "High Volatility Risk-Off";

export interface MarketData {
  symbol: TokenSymbol;
  name: string;
  price: number;
  marketCap: number;
  volume24h: number;
  percentChange1h: number;
  percentChange24h: number;
  percentChange7d: number;
  volatility: number;
  liquidityScore: number;
}

export interface TechnicalIndicators {
  rsi: number;
  macdValue: number;
  macdSignal: number;
  macdHistogram: number;
  shortMA: number;
  longMA: number;
  volatility: number;
  momentumScore: number;
  volumeTrend: VolumeTrend;
  aboveLongMA: boolean;
}

export interface MarketDataWithIndicators extends MarketData, TechnicalIndicators {
  historicalPrices: number[];
}

export interface MarketRegime {
  regime: MarketRegimeName;
  confidence: number;
  fearGreedScore: number;
  explanation: string;
}

export interface ScoredToken extends MarketDataWithIndicators {
  score: number;
  recommendation: "Watch" | "Eligible" | "Strong";
  reason: string;
}

export interface RiskConfig {
  riskProfile: RiskProfile;
  maxAllocation: number;
  stopLoss: number;
  takeProfit: number;
  rebalanceFrequency: "24h" | "12h" | "6h";
  volatilityFilter: VolatilityFilter;
  scoreThreshold: number;
  maxVolatility: number;
}

export interface StrategyRule {
  id: string;
  rule: string;
  rationale: string;
}

export interface StrategySpec {
  skillName: string;
  version: string;
  strategyName: string;
  strategyType: string;
  authoringModel: string;
  dataSource: string;
  universe: TokenSymbol[];
  riskProfile: RiskProfile;
  marketRegime: MarketRegime;
  strategyThesis: string;
  marketAssumptions: string[];
  entryRules: StrategyRule[];
  exitRules: StrategyRule[];
  invalidationRules: StrategyRule[];
  riskControls: {
    riskProfile: RiskProfile;
    maxAllocationPerToken: string;
    stopLoss: string;
    takeProfit: string;
    rebalanceFrequency: RiskConfig["rebalanceFrequency"];
    cashAsset: "USDT";
  };
  backtestConfig: {
    initialCapital: number;
    timeframe: "30d";
    rebalanceFrequency: RiskConfig["rebalanceFrequency"];
    fees: string;
    slippage: string;
  };
  executionMode: "Backtest-only / no live execution";
  disclaimer: string;
}

export interface EquityPoint {
  day: number;
  label: string;
  value: number;
}

export interface BacktestResult {
  initialCapital: number;
  endingCapital: number;
  finalEquity: number;
  totalReturn: number;
  maxDrawdown: number;
  winRate: number;
  numberOfTrades: number;
  averageTradeReturn: number;
  bestToken: TokenSymbol;
  worstToken: TokenSymbol;
  riskAdjustedScore: number;
  cashModeDays: number;
  equityCurve: EquityPoint[];
}
