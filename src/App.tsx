import { useMemo, useState } from "react";
import { BacktestResults } from "./components/BacktestResults";
import { ExportStrategy } from "./components/ExportStrategy";
import { Hero } from "./components/Hero";
import { MarketRegimePanel } from "./components/MarketRegimePanel";
import { SignalTable } from "./components/SignalTable";
import { StrategyBuilder } from "./components/StrategyBuilder";
import { StrategyOutput } from "./components/StrategyOutput";
import { getMockMarketData } from "./data/mockMarketData";
import { runBacktest } from "./lib/backtester";
import { attachIndicators } from "./lib/indicators";
import { detectMarketRegime } from "./lib/regimeDetector";
import { RISK_CONFIGS, scoreTokens } from "./lib/scoring";
import { generateStrategy } from "./lib/strategyGenerator";
import { RiskProfile, TokenSymbol } from "./types";

function App() {
  const [selectedTokens, setSelectedTokens] = useState<TokenSymbol[]>(["BNB", "CAKE", "TWT", "XVS"]);
  const [riskProfile, setRiskProfile] = useState<RiskProfile>("Balanced");
  const [generationKey, setGenerationKey] = useState(0);

  const riskConfig = RISK_CONFIGS[riskProfile];

  const marketData = useMemo(() => getMockMarketData(selectedTokens), [selectedTokens, generationKey]);
  const indicatorData = useMemo(() => attachIndicators(marketData), [marketData]);
  const marketRegime = useMemo(() => detectMarketRegime(indicatorData), [indicatorData]);
  const scoredTokens = useMemo(
    () => scoreTokens(indicatorData, riskConfig, marketRegime),
    [indicatorData, marketRegime, riskConfig]
  );
  const strategy = useMemo(
    () => generateStrategy(scoredTokens, riskProfile, riskConfig, marketRegime),
    [marketRegime, riskConfig, riskProfile, scoredTokens]
  );
  const backtest = useMemo(() => runBacktest(strategy, scoredTokens, riskConfig), [riskConfig, scoredTokens, strategy]);

  function toggleToken(token: TokenSymbol) {
    setSelectedTokens((current) => {
      if (current.includes(token)) {
        return current.length === 1 ? current : current.filter((symbol) => symbol !== token);
      }

      return [...current, token];
    });
  }

  return (
    <div className="min-h-screen bg-forge-ink text-slate-100">
      <Hero />
      <main className="mx-auto grid w-full max-w-7xl min-w-0 gap-5 overflow-hidden px-4 py-6 sm:px-6 lg:px-8">
        <StrategyBuilder
          selectedTokens={selectedTokens}
          riskProfile={riskProfile}
          onTokenToggle={toggleToken}
          onRiskProfileChange={setRiskProfile}
          onGenerate={() => setGenerationKey((key) => key + 1)}
        />
        <MarketRegimePanel marketRegime={marketRegime} />
        <SignalTable tokens={scoredTokens} />
        <StrategyOutput strategy={strategy} />
        <BacktestResults result={backtest} />
        <ExportStrategy strategy={strategy} backtest={backtest} scoredTokens={scoredTokens} />
      </main>
    </div>
  );
}

export default App;
