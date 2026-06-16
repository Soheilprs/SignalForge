# SignalForge BNB

SignalForge BNB is a CMC Strategy Skill demo for BNB Chain markets. It analyzes BNB Chain ecosystem market data, technical indicators, and market regime signals to generate a structured, risk-aware, backtestable trading strategy spec.

This is not a live trading bot and does not execute trades. It is a Strategy Skill demo that ranks token signals, generates strategy rules, runs a deterministic mock backtest, and exports the result as JSON.

## Hackathon Track

Track 2 focuses on Strategy Skills: turning market data into a backtestable strategy spec instead of building a live-trading agent. SignalForge BNB turns CMC-compatible inputs into:

- Ranked token signals
- Technical indicator confirmation
- Market regime classification
- Risk-profile-aware strategy rules
- Risk controls for allocation, stop loss, take profit, and volatility
- A 30-day deterministic regime-aware backtest
- A portable Skill-style JSON strategy spec

## How It Works

1. Select a BNB Chain ecosystem token universe.
2. Choose Conservative, Balanced, or Aggressive risk.
3. The mock data provider returns CoinMarketCap-style market fields.
4. Deterministic mock history is generated per token to calculate RSI, MACD, moving averages, volatility, momentum score, and volume trend.
5. The regime detector classifies the market as Bullish, Neutral, Bearish, or High Volatility Risk-Off.
6. The scoring engine ranks tokens using technical confirmation, momentum, volume trend, volatility penalty, liquidity, and market regime.
7. The strategy generator creates a Skill-style spec with thesis, assumptions, structured rules, invalidation logic, risk controls, and backtest config.
8. The backtester simulates a stable 30-day equity curve from $10,000 with fees, slippage, rebalance logic, and USDT cash mode during risk-off regimes.
9. The export panel copies or downloads the generated strategy JSON.

## Sponsor Alignment

- **CoinMarketCap:** the data layer is shaped around CMC-style quote fields and includes a clear integration point for a future API-backed provider.
- **BNB Chain:** the default token universe focuses on the BNB ecosystem, including BNB, CAKE, TWT, XVS, ALPACA, BAKE, and USDT.
- **Trust Wallet:** TWT is included in the default ecosystem set, and the exported strategy JSON is designed to become a future review or handoff layer while keeping this MVP backtest-only.

## Setup

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

## Project Structure

```text
src/
  components/
    BacktestResults.tsx
    ExportStrategy.tsx
    Hero.tsx
    SignalTable.tsx
    StrategyBuilder.tsx
    StrategyOutput.tsx
  data/
    mockMarketData.ts
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

## Future Roadmap

- Replace the mock provider with a CoinMarketCap API provider.
- Add real historical OHLCV candles for indicator calculation.
- Add token category filters for DeFi, wallet, stablecoin, and infrastructure narratives.
- Persist saved strategies locally or to a backend.
- Add scenario analysis for volatility spikes and liquidity drops.
- Add wallet review through Trust Wallet-compatible flows while preserving explicit user approval and no autonomous execution.
- Add richer backtesting using historical OHLCV data.
