import { StrategyRule, StrategySpec } from "../types";

interface StrategyOutputProps {
  strategy: StrategySpec;
}

function RuleList({ title, rules }: { title: string; rules: StrategyRule[] }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-200">{title}</h3>
      <ul className="mt-3 space-y-2">
        {rules.map((rule) => (
          <li key={rule.id} className="rounded-md border border-forge-line bg-white/5 px-3 py-2 text-sm leading-6 text-slate-300">
            <div className="text-xs font-semibold text-forge-gold">{rule.id}</div>
            <div className="mt-1 text-slate-200">{rule.rule}</div>
            <div className="mt-1 text-xs leading-5 text-slate-500">{rule.rationale}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function KeyValue({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-md border border-forge-line bg-white/5 px-3 py-2">
      <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-1 text-sm font-semibold text-white">{value}</div>
    </div>
  );
}

export function StrategyOutput({ strategy }: StrategyOutputProps) {
  return (
    <section className="min-w-0 rounded-lg border border-forge-line bg-forge-panel p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Strategy Skill Spec</h2>
          <p className="mt-1 text-sm font-semibold text-forge-gold">{strategy.skillName} v{strategy.version}</p>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">{strategy.strategyThesis}</p>
        </div>
        <div className="rounded-md border border-forge-line bg-white/5 px-3 py-2 text-sm text-slate-300">
          {strategy.executionMode}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {strategy.universe.map((symbol) => (
          <span key={symbol} className="rounded-full bg-forge-gold/15 px-3 py-1 text-sm font-semibold text-forge-gold">
            {symbol}
          </span>
        ))}
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        <KeyValue label="Strategy" value={strategy.strategyName} />
        <KeyValue label="Type" value={strategy.strategyType} />
        <KeyValue label="Data Source" value={strategy.dataSource} />
        <KeyValue label="Authoring" value={strategy.authoringModel} />
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-semibold text-slate-200">Market Assumptions</h3>
        <ul className="mt-3 grid gap-2 lg:grid-cols-3">
          {strategy.marketAssumptions.map((assumption) => (
            <li key={assumption} className="rounded-md border border-forge-line bg-white/5 px-3 py-2 text-sm leading-6 text-slate-300">
              {assumption}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <RuleList title="Entry Rules" rules={strategy.entryRules} />
        <RuleList title="Exit Rules" rules={strategy.exitRules} />
        <RuleList title="Invalidation Rules" rules={strategy.invalidationRules} />
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-5">
        <KeyValue label="Risk Profile" value={strategy.riskControls.riskProfile} />
        <KeyValue label="Max Allocation" value={strategy.riskControls.maxAllocationPerToken} />
        <KeyValue label="Stop Loss" value={strategy.riskControls.stopLoss} />
        <KeyValue label="Take Profit" value={strategy.riskControls.takeProfit} />
        <KeyValue label="Cash Asset" value={strategy.riskControls.cashAsset} />
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        <KeyValue label="Backtest Capital" value={`$${strategy.backtestConfig.initialCapital.toLocaleString()}`} />
        <KeyValue label="Timeframe" value={strategy.backtestConfig.timeframe} />
        <KeyValue label="Fees" value={strategy.backtestConfig.fees} />
        <KeyValue label="Slippage" value={strategy.backtestConfig.slippage} />
      </div>
    </section>
  );
}
