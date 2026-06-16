import { useEffect, useMemo, useState } from "react";
import { BacktestResults } from "./components/BacktestResults";
import { EmptyState } from "./components/EmptyState";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ExportStrategy } from "./components/ExportStrategy";
import { Hero } from "./components/Hero";
import { MarketRegimePanel } from "./components/MarketRegimePanel";
import { SignalTable } from "./components/SignalTable";
import { SkillOutputSummary } from "./components/SkillOutputSummary";
import { StrategyBuilder } from "./components/StrategyBuilder";
import { StrategyOutput } from "./components/StrategyOutput";
import { DEFAULT_DATA_MODE_LABEL, marketDataProviders } from "./data/providers";
import { runBacktest } from "./lib/backtester";
import { attachIndicators } from "./lib/indicators";
import { detectMarketRegime } from "./lib/regimeDetector";
import { RISK_CONFIGS, scoreTokens } from "./lib/scoring";
import { generateStrategy } from "./lib/strategyGenerator";
import { MarketData, RiskProfile, TokenSymbol } from "./types";

function App() {
  const [selectedTokens, setSelectedTokens] = useState<TokenSymbol[]>(["BNB", "CAKE", "TWT", "XVS"]);
  const [riskProfile, setRiskProfile] = useState<RiskProfile>("Balanced");
  const [generationKey, setGenerationKey] = useState(0);
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [dataError, setDataError] = useState<string | null>(null);
  const [isLoadingMarketData, setIsLoadingMarketData] = useState(false);

  const riskConfig = RISK_CONFIGS[riskProfile];
  const dataProvider = marketDataProviders.mock;

  useEffect(() => {
    let cancelled = false;

    async function loadMarketData() {
      setDataError(null);

      if (selectedTokens.length === 0) {
        setMarketData([]);
        return;
      }

      setIsLoadingMarketData(true);

      try {
        const data = await dataProvider.getMarketData(selectedTokens);

        if (!cancelled) {
          setMarketData(data);
        }
      } catch (error) {
        if (!cancelled) {
          setMarketData([]);
          setDataError(error instanceof Error ? error.message : "Market data provider failed.");
        }
      } finally {
        if (!cancelled) {
          setIsLoadingMarketData(false);
        }
      }
    }

    void loadMarketData();

    return () => {
      cancelled = true;
    };
  }, [dataProvider, generationKey, selectedTokens]);

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
        return current.filter((symbol) => symbol !== token);
      }

      return [...current, token];
    });
  }

  return (
    <div className="min-h-screen bg-forge-ink text-slate-100">
      <Hero />
      <main className="mx-auto grid w-full max-w-7xl min-w-0 gap-5 overflow-hidden px-4 py-6 sm:px-6 lg:px-8">
        <ErrorBoundary>
          <StrategyBuilder
            selectedTokens={selectedTokens}
            riskProfile={riskProfile}
            dataModeLabel={DEFAULT_DATA_MODE_LABEL}
            onTokenToggle={toggleToken}
            onRiskProfileChange={setRiskProfile}
            onGenerate={() => setGenerationKey((key) => key + 1)}
          />

          {dataError ? (
            <EmptyState title="Market data unavailable" message={dataError} />
          ) : selectedTokens.length === 0 ? (
            <EmptyState
              title="Select at least one token to generate a strategy skill."
              message="Choose one or more BNB Chain ecosystem tokens in the builder to create signals, a strategy spec, and a backtest."
            />
          ) : isLoadingMarketData ? (
            <EmptyState title="Loading market data" message="Preparing deterministic CMC-compatible demo data." />
          ) : marketData.length === 0 ? (
            <EmptyState
              title="No market data returned"
              message="Select at least one token to generate a strategy skill. The backtest will appear after valid market data is available."
            />
          ) : (
            <>
              <SkillOutputSummary strategy={strategy} dataProvider={dataProvider} />
              <MarketRegimePanel marketRegime={marketRegime} />
              <SignalTable tokens={scoredTokens} />
              <StrategyOutput strategy={strategy} />
              <BacktestResults result={backtest} />
              <ExportStrategy strategy={strategy} backtest={backtest} scoredTokens={scoredTokens} />
            </>
          )}
        </ErrorBoundary>
      </main>
    </div>
  );
}

export default App;
