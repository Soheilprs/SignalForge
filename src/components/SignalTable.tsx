import { cn, formatCurrency, formatPercent } from "../lib/utils";
import { ScoredToken } from "../types";

interface SignalTableProps {
  tokens: ScoredToken[];
}

function recommendationClass(recommendation: ScoredToken["recommendation"]) {
  if (recommendation === "Strong") {
    return "bg-forge-mint/15 text-forge-mint";
  }

  if (recommendation === "Eligible") {
    return "bg-forge-gold/15 text-forge-gold";
  }

  return "bg-slate-500/15 text-slate-300";
}

export function SignalTable({ tokens }: SignalTableProps) {
  return (
    <section className="min-w-0 rounded-lg border border-forge-line bg-forge-panel p-5">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-white">Indicator-Aware Signal Table</h2>
        <p className="mt-1 text-sm text-slate-400">
          Ranked by RSI, MACD, momentum, volume trend, liquidity, volatility, and regime fit.
        </p>
      </div>
      <div className="max-w-full min-w-0 overflow-x-auto scrollbar-thin">
        <table className="w-full min-w-[1180px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-forge-line text-xs uppercase tracking-wide text-slate-500">
              <th className="py-3 pr-4 font-medium">Token</th>
              <th className="py-3 pr-4 font-medium">Price</th>
              <th className="py-3 pr-4 font-medium">RSI</th>
              <th className="py-3 pr-4 font-medium">MACD Hist.</th>
              <th className="py-3 pr-4 font-medium">24h</th>
              <th className="py-3 pr-4 font-medium">7d</th>
              <th className="py-3 pr-4 font-medium">Volume Trend</th>
              <th className="py-3 pr-4 font-medium">Volatility</th>
              <th className="py-3 pr-4 font-medium">Score</th>
              <th className="py-3 pr-4 font-medium">Recommendation</th>
              <th className="py-3 font-medium">Reason</th>
            </tr>
          </thead>
          <tbody>
            {tokens.map((token) => (
              <tr key={token.symbol} className="border-b border-forge-line/80 last:border-b-0">
                <td className="py-4 pr-4">
                  <div className="font-semibold text-white">{token.symbol}</div>
                  <div className="text-xs text-slate-500">{token.name}</div>
                </td>
                <td className="py-4 pr-4 text-slate-200">{formatCurrency(token.price, false)}</td>
                <td className="py-4 pr-4 text-slate-300">{token.rsi.toFixed(1)}</td>
                <td className={cn("py-4 pr-4", token.macdHistogram >= 0 ? "text-forge-mint" : "text-forge-coral")}>
                  {token.macdHistogram.toFixed(3)}
                </td>
                <td className={cn("py-4 pr-4", token.percentChange24h >= 0 ? "text-forge-mint" : "text-forge-coral")}>
                  {formatPercent(token.percentChange24h)}
                </td>
                <td className={cn("py-4 pr-4", token.percentChange7d >= 0 ? "text-forge-mint" : "text-forge-coral")}>
                  {formatPercent(token.percentChange7d)}
                </td>
                <td className="py-4 pr-4 text-slate-300">{token.volumeTrend}</td>
                <td className="py-4 pr-4 text-slate-300">{(token.volatility * 100).toFixed(0)}%</td>
                <td className="py-4 pr-4">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-20 rounded-full bg-slate-800">
                      <div className="h-2 rounded-full bg-forge-gold" style={{ width: `${token.score}%` }} />
                    </div>
                    <span className="font-semibold text-white">{token.score}</span>
                  </div>
                </td>
                <td className="py-4">
                  <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-semibold", recommendationClass(token.recommendation))}>
                    {token.recommendation}
                  </span>
                </td>
                <td className="py-4 text-xs leading-5 text-slate-400">{token.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
