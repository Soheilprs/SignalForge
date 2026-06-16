import { MarketDataWithIndicators, MarketRegime, MarketRegimeName } from "../types";

function average(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function confidenceFor(regime: MarketRegimeName, average7d: number, averageVolatility: number, aboveLongMARatio: number) {
  if (regime === "High Volatility Risk-Off") {
    return Math.min(0.94, 0.62 + (averageVolatility - 0.68) * 0.6);
  }

  if (regime === "Bullish") {
    return Math.min(0.92, 0.58 + average7d / 30 + aboveLongMARatio * 0.18);
  }

  if (regime === "Bearish") {
    return Math.min(0.9, 0.58 + Math.abs(average7d) / 28 + (1 - aboveLongMARatio) * 0.14);
  }

  return Math.min(0.82, 0.52 + (1 - Math.min(averageVolatility, 1)) * 0.12);
}

export function detectMarketRegime(tokens: MarketDataWithIndicators[]): MarketRegime {
  if (tokens.length === 0) {
    return {
      regime: "Neutral",
      confidence: 0.5,
      fearGreedScore: 50,
      explanation: "No token data is available, so the skill defaults to a neutral market regime."
    };
  }

  const average24h = average(tokens.map((token) => token.percentChange24h));
  const average7d = average(tokens.map((token) => token.percentChange7d));
  const averageVolatility = average(tokens.map((token) => token.volatility));
  const aboveLongMARatio = tokens.filter((token) => token.aboveLongMA).length / tokens.length;
  const fearGreedScore = Math.round(
    Math.max(8, Math.min(92, 50 + average7d * 2.1 + average24h * 2.8 + (aboveLongMARatio - 0.5) * 34 - averageVolatility * 15))
  );

  let regime: MarketRegimeName = "Neutral";

  if (averageVolatility > 0.72) {
    regime = "High Volatility Risk-Off";
  } else if (average7d < -4) {
    regime = "Bearish";
  } else if (average7d > 4 && aboveLongMARatio > 0.5) {
    regime = "Bullish";
  }

  const confidence = Number(confidenceFor(regime, average7d, averageVolatility, aboveLongMARatio).toFixed(2));

  const explanations: Record<MarketRegimeName, string> = {
    Bullish:
      "BNB ecosystem momentum is positive, most selected tokens are trading above their long moving average, and volatility is moderate.",
    Neutral:
      "Market signals are mixed, so the skill favors technical confirmation and avoids over-weighting pure momentum.",
    Bearish:
      "Selected tokens show negative weekly momentum, so the skill prioritizes capital preservation and USDT cash mode.",
    "High Volatility Risk-Off":
      "Average volatility is elevated across the selected universe, so the skill suppresses risk recommendations and emphasizes defensive allocation."
  };

  return {
    regime,
    confidence,
    fearGreedScore,
    explanation: explanations[regime]
  };
}
