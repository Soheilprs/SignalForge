import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { formatCurrency } from "../lib/utils";
import { BacktestResult } from "../types";

interface BacktestResultsProps {
  result: BacktestResult;
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-forge-line bg-white/5 p-4">
      <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-white">{value}</div>
    </div>
  );
}

export function BacktestResults({ result }: BacktestResultsProps) {
  return (
    <section className="min-w-0 rounded-lg border border-forge-line bg-forge-panel p-5">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-white">Backtest Results</h2>
        <p className="mt-1 text-sm text-slate-400">
          Deterministic 30-day simulation with rebalance costs, slippage, and regime-aware cash mode.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Metric label="Total return" value={`${result.totalReturn >= 0 ? "+" : ""}${result.totalReturn}%`} />
        <Metric label="Final equity" value={formatCurrency(result.finalEquity, false)} />
        <Metric label="Max drawdown" value={`${result.maxDrawdown}%`} />
        <Metric label="Win rate" value={`${result.winRate}%`} />
        <Metric label="Trades" value={String(result.numberOfTrades)} />
        <Metric label="Avg trade" value={`${result.averageTradeReturn >= 0 ? "+" : ""}${result.averageTradeReturn}%`} />
        <Metric label="Best token" value={result.bestToken} />
        <Metric label="Worst token" value={result.worstToken} />
        <Metric label="Risk score" value={String(result.riskAdjustedScore)} />
        <Metric label="Cash days" value={String(result.cashModeDays)} />
      </div>
      <div className="mt-5 h-80 rounded-lg border border-forge-line bg-[#101318] p-3">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={result.equityCurve} margin={{ left: 10, right: 16, top: 12, bottom: 0 }}>
            <defs>
              <linearGradient id="equityGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="#f3ba2f" stopOpacity={0.45} />
                <stop offset="95%" stopColor="#f3ba2f" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#242a33" strokeDasharray="4 4" />
            <XAxis dataKey="label" stroke="#7d8796" tickLine={false} axisLine={false} minTickGap={22} />
            <YAxis
              stroke="#7d8796"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => formatCurrency(Number(value))}
              domain={["dataMin - 150", "dataMax + 150"]}
              width={76}
            />
            <Tooltip
              contentStyle={{
                background: "#171b22",
                border: "1px solid #2a303a",
                borderRadius: 8,
                color: "#f8fafc"
              }}
              formatter={(value) => [formatCurrency(Number(value), false), "Equity"]}
              labelFormatter={(label) => `Day ${String(label).replace("D", "")}`}
            />
            <Area type="monotone" dataKey="value" stroke="#f3ba2f" strokeWidth={2} fill="url(#equityGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
