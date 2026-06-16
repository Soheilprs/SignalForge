import { Check, Copy, Download } from "lucide-react";
import { useMemo, useState } from "react";
import { BacktestResult, ScoredToken, StrategySpec } from "../types";

interface ExportStrategyProps {
  strategy: StrategySpec;
  backtest: BacktestResult;
  scoredTokens: ScoredToken[];
}

export function ExportStrategy({ strategy, backtest, scoredTokens }: ExportStrategyProps) {
  const [copied, setCopied] = useState(false);
  const exportPayload = useMemo(
    () => ({
      ...strategy,
      generatedAt: "demo-deterministic",
      signalRanking: scoredTokens.map((token) => ({
        symbol: token.symbol,
        score: token.score,
        recommendation: token.recommendation,
        rsi: token.rsi,
        macdHistogram: token.macdHistogram,
        aboveLongMA: token.aboveLongMA,
        volumeTrend: token.volumeTrend,
        reason: token.reason
      })),
      backtest
    }),
    [strategy, backtest, scoredTokens]
  );
  const json = JSON.stringify(exportPayload, null, 2);

  async function copyJson() {
    await navigator.clipboard.writeText(json);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  function downloadJson() {
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "signalforge-bnb-strategy.json";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="min-w-0 rounded-lg border border-forge-line bg-forge-panel p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Export Strategy JSON</h2>
          <p className="mt-1 text-sm text-slate-400">Portable strategy spec with ranked signals and backtest output.</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={copyJson}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-forge-line bg-white/5 px-3 text-sm font-semibold text-slate-200 transition hover:border-slate-500 focus:outline-none focus:ring-2 focus:ring-forge-gold"
          >
            {copied ? <Check className="h-4 w-4 text-forge-mint" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied" : "Copy"}
          </button>
          <button
            type="button"
            onClick={downloadJson}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-white px-3 text-sm font-semibold text-forge-ink transition hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-white"
          >
            <Download className="h-4 w-4" />
            Download
          </button>
        </div>
      </div>
      <pre className="mt-5 max-h-96 max-w-full overflow-auto rounded-lg border border-forge-line bg-[#101318] p-4 text-xs leading-5 text-slate-300 scrollbar-thin">
        {json}
      </pre>
    </section>
  );
}
