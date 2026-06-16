import { describe, expect, it } from "vitest";
import { getMockMarketData } from "../data/mockMarketData";
import { attachIndicators } from "./indicators";
import { detectMarketRegime } from "./regimeDetector";

describe("detectMarketRegime", () => {
  it("returns a supported market regime", () => {
    const tokens = attachIndicators(getMockMarketData(["BNB", "CAKE", "TWT"]));
    const result = detectMarketRegime(tokens);

    expect(["Bullish", "Neutral", "Bearish", "High Volatility Risk-Off"]).toContain(result.regime);
    expect(result.confidence).toBeGreaterThanOrEqual(0);
    expect(result.fearGreedScore).toBeGreaterThanOrEqual(0);
  });
});
