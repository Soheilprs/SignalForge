import { Activity, Download, FileJson, ShieldCheck } from "lucide-react";

export function Hero() {
  return (
    <section className="min-w-0 border-b border-forge-line bg-[radial-gradient(circle_at_top_left,rgba(243,186,47,0.22),transparent_34%),linear-gradient(135deg,#111317_0%,#171b22_54%,#202631_100%)]">
      <div className="mx-auto grid w-full max-w-7xl min-w-0 gap-8 px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="flex min-w-0 flex-col justify-center">
          <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-forge-line bg-white/5 px-3 py-1 text-sm text-slate-300">
            <span className="h-2 w-2 rounded-full bg-forge-gold" />
            Track 2: Strategy Skills
          </div>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-normal text-white sm:text-5xl">
            SignalForge BNB
          </h1>
          <p className="mt-3 max-w-2xl text-2xl font-semibold leading-8 text-slate-100">
            CMC Strategy Skill for BNB Chain Markets
          </p>
          <p className="mt-4 max-w-2xl text-xl leading-8 text-slate-200">
            Generate risk-aware, backtestable crypto trading strategies from CMC-compatible market signals.
          </p>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-400">
            SignalForge analyzes BNB Chain ecosystem market data, technical indicators, and market regime
            signals to produce a structured strategy spec for backtesting only.
          </p>
        </div>
        <div className="grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Activity, label: "Powered by CMC-compatible market data", value: "Price, volume, liquidity, technicals" },
            { icon: FileJson, label: "Backtestable strategy spec", value: "Skill-style JSON output" },
            { icon: ShieldCheck, label: "No live execution", value: "No wallet, contracts, or trade routing" },
            { icon: Download, label: "Track 2 deliverable", value: "Strategy Skill demo for BNB Chain" }
          ].map((item) => (
            <div key={item.label} className="rounded-lg border border-forge-line bg-forge-panel/82 p-4 shadow-glow">
              <item.icon className="h-5 w-5 text-forge-gold" aria-hidden="true" />
              <div className="mt-3 text-sm font-medium text-white">{item.label}</div>
              <div className="mt-1 text-sm leading-6 text-slate-400">{item.value}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
