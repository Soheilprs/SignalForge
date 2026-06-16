import { describe, expect, it } from "vitest";
import { getMockMarketData } from "../data/mockMarketData";
import { attachIndicators } from "./indicators";
import { detectMarketRegime } from "./regimeDetector";
import { RISK_CONFIGS, scoreTokens } from "./scoring";
import { generateStrategy } from "./strategyGenerator";

describe("generateStrategy", () => {
  it("outputs required CMC Strategy Skill fields", () => {
    const riskConfig = RISK_CONFIGS.Balanced;
    const indicatorData = attachIndicators(getMockMarketData(["BNB", "CAKE", "TWT"]));
    const regime = detectMarketRegime(indicatorData);
    const scoredTokens = scoreTokens(indicatorData, riskConfig, regime);
    const strategy = generateStrategy(scoredTokens, "Balanced", riskConfig, regime);

    expect(strategy.skillName).toBe("SignalForge BNB Regime-Aware Momentum Skill");
    expect(strategy.version).toBe("1.0.0");
    expect(strategy.strategyType).toBe("Momentum + Regime Detection");
    expect(strategy.dataSource).toBe("CoinMarketCap market data compatible");
    expect(strategy.executionMode).toBe("Backtest-only / no live execution");
    expect(strategy.backtestConfig.initialCapital).toBe(10000);
    expect(strategy.entryRules.length).toBeGreaterThan(0);
  });
});
