import { describe, expect, it } from "vitest";
import { runBacktest } from "./backtester";
import { RISK_CONFIGS } from "./scoring";
import { generateStrategy } from "./strategyGenerator";
import { MarketRegime } from "../types";

const neutralRegime: MarketRegime = {
  regime: "Neutral",
  confidence: 0.5,
  fearGreedScore: 50,
  explanation: "Test neutral regime."
};

describe("runBacktest", () => {
  it("handles empty scored tokens safely", () => {
    const riskConfig = RISK_CONFIGS.Balanced;
    const strategy = generateStrategy([], "Balanced", riskConfig, neutralRegime);
    const result = runBacktest(strategy, [], riskConfig);

    expect(result.initialCapital).toBe(10000);
    expect(result.finalEquity).toBe(10000);
    expect(result.totalReturn).toBe(0);
    expect(result.bestToken).toBe("N/A");
    expect(result.equityCurve).toHaveLength(1);
  });
});
