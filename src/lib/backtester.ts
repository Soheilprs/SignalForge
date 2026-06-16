import { BacktestResult, RiskConfig, ScoredToken, StrategySpec, TokenSymbol } from "../types";

const RISK_MULTIPLIER = {
  Conservative: 0.7,
  Balanced: 1,
  Aggressive: 1.3
} as const;

function deterministicNoise(seed: number, day: number): number {
  const value = Math.sin(seed * 12.9898 + day * 78.233) * 43758.5453;
  return value - Math.floor(value);
}

function tokenSeed(symbol: string): number {
  return symbol.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

function maxDrawdown(values: number[]): number {
  let peak = values[0] ?? 0;
  let drawdown = 0;

  values.forEach((value) => {
    peak = Math.max(peak, value);
    drawdown = Math.max(drawdown, (peak - value) / peak);
  });

  return drawdown * 100;
}

function parsePercent(value: string): number {
  return Number.parseFloat(value.replace("%", "")) / 100;
}

export function runBacktest(
  strategy: StrategySpec,
  scoredTokens: ScoredToken[],
  riskConfig: RiskConfig
): BacktestResult {
  const selected = scoredTokens.filter((token) => strategy.universe.includes(token.symbol));
  const tradable = selected.length > 0 ? selected : scoredTokens.slice(0, 1);
  const startingCapital = strategy.backtestConfig.initialCapital;
  const curve = [{ day: 0, label: "D0", value: startingCapital }];
  const tradeReturns: number[] = [];
  let capital = startingCapital;
  let wins = 0;
  let losses = 0;
  let cashModeDays = 0;
  const feeRate = parsePercent(strategy.backtestConfig.fees);
  const slippageRate = parsePercent(strategy.backtestConfig.slippage);
  const riskOff = strategy.marketRegime.regime === "Bearish" || strategy.marketRegime.regime === "High Volatility Risk-Off";

  for (let day = 1; day <= 30; day += 1) {
    const token = riskOff ? scoredTokens.find((item) => item.symbol === "USDT") ?? tradable[0] : tradable[(day - 1) % tradable.length];
    const seed = tokenSeed(token.symbol);
    const momentumBias =
      (token.percentChange24h * 0.1 +
        token.percentChange7d * 0.032 +
        token.score * 0.014 +
        token.macdHistogram * 0.2 +
        (token.aboveLongMA ? 0.28 : -0.18)) /
      100;
    const riskAdjustment = RISK_MULTIPLIER[strategy.riskProfile];
    const volatilityDrag = token.volatility * (riskOff ? 0.001 : 0.0035) * riskAdjustment;
    const wave = (deterministicNoise(seed, day) - 0.42) * token.volatility * (riskOff ? 0.004 : 0.02) * riskAdjustment;
    const tradeCost = day % Math.max(1, Number.parseInt(riskConfig.rebalanceFrequency, 10) / 6) === 0 ? feeRate + slippageRate : 0;
    const dailyReturn = token.symbol === "USDT" ? 0.00012 - tradeCost * 0.1 : momentumBias * riskAdjustment + wave - volatilityDrag - tradeCost;

    if (riskOff) {
      cashModeDays += 1;
    }

    if (dailyReturn >= 0) {
      wins += 1;
    } else {
      losses += 1;
    }

    tradeReturns.push(dailyReturn);
    capital = Math.max(capital * (1 + dailyReturn), startingCapital * 0.72);
    curve.push({
      day,
      label: `D${day}`,
      value: Number(capital.toFixed(2))
    });
  }

  const rankedByProjectedReturn = [...tradable].sort((a, b) => {
    const aReturn = a.percentChange24h * 0.35 + a.percentChange7d * 0.65 - a.volatility * 2;
    const bReturn = b.percentChange24h * 0.35 + b.percentChange7d * 0.65 - b.volatility * 2;
    return bReturn - aReturn;
  });

  const rebalanceHours = Number.parseInt(riskConfig.rebalanceFrequency, 10);
  const numberOfTrades = Math.round((30 * 24) / rebalanceHours);
  const outcomes = wins + losses;
  const averageTradeReturn = tradeReturns.reduce((sum, value) => sum + value, 0) / Math.max(1, tradeReturns.length);
  const calculatedMaxDrawdown = maxDrawdown(curve.map((point) => point.value));
  const totalReturn = ((capital - startingCapital) / startingCapital) * 100;
  const riskAdjustedScore = Math.max(0, Math.min(100, Math.round(55 + totalReturn * 1.8 - calculatedMaxDrawdown * 1.3 + (wins / Math.max(1, outcomes)) * 18)));

  return {
    initialCapital: startingCapital,
    endingCapital: Number(capital.toFixed(2)),
    finalEquity: Number(capital.toFixed(2)),
    totalReturn: Number(totalReturn.toFixed(2)),
    maxDrawdown: Number(calculatedMaxDrawdown.toFixed(2)),
    winRate: Number(((wins / Math.max(1, outcomes)) * 100).toFixed(1)),
    numberOfTrades,
    averageTradeReturn: Number((averageTradeReturn * 100).toFixed(3)),
    bestToken: rankedByProjectedReturn[0].symbol as TokenSymbol,
    worstToken: rankedByProjectedReturn[rankedByProjectedReturn.length - 1].symbol as TokenSymbol,
    riskAdjustedScore,
    cashModeDays,
    equityCurve: curve
  };
}
