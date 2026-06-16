import { MarketRegime, RiskConfig, RiskProfile, ScoredToken, StrategySpec, TokenSymbol } from "../types";

export function generateStrategy(
  scoredTokens: ScoredToken[],
  riskProfile: RiskProfile,
  riskConfig: RiskConfig,
  marketRegime: MarketRegime
): StrategySpec {
  const eligibleUniverse = scoredTokens
    .filter((token) => token.recommendation !== "Watch")
    .slice(0, 3)
    .map((token) => token.symbol);

  const fallbackUniverse = scoredTokens.slice(0, 3).map((token) => token.symbol);
  const universe = (eligibleUniverse.length > 0 ? eligibleUniverse : fallbackUniverse) as TokenSymbol[];
  const topToken = scoredTokens[0];

  return {
    skillName: "SignalForge BNB Regime-Aware Momentum Skill",
    version: "1.0.0",
    strategyName: "Regime-Aware BNB Ecosystem Momentum Rotation",
    strategyType: "Momentum + Regime Detection",
    authoringModel: "LLM-authored strategy spec",
    dataSource: "CoinMarketCap market data compatible",
    universe,
    riskProfile,
    marketRegime,
    strategyThesis:
      "Rotate into BNB Chain ecosystem assets with confirmed momentum, constructive technical indicators, and acceptable volatility, while moving defensively into USDT during bearish or risk-off regimes.",
    marketAssumptions: [
      "CMC-compatible market data can provide timely price, volume, liquidity, and percent-change fields for the selected universe.",
      `The current market regime is ${marketRegime.regime} with ${(marketRegime.confidence * 100).toFixed(0)}% confidence.`,
      topToken
        ? `${topToken.symbol} currently has the strongest SignalForge score among selected assets.`
        : "No selected asset currently has a confirmed positive signal."
    ],
    entryRules: [
      {
        id: "ENTRY_001",
        rule: `Enter the highest-ranked token when SignalForge score is above ${riskConfig.scoreThreshold + 10}.`,
        rationale: "Strong momentum with technical confirmation."
      },
      {
        id: "ENTRY_002",
        rule: "Require positive MACD histogram and price above the long moving average for new risk entries.",
        rationale: "Avoid entering tokens without trend confirmation."
      },
      {
        id: "ENTRY_003",
        rule: "In Neutral regimes, only enter tokens with RSI between 45 and 65.",
        rationale: "Range-bound markets require healthier entry timing."
      }
    ],
    exitRules: [
      {
        id: "EXIT_001",
        rule: "Exit when RSI exceeds 75 or MACD histogram turns negative.",
        rationale: "Momentum exhaustion or trend reversal."
      },
      {
        id: "EXIT_002",
        rule: `Exit when SignalForge score falls below ${riskConfig.scoreThreshold - 8}.`,
        rationale: "The token no longer meets the strategy signal threshold."
      },
      {
        id: "EXIT_003",
        rule: `Exit when the ${riskConfig.stopLoss}% stop loss or ${riskConfig.takeProfit}% take profit is reached.`,
        rationale: "Keep downside and upside capture consistent with the selected risk profile."
      }
    ],
    invalidationRules: [
      {
        id: "INVALID_001",
        rule: "Do not enter new risk positions when market regime is High Volatility Risk-Off.",
        rationale: "Protect capital during unstable conditions."
      },
      {
        id: "INVALID_002",
        rule: "Switch to USDT cash mode when the market regime is Bearish.",
        rationale: "The strategy spec is backtest-only and prioritizes capital preservation during broad negative momentum."
      }
    ],
    riskControls: {
      riskProfile,
      maxAllocationPerToken: `${riskConfig.maxAllocation}%`,
      stopLoss: `${riskConfig.stopLoss}%`,
      takeProfit: `${riskConfig.takeProfit}%`,
      rebalanceFrequency: riskConfig.rebalanceFrequency,
      cashAsset: "USDT"
    },
    backtestConfig: {
      initialCapital: 10000,
      timeframe: "30d",
      rebalanceFrequency: riskConfig.rebalanceFrequency,
      fees: "0.1%",
      slippage: "0.05%"
    },
    executionMode: "Backtest-only / no live execution",
    disclaimer: "This is a hackathon strategy spec demo and not financial advice."
  };
}
