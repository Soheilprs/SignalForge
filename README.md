# SignalForge BNB

## One-liner

SignalForge BNB is a CMC Strategy Skill demo that converts BNB Chain ecosystem market signals into a structured, risk-aware, backtestable JSON strategy spec.

## Hackathon Track

This project targets **Track 2: Strategy Skills**. The deliverable is a backtestable strategy specification, not a live-trading agent.

SignalForge BNB focuses on:

- Turning CMC-compatible market data into a trading strategy
- Producing explicit entry, exit, invalidation, and risk rules
- Running a deterministic mock backtest
- Exporting the strategy as JSON for review or future integration

## Why It Matters

Crypto strategy ideas are often presented as loose narratives. SignalForge BNB turns those narratives into a repeatable, inspectable strategy artifact with market regime context, technical confirmation, risk controls, and backtest assumptions.

For hackathon judges, the app makes the Track 2 output visible: a generated Strategy Skill spec that can be copied, downloaded, and evaluated.

## What It Does

- Selects a BNB Chain ecosystem token universe
- Uses deterministic CMC-compatible demo market data or live CoinMarketCap latest quotes
- Generates seeded mock historical prices for indicator calculation
- Calculates RSI, MACD, moving averages, volatility, momentum, and volume trend
- Detects market regime: Bullish, Neutral, Bearish, or High Volatility Risk-Off
- Scores and ranks tokens with indicator and regime reasoning
- Generates a Strategy Skill spec with thesis, assumptions, rules, controls, and backtest config
- Runs a deterministic 30-day backtest from $10,000
- Exports the full strategy spec as JSON

## How It Works

1. The user selects tokens and a risk profile.
2. The market data provider returns CMC-compatible market fields from demo data or `/api/cmc/quotes`.
3. The indicator engine derives technical indicators from deterministic mock history.
4. The regime detector classifies the selected market universe.
5. The scoring engine ranks tokens using RSI, MACD, momentum, volume trend, volatility, liquidity, and regime adjustment.
6. The strategy generator creates a Skill-style strategy spec.
7. The backtester simulates the strategy with fees, slippage, and USDT cash mode during risk-off regimes.
8. The export panel copies or downloads the generated JSON strategy spec.

## CMC Skill Output

The exported JSON includes:

- `skillName`
- `version`
- `strategyName`
- `strategyType`
- `authoringModel`
- `dataSource`
- `universe`
- `marketRegime`
- `strategyThesis`
- `marketAssumptions`
- `entryRules`
- `exitRules`
- `invalidationRules`
- `riskControls`
- `backtestConfig`
- `executionMode`
- `disclaimer`
- `signalRanking`
- `dataProvenance`
- `backtest`

Shortened example:

```json
{
  "skillName": "SignalForge BNB Regime-Aware Momentum Skill",
  "strategyType": "Momentum + Regime Detection",
  "dataProvenance": {
    "marketDataMode": "live-cmc",
    "latestQuotes": "CoinMarketCap latest quotes",
    "historicalSeries": "deterministic generated history",
    "backtestData": "deterministic MVP simulation"
  },
  "marketRegime": {
    "regime": "Bullish",
    "confidence": 0.78
  },
  "entryRules": [
    {
      "id": "ENTRY_001",
      "rule": "Enter the highest-ranked token when SignalForge score is above threshold.",
      "rationale": "Strong momentum with technical confirmation."
    }
  ],
  "riskControls": {
    "riskProfile": "Balanced",
    "maxAllocationPerToken": "30%",
    "stopLoss": "6%",
    "takeProfit": "12%",
    "cashAsset": "USDT"
  },
  "executionMode": "Backtest-only / no live execution"
}
```

## Data Sources

SignalForge BNB has two frontend data modes:

- **Demo Data:** deterministic CMC-compatible mock latest quote data. This is the default and works without API keys.
- **Live CMC Quotes:** the frontend calls the app's own `/api/cmc/quotes` endpoint. The backend then calls CoinMarketCap latest quotes with the server-side `CMC_API_KEY`.

Live CMC mode updates current market fields:

- price
- market cap
- 24h volume
- 1h percent change
- 24h percent change
- 7d percent change

The MVP still uses deterministic generated history for RSI, MACD, moving averages, synthetic historical series, and backtesting. This keeps the demo stable while allowing latest quote data to be live.

## Sponsor Alignment

- **CoinMarketCap:** the app uses a CMC-compatible market data shape and now includes a provider architecture for future real CMC API integration.
- **BNB Chain:** the default token universe focuses on BNB ecosystem assets: BNB, CAKE, TWT, XVS, ALPACA, BAKE, and USDT.
- **Trust Wallet:** TWT is included, and the JSON strategy spec could become a future review or handoff artifact while preserving explicit user control.

## No Live Trading

SignalForge BNB does **not** execute trades. It has no wallet connection, no smart contracts, no order routing, and no autonomous trading logic.

