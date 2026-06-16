import { CheckCircle2, Database, FileJson, ShieldCheck } from "lucide-react";
import { MarketDataProvider } from "../data/providers";
import { StrategySpec } from "../types";

interface SkillOutputSummaryProps {
  strategy: StrategySpec;
  dataProvider: MarketDataProvider;
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-forge-line bg-white/5 p-4">
      <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-2 text-sm font-semibold leading-6 text-white">{value}</div>
    </div>
  );
}

export function SkillOutputSummary({ strategy, dataProvider }: SkillOutputSummaryProps) {
  return (
    <section className="min-w-0 overflow-hidden rounded-lg border border-forge-gold/40 bg-[linear-gradient(135deg,rgba(243,186,47,0.14),rgba(66,211,146,0.08)_48%,rgba(255,255,255,0.04))] p-5 shadow-glow">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-forge-gold px-3 py-1 text-xs font-semibold uppercase tracking-wide text-forge-ink">
            <FileJson className="h-4 w-4" aria-hidden="true" />
            Main Track 2 Deliverable
          </div>
          <h2 className="mt-4 text-2xl font-semibold tracking-normal text-white">{strategy.skillName}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Backtestable CMC Strategy Skill spec generated from selected BNB Chain market signals.
          </p>
        </div>
        <div className="grid gap-2 sm:grid-cols-3 lg:min-w-[420px]">
          <div className="inline-flex items-center gap-2 rounded-md border border-forge-line bg-forge-panel/80 px-3 py-2 text-sm text-slate-200">
            <Database className="h-4 w-4 text-forge-gold" aria-hidden="true" />
            {dataProvider.label}
          </div>
          <div className="inline-flex items-center gap-2 rounded-md border border-forge-line bg-forge-panel/80 px-3 py-2 text-sm text-slate-200">
            <ShieldCheck className="h-4 w-4 text-forge-mint" aria-hidden="true" />
            Backtest-only
          </div>
          <div className="inline-flex items-center gap-2 rounded-md border border-forge-line bg-forge-panel/80 px-3 py-2 text-sm text-slate-200">
            <CheckCircle2 className="h-4 w-4 text-forge-mint" aria-hidden="true" />
            JSON export
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryItem label="Strategy Type" value={strategy.strategyType} />
        <SummaryItem label="Data Source" value={strategy.dataSource} />
        <SummaryItem label="Market Regime" value={strategy.marketRegime.regime} />
        <SummaryItem label="Risk Profile" value={strategy.riskProfile} />
        <SummaryItem label="Execution Mode" value="Backtest-only" />
        <SummaryItem label="Backtestable" value="Yes" />
        <SummaryItem label="Export Format" value="JSON strategy spec" />
        <SummaryItem label="Universe" value={strategy.universe.length > 0 ? strategy.universe.join(", ") : "Awaiting token selection"} />
      </div>
    </section>
  );
}
