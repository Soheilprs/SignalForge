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
- Uses deterministic CMC-compatible demo market data
- Generates seeded mock historical prices for indicator calculation
- Calculates RSI, MACD, moving averages, volatility, momentum, and volume trend
- Detects market regime: Bullish, Neutral, Bearish, or High Volatility Risk-Off
- Scores and ranks tokens with indicator and regime reasoning
- Generates a Strategy Skill spec with thesis, assumptions, rules, controls, and backtest config
- Runs a deterministic 30-day backtest from $10,000
- Exports the full strategy spec as JSON

## How It Works

1. The user selects tokens and a risk profile.
2. The market data provider returns CMC-compatible market fields.
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
- `backtest`

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

Optional future CMC integration:

```bash
VITE_CMC_API_KEY=your_coinmarketcap_api_key
```

The integration-ready provider lives in `src/data/providers/cmcProvider.ts`. It maps CoinMarketCap quote fields into the app's `MarketData` type and explains where volatility and liquidity normalization should be added for production use.

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
```

## Current Limitations

- Market data is deterministic mock data by default.
- Historical prices are seeded mock series, not real OHLCV candles.
- CoinMarketCap API mode is integration-ready but not wired into a visible UI switch.
- Backtesting is simplified and intended for demo stability, not financial accuracy.
- This is not financial advice.

## Future Improvements

- Add a visible data-mode switch for mock vs. CMC API data.
- Add real CMC quote and historical OHLCV ingestion.
- Improve volatility and liquidity scoring from real market depth and historical data.
- Add saved strategy comparison.
- Add more backtest diagnostics such as exposure, turnover, and regime attribution.
- Add a Trust Wallet review flow while keeping execution strictly user-controlled.