Execution mode is explicitly:

```text
Backtest-only / no live execution
```

## Tech Stack

- Vite
- React
- TypeScript
- Tailwind CSS
- Recharts
- Lucide React
- Express
- Vitest

## Local Setup

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
```

Quality checks:

```bash
npm run typecheck
npm run test
```

## Environment Variables

The current MVP uses deterministic CMC-compatible mock data by default.

Live CMC latest quotes use a server-side environment variable:

```bash
CMC_API_KEY=your_coinmarketcap_api_key
```

## Running With Live CMC Quotes

Demo mode only:

```bash
npm run dev
```

Live CMC quote mode:

```bash
CMC_API_KEY=your_coinmarketcap_api_key npm run server
npm run dev
```

Or run both in one terminal:

```bash
CMC_API_KEY=your_coinmarketcap_api_key npm run dev:full
```

Then open the app and choose **Live CMC Quotes** in the Data Source control.

Without `CMC_API_KEY`, the server returns a clean error and the frontend falls back to deterministic demo data.

## Demo Flow

1. Open the app and show Track 2 / CMC-compatible / backtest-only badges.
2. Select Demo Data or Live CMC Quotes.
3. Choose BNB ecosystem tokens and a risk profile.
4. Show Skill Output Summary as the main Track 2 deliverable.
5. Show Market Regime and Fear & Greed-style score.
6. Show indicator-aware token ranking with RSI, MACD, volume trend, score, and reasons.
7. Show generated strategy thesis, entry rules, exit rules, invalidation rules, and risk controls.
8. Show deterministic MVP backtest results and equity curve.
9. Copy or download the exported JSON strategy spec.

## Screenshots

Add screenshots to the `assets/` folder before final submission:

- Hero and Strategy Builder: `assets/hero-builder.png`
- Skill Output Summary: `assets/skill-output-summary.png`
- Market Regime and Signal Table: `assets/regime-signal-table.png`
- Backtest Results: `assets/backtest-results.png`
- Exported JSON Strategy Spec: `assets/exported-json.png`

## DoraHacks Submission Summary

SignalForge BNB is a CMC-compatible Strategy Skill for BNB Chain markets. It transforms live or deterministic CMC-style market data into a structured, risk-aware, backtestable trading strategy spec.

The app analyzes BNB ecosystem tokens using latest quote fields, RSI, MACD, moving averages, momentum, volatility, liquidity, volume trends, and market regime detection. It then generates an LLM-style Strategy Skill output with a thesis, assumptions, entry rules, exit rules, invalidation rules, risk controls, and backtest configuration.

SignalForge BNB does not execute trades, connect wallets, or route orders. It is designed for Track 2: Strategy Skills, where the deliverable is an exportable strategy spec rather than a live trading agent.

The MVP supports live CoinMarketCap latest quotes through a server-side proxy while keeping deterministic generated history for repeatable indicator and backtest demos. The exported JSON includes data provenance so users can see exactly what is live and what is simulated.

## Deployment Notes

- Mock/demo mode can run as frontend-only.
- Live CMC mode needs the Express API server deployed with `CMC_API_KEY`.
- The CMC key must stay server-side and should never be exposed as a Vite frontend environment variable.
- Production must route `/api/cmc/quotes` to the backend.
- Recommended simple deployment:
  - Frontend: Vercel or Netlify
  - Backend: Railway, Render, or a single full-stack Render/Railway deployment

## Project Structure

```text
src/
  components/
    BacktestResults.tsx
    EmptyState.tsx
    ErrorBoundary.tsx
    ExportStrategy.tsx
    Hero.tsx
    MarketRegimePanel.tsx
    SignalTable.tsx
    SkillOutputSummary.tsx
    StrategyBuilder.tsx
    StrategyOutput.tsx
  data/
    mockMarketData.ts
    providers/
      cmcProvider.ts
      index.ts
      marketDataProvider.ts
      mockProvider.ts
  lib/
    backtester.ts
    indicators.ts
    regimeDetector.ts
    scoring.ts
    strategyGenerator.ts
    utils.ts
  App.tsx
  index.css
  main.tsx
  types.ts
server/
  index.js
assets/
  .gitkeep
```

## Current Limitations

- Market data is deterministic mock data by default.
- Historical prices are seeded mock series, not real OHLCV candles.
- Live CMC mode uses latest quotes only; historical indicators and backtest data remain deterministic in the MVP.
- Backtesting is simplified and intended for demo stability, not financial accuracy.
- This is not financial advice.

## Future Improvements

- Add real CMC historical OHLCV ingestion.
- Improve volatility and liquidity scoring from real market depth and historical data.
- Add saved strategy comparison.
- Add more backtest diagnostics such as exposure, turnover, and regime attribution.
- Add a Trust Wallet review flow while keeping execution strictly user-controlled.
