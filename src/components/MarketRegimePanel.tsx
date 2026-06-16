import { Gauge, ShieldAlert, TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "../lib/utils";
import { MarketRegime } from "../types";

interface MarketRegimePanelProps {
  marketRegime: MarketRegime;
}

function regimeTone(regime: MarketRegime["regime"]) {
  if (regime === "Bullish") {
    return "text-forge-mint bg-forge-mint/15";
  }

  if (regime === "Bearish" || regime === "High Volatility Risk-Off") {
    return "text-forge-coral bg-forge-coral/15";
  }

  return "text-forge-gold bg-forge-gold/15";
}

function RegimeIcon({ regime }: { regime: MarketRegime["regime"] }) {
  if (regime === "Bullish") {
    return <TrendingUp className="h-5 w-5" aria-hidden="true" />;
  }

  if (regime === "Bearish") {
    return <TrendingDown className="h-5 w-5" aria-hidden="true" />;
  }

  if (regime === "High Volatility Risk-Off") {
    return <ShieldAlert className="h-5 w-5" aria-hidden="true" />;
  }

  return <Gauge className="h-5 w-5" aria-hidden="true" />;
}

export function MarketRegimePanel({ marketRegime }: MarketRegimePanelProps) {
  return (
    <section className="min-w-0 rounded-lg border border-forge-line bg-forge-panel p-5">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          <h2 className="text-lg font-semibold text-white">Market Regime</h2>
          <p className="mt-1 text-sm text-slate-400">
            Deterministic regime classification from CMC-compatible market and technical signals.
          </p>
          <p className="mt-4 text-sm leading-6 text-slate-300">{marketRegime.explanation}</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[430px]">
          <div className="rounded-lg border border-forge-line bg-white/5 p-4">
            <div className={cn("inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold", regimeTone(marketRegime.regime))}>
              <RegimeIcon regime={marketRegime.regime} />
              {marketRegime.regime}
            </div>
            <div className="mt-3 text-xs uppercase tracking-wide text-slate-500">Current regime</div>
          </div>
          <div className="rounded-lg border border-forge-line bg-white/5 p-4">
            <div className="text-2xl font-semibold text-white">{(marketRegime.confidence * 100).toFixed(0)}%</div>
            <div className="mt-3 text-xs uppercase tracking-wide text-slate-500">Confidence</div>
          </div>
          <div className="rounded-lg border border-forge-line bg-white/5 p-4">
            <div className="text-2xl font-semibold text-white">{marketRegime.fearGreedScore}</div>
            <div className="mt-3 text-xs uppercase tracking-wide text-slate-500">Fear & Greed</div>
          </div>
        </div>
      </div>
    </section>
  );
}
