import { MarketDataWithIndicators, MarketRegime, RiskConfig, RiskProfile, ScoredToken } from "../types";

export const RISK_CONFIGS: Record<RiskProfile, RiskConfig> = {
  Conservative: {
    riskProfile: "Conservative",
    maxAllocation: 20,
    stopLoss: 4,
    takeProfit: 8,
    rebalanceFrequency: "24h",
    volatilityFilter: "strict",
    scoreThreshold: 56,
    maxVolatility: 0.5
  },
  Balanced: {
    riskProfile: "Balanced",
    maxAllocation: 30,
    stopLoss: 6,
    takeProfit: 12,
    rebalanceFrequency: "12h",
    volatilityFilter: "medium",
    scoreThreshold: 50,
    maxVolatility: 0.75
  },
  Aggressive: {
    riskProfile: "Aggressive",
    maxAllocation: 45,
    stopLoss: 10,
    takeProfit: 20,
    rebalanceFrequency: "6h",
    volatilityFilter: "loose",
    scoreThreshold: 44,
    maxVolatility: 0.95
  }
};

function normalize(value: number, min: number, max: number): number {
  if (max === min) {
    return 0.5;
  }

  return Math.min(1, Math.max(0, (value - min) / (max - min)));
}

function recommendationFor(
  score: number,
  token: MarketDataWithIndicators,
  riskConfig: RiskConfig,
  marketRegime: MarketRegime
): ScoredToken["recommendation"] {
  if (marketRegime.regime === "Bearish" && token.symbol !== "USDT") {
    return "Watch";
  }

  if (marketRegime.regime === "High Volatility Risk-Off" && token.symbol !== "USDT") {
    return score >= riskConfig.scoreThreshold + 22 ? "Eligible" : "Watch";
  }

  if (token.volatility > riskConfig.maxVolatility || score < riskConfig.scoreThreshold) {
    return "Watch";
  }

  if (score >= riskConfig.scoreThreshold + 18) {
    return "Strong";
  }

  return "Eligible";
}

function rsiConfirmation(token: MarketDataWithIndicators, marketRegime: MarketRegime): number {
  if (marketRegime.regime === "Neutral") {
    return token.rsi >= 45 && token.rsi <= 65 ? 1 : 0.35;
  }

  if (marketRegime.regime === "Bearish" || marketRegime.regime === "High Volatility Risk-Off") {
    return token.rsi < 70 ? 0.78 : 0.25;
  }

  return token.rsi >= 48 && token.rsi <= 72 ? 1 : 0.45;
}

function macdConfirmation(token: MarketDataWithIndicators, marketRegime: MarketRegime): number {
  if (token.macdHistogram > 0 && token.macdValue > token.macdSignal) {
    return marketRegime.regime === "Bullish" ? 1 : 0.85;
  }

  if (marketRegime.regime === "Bearish" || marketRegime.regime === "High Volatility Risk-Off") {
    return token.symbol === "USDT" ? 0.8 : 0.2;
  }

  return 0.35;
}

function volumeTrendScore(token: MarketDataWithIndicators): number {
  if (token.volumeTrend === "Rising") {
    return 1;
  }

  if (token.volumeTrend === "Stable") {
    return 0.62;
  }

  return 0.25;
}

function regimeAdjustment(token: MarketDataWithIndicators, marketRegime: MarketRegime): number {
  if (marketRegime.regime === "Bullish") {
    return token.macdHistogram > 0 && token.percentChange7d > 0 ? 0.1 : 0.02;
  }

  if (marketRegime.regime === "Neutral") {
    return token.rsi >= 45 && token.rsi <= 65 && token.macdHistogram > 0 ? 0.04 : -0.08;
  }

  if (marketRegime.regime === "Bearish") {
    return token.symbol === "USDT" ? 0.24 : -0.28;
  }

  return token.symbol === "USDT" ? 0.18 : -0.22;
}

function reasonFor(token: MarketDataWithIndicators, marketRegime: MarketRegime, recommendation: ScoredToken["recommendation"]) {
  if (token.symbol === "USDT" && (marketRegime.regime === "Bearish" || marketRegime.regime === "High Volatility Risk-Off")) {
    return "Defensive cash asset preferred while regime risk is elevated.";
  }

  if (recommendation === "Watch") {
    return `Signal is constrained by ${marketRegime.regime.toLowerCase()} regime, volatility, or incomplete technical confirmation.`;
  }

  const macd = token.macdHistogram > 0 ? "positive MACD histogram" : "weak MACD histogram";
  const rsi = token.rsi >= 45 && token.rsi <= 70 ? "healthy RSI" : "stretched RSI";
  const movingAverage = token.aboveLongMA ? "above long moving average" : "below long moving average";

  return `${macd}, ${rsi}, ${token.volumeTrend.toLowerCase()} volume, ${movingAverage}, and ${marketRegime.regime.toLowerCase()} market regime.`;
}

export function scoreTokens(
  tokens: MarketDataWithIndicators[],
  riskConfig: RiskConfig,
  marketRegime: MarketRegime
): ScoredToken[] {
  const changes24h = tokens.map((token) => token.percentChange24h);
  const changes7d = tokens.map((token) => token.percentChange7d);
  const volatility = tokens.map((token) => token.volatility);

  const ranges = {
    change24h: [Math.min(...changes24h), Math.max(...changes24h)],
    change7d: [Math.min(...changes7d), Math.max(...changes7d)],
    volatility: [Math.min(...volatility), Math.max(...volatility)]
  };

  return tokens
    .map((token) => {
      const normalized24hMomentum = normalize(token.percentChange24h, ranges.change24h[0], ranges.change24h[1]);
      const normalized7dMomentum = normalize(token.percentChange7d, ranges.change7d[0], ranges.change7d[1]);
      const volatilityPenalty = normalize(token.volatility, ranges.volatility[0], ranges.volatility[1]);
      const normalizedLiquidityScore = token.liquidityScore / 100;
      const normalizedRsiConfirmation = rsiConfirmation(token, marketRegime);
      const normalizedMacdConfirmation = macdConfirmation(token, marketRegime);
      const normalizedVolumeTrend = volumeTrendScore(token);

      const rawScore =
        0.16 * normalizedRsiConfirmation +
        0.18 * normalizedMacdConfirmation +
        0.14 * normalized24hMomentum +
        0.16 * normalized7dMomentum +
        0.12 * normalizedVolumeTrend -
        0.14 * volatilityPenalty +
        0.12 * normalizedLiquidityScore +
        regimeAdjustment(token, marketRegime);

      const score = Math.max(0, Math.min(100, Math.round(rawScore * 100)));
      const recommendation = recommendationFor(score, token, riskConfig, marketRegime);

      return {
        ...token,
        score,
        recommendation,
        reason: reasonFor(token, marketRegime, recommendation)
      };
    })
    .sort((a, b) => b.score - a.score);
}
