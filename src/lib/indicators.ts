import { MarketData, MarketDataWithIndicators, TechnicalIndicators, VolumeTrend } from "../types";

function tokenSeed(symbol: string): number {
  return symbol.split("").reduce((sum, char, index) => sum + char.charCodeAt(0) * (index + 3), 17);
}

function deterministicNoise(seed: number, index: number): number {
  const value = Math.sin(seed * 12.9898 + index * 78.233) * 43758.5453;
  return value - Math.floor(value);
}

function average(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function exponentialMovingAverage(values: number[], period: number): number[] {
  const multiplier = 2 / (period + 1);
  const ema: number[] = [];

  values.forEach((value, index) => {
    if (index === 0) {
      ema.push(value);
      return;
    }

    ema.push(value * multiplier + ema[index - 1] * (1 - multiplier));
  });

  return ema;
}

function calculateRsi(prices: number[], period = 14): number {
  const changes = prices.slice(1).map((price, index) => price - prices[index]);
  const recent = changes.slice(-period);
  const gains = recent.map((change) => Math.max(change, 0));
  const losses = recent.map((change) => Math.abs(Math.min(change, 0)));
  const averageGain = average(gains);
  const averageLoss = average(losses);

  if (averageLoss === 0) {
    return 100;
  }

  const relativeStrength = averageGain / averageLoss;
  return 100 - 100 / (1 + relativeStrength);
}

function calculateMacd(prices: number[]) {
  const fast = exponentialMovingAverage(prices, 12);
  const slow = exponentialMovingAverage(prices, 26);
  const macdLine = fast.map((value, index) => value - slow[index]);
  const signalLine = exponentialMovingAverage(macdLine, 9);
  const macdValue = macdLine[macdLine.length - 1];
  const macdSignal = signalLine[signalLine.length - 1];

  return {
    macdValue,
    macdSignal,
    macdHistogram: macdValue - macdSignal
  };
}

function calculateVolatility(prices: number[]): number {
  const returns = prices.slice(1).map((price, index) => (price - prices[index]) / prices[index]);
  const avgReturn = average(returns);
  const variance = average(returns.map((value) => (value - avgReturn) ** 2));

  return Math.sqrt(variance) * Math.sqrt(30);
}

function calculateVolumeTrend(token: MarketData): VolumeTrend {
  const activityRatio = token.volume24h / token.marketCap;
  const trendScore = token.percentChange24h * 0.45 + token.percentChange7d * 0.08 + activityRatio * 120;

  if (trendScore > 5.1) {
    return "Rising";
  }

  if (trendScore < 1.6) {
    return "Falling";
  }

  return "Stable";
}

export function generateHistoricalPrices(token: MarketData, days = 60): number[] {
  const seed = tokenSeed(token.symbol);
  const trend = (token.percentChange7d / 100) / 7;
  const prices: number[] = [];
  let price = token.price / Math.max(0.72, 1 + token.percentChange7d / 100);

  for (let day = 0; day < days; day += 1) {
    const cycle = Math.sin((day + seed) / 5) * token.volatility * 0.006;
    const noise = (deterministicNoise(seed, day) - 0.5) * token.volatility * 0.012;
    const meanReversion = day > days - 9 ? token.percentChange24h / 100 / 12 : 0;
    price = Math.max(0.0001, price * (1 + trend * 0.33 + cycle + noise + meanReversion));
    prices.push(Number(price.toFixed(token.price < 1 ? 5 : 3)));
  }

  prices[prices.length - 1] = token.price;
  return prices;
}

export function calculateIndicators(token: MarketData): TechnicalIndicators & { historicalPrices: number[] } {
  const historicalPrices = generateHistoricalPrices(token);
  const shortMA = average(historicalPrices.slice(-7));
  const longMA = average(historicalPrices.slice(-21));
  const macd = calculateMacd(historicalPrices);
  const calculatedVolatility = calculateVolatility(historicalPrices);
  const volatility = Number(((token.volatility * 0.72 + calculatedVolatility * 0.28)).toFixed(3));
  const rsi = Number(calculateRsi(historicalPrices).toFixed(1));
  const momentumScore = Math.max(0, Math.min(100, Math.round(token.percentChange24h * 3.5 + token.percentChange7d * 2.2 + 45)));

  return {
    historicalPrices,
    rsi,
    macdValue: Number(macd.macdValue.toFixed(4)),
    macdSignal: Number(macd.macdSignal.toFixed(4)),
    macdHistogram: Number(macd.macdHistogram.toFixed(4)),
    shortMA: Number(shortMA.toFixed(token.price < 1 ? 5 : 3)),
    longMA: Number(longMA.toFixed(token.price < 1 ? 5 : 3)),
    volatility,
    momentumScore,
    volumeTrend: calculateVolumeTrend(token),
    aboveLongMA: token.price >= longMA
  };
}

export function attachIndicators(tokens: MarketData[]): MarketDataWithIndicators[] {
  return tokens.map((token) => ({
    ...token,
    ...calculateIndicators(token)
  }));
}
