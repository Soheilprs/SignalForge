import { RefreshCw } from "lucide-react";
import { DEFAULT_TOKEN_UNIVERSE } from "../data/mockMarketData";
import { RISK_CONFIGS } from "../lib/scoring";
import { cn } from "../lib/utils";
import { DataMode, RiskProfile, TokenSymbol } from "../types";

interface StrategyBuilderProps {
  selectedTokens: TokenSymbol[];
  riskProfile: RiskProfile;
  dataModeLabel: string;
  dataMode: DataMode;
  onTokenToggle: (token: TokenSymbol) => void;
  onRiskProfileChange: (riskProfile: RiskProfile) => void;
  onDataModeChange: (dataMode: DataMode) => void;
  onGenerate: () => void;
}

export function StrategyBuilder({
  selectedTokens,
  riskProfile,
  dataModeLabel,
  dataMode,
  onTokenToggle,
  onRiskProfileChange,
  onDataModeChange,
  onGenerate
}: StrategyBuilderProps) {
  return (
    <section className="min-w-0 rounded-lg border border-forge-line bg-forge-panel p-5">
      <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold text-white">CMC Skill Builder</h2>
          <p className="mt-1 text-sm text-slate-400">
            Choose the BNB Chain market universe and risk profile for the backtestable strategy spec.
          </p>
          <div className="mt-3 inline-flex rounded-full border border-forge-line bg-white/5 px-3 py-1 text-xs font-semibold text-forge-gold">
            {dataModeLabel}
          </div>
        </div>
        <button
          type="button"
          onClick={onGenerate}
          className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-md bg-forge-gold px-4 text-sm font-semibold text-forge-ink transition hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-forge-gold focus:ring-offset-2 focus:ring-offset-forge-panel"
        >
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          Generate strategy
        </button>
      </div>

      <div className="mt-6 grid min-w-0 gap-6">
        <div className="min-w-0">
          <div className="mb-3 text-sm font-medium text-slate-200">Data Source</div>
          <div className="grid min-w-0 gap-2 md:grid-cols-2">
            {[
              { mode: "mock" as const, label: "Demo Data", description: "Deterministic CMC-compatible demo data" },
              { mode: "live-cmc" as const, label: "Live CMC Quotes", description: "Server-side CoinMarketCap latest quotes" }
            ].map((option) => {
              const active = option.mode === dataMode;
              return (
                <button
                  key={option.mode}
                  type="button"
                  onClick={() => onDataModeChange(option.mode)}
                  className={cn(
                    "rounded-md border p-3 text-left transition focus:outline-none focus:ring-2 focus:ring-forge-gold",
                    active ? "border-forge-gold bg-forge-gold/12" : "border-forge-line bg-white/5 hover:border-slate-500"
                  )}
                >
                  <div className="text-sm font-semibold text-white">{option.label}</div>
                  <div className="mt-1 text-xs leading-5 text-slate-400">{option.description}</div>
                </button>
              );
            })}
          </div>
          <p className="mt-3 text-xs leading-5 text-slate-500">
            Latest market fields can be live from CMC. Historical indicators and the MVP backtest use deterministic generated history.
          </p>
        </div>

        <div className="min-w-0">
          <div className="mb-3 text-sm font-medium text-slate-200">Token universe</div>
          <div className="grid min-w-0 grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-7">
            {DEFAULT_TOKEN_UNIVERSE.map((token) => {
              const active = selectedTokens.includes(token);
              return (
                <button
                  key={token}
                  type="button"
                  onClick={() => onTokenToggle(token)}
                  className={cn(
                    "h-11 rounded-md border text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-forge-gold",
                    active
                      ? "border-forge-gold bg-forge-gold text-forge-ink"
                      : "border-forge-line bg-white/5 text-slate-300 hover:border-slate-500"
                  )}
                >
                  {token}
                </button>
              );
            })}
          </div>
        </div>

        <div className="min-w-0">
          <div className="mb-3 text-sm font-medium text-slate-200">Risk profile</div>
          <div className="grid min-w-0 gap-2 md:grid-cols-3">
            {(Object.keys(RISK_CONFIGS) as RiskProfile[]).map((profile) => {
              const config = RISK_CONFIGS[profile];
              const active = profile === riskProfile;
              return (
                <button
                  key={profile}
                  type="button"
                  onClick={() => onRiskProfileChange(profile)}
                  className={cn(
                    "rounded-md border p-3 text-left transition focus:outline-none focus:ring-2 focus:ring-forge-gold",
                    active ? "border-forge-gold bg-forge-gold/12" : "border-forge-line bg-white/5 hover:border-slate-500"
                  )}
                >
                  <div className="text-sm font-semibold text-white">{profile}</div>
                  <div className="mt-1 text-xs leading-5 text-slate-400">
                    {config.maxAllocation}% max allocation · {config.stopLoss}% stop
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
