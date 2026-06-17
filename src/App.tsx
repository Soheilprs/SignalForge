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
import { DATA_MODE_LABELS, marketDataProviders } from "./data/providers";
import { runBacktest } from "./lib/backtester";
import { attachIndicators } from "./lib/indicators";
import { detectMarketRegime } from "./lib/regimeDetector";
import { RISK_CONFIGS, scoreTokens } from "./lib/scoring";
import { generateStrategy } from "./lib/strategyGenerator";
import { DataMode, MarketData, RiskProfile, TokenSymbol } from "./types";

function App() {
  const [selectedTokens, setSelectedTokens] = useState<TokenSymbol[]>(["BNB", "CAKE", "TWT", "XVS"]);
  const [riskProfile, setRiskProfile] = useState<RiskProfile>("Balanced");
  const [generationKey, setGenerationKey] = useState(0);
  const [dataMode, setDataMode] = useState<DataMode>("mock");
  const [activeMarketDataMode, setActiveMarketDataMode] = useState<DataMode>("mock");
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [dataError, setDataError] = useState<string | null>(null);
  const [isLoadingMarketData, setIsLoadingMarketData] = useState(false);

  const riskConfig = RISK_CONFIGS[riskProfile];
  const dataProvider = marketDataProviders[activeMarketDataMode];
  const requestedDataProvider = marketDataProviders[dataMode];

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
        const data = await requestedDataProvider.getMarketData(selectedTokens);

        if (!cancelled) {
          setMarketData(data);
          setActiveMarketDataMode(dataMode);
        }
      } catch (error) {
        if (!cancelled) {
          const fallbackData = await marketDataProviders.mock.getMarketData(selectedTokens);
          const errorMessage = error instanceof Error ? error.message : "Market data provider failed.";
          setMarketData(fallbackData);
          setActiveMarketDataMode("mock");
          setDataMode("mock");
          setDataError(
            dataMode === "live-cmc"
              ? `Live CMC data unavailable. Using deterministic demo data. ${errorMessage}`
              : errorMessage
          );
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
  }, [dataMode, generationKey, requestedDataProvider, selectedTokens]);

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
            dataModeLabel={DATA_MODE_LABELS[activeMarketDataMode]}
            dataMode={dataMode}
            onTokenToggle={toggleToken}
            onRiskProfileChange={setRiskProfile}
            onDataModeChange={setDataMode}
            onGenerate={() => setGenerationKey((key) => key + 1)}
          />

          {dataError ? (
            <div className="rounded-lg border border-forge-gold/40 bg-forge-gold/10 px-4 py-3 text-sm leading-6 text-slate-200">
              {dataError}
            </div>
          ) : null}

          {selectedTokens.length === 0 ? (
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
              <ExportStrategy
                strategy={strategy}
                backtest={backtest}
                scoredTokens={scoredTokens}
                marketDataMode={activeMarketDataMode}
              />
            </>
          )}
        </ErrorBoundary>
      </main>
    </div>
  );
}

export default App;
