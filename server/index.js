import "dotenv/config";
import express from "express";

const app = express();
app.disable("x-powered-by");
const HOST = process.env.HOST ?? "127.0.0.1";
const PORT = Number(process.env.PORT ?? 8787);
const CMC_QUOTES_URL = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest";
const ALLOWED_SYMBOLS = new Set(["BNB", "CAKE", "TWT", "XVS", "ALPACA", "BAKE", "USDT"]);

function parseSymbols(value) {
  if (!value || typeof value !== "string") {
    return [];
  }

  return [...new Set(value.split(",").map((symbol) => symbol.trim().toUpperCase()).filter(Boolean))];
}

function deriveVolatility(quote) {
  const change1h = Math.abs(quote.percent_change_1h ?? 0);
  const change24h = Math.abs(quote.percent_change_24h ?? 0);
  const change7d = Math.abs(quote.percent_change_7d ?? 0);

  return Number(Math.min(0.98, Math.max(0.02, (change1h * 4 + change24h + change7d / 3) / 100)).toFixed(3));
}

function deriveLiquidityScore(quote) {
  const volume = quote.volume_24h ?? 0;
  const marketCap = quote.market_cap ?? 0;
  const ratio = marketCap > 0 ? volume / marketCap : 0;

  return Math.round(Math.min(98, Math.max(10, ratio * 1200)));
}

function mapCmcAsset(symbol, asset) {
  const quote = asset.quote?.USD ?? {};

  return {
    symbol,
    name: asset.name ?? symbol,
    price: quote.price ?? 0,
    marketCap: quote.market_cap ?? 0,
    volume24h: quote.volume_24h ?? 0,
    percentChange1h: quote.percent_change_1h ?? 0,
    percentChange24h: quote.percent_change_24h ?? 0,
    percentChange7d: quote.percent_change_7d ?? 0,
    // Latest quotes do not include the MVP's exact volatility/liquidity fields.
    // These are derived here so the frontend MarketData type stays stable.
    volatility: deriveVolatility(quote),
    liquidityScore: deriveLiquidityScore(quote)
  };
}

app.get("/api/health", (_request, response) => {
  response.json({ ok: true });
});

app.get("/api/cmc/quotes", async (request, response) => {
  const requestedSymbols = parseSymbols(request.query.symbols);

  if (requestedSymbols.length === 0) {
    response.status(400).json({ error: "Provide at least one symbol." });
    return;
  }

  const invalidSymbols = requestedSymbols.filter((symbol) => !ALLOWED_SYMBOLS.has(symbol));

  if (invalidSymbols.length > 0) {
    response.status(400).json({
      error: `Unsupported symbol(s): ${invalidSymbols.join(", ")}. Supported symbols: ${[...ALLOWED_SYMBOLS].join(", ")}.`
    });
    return;
  }

  if (!process.env.CMC_API_KEY) {
    response.status(503).json({
      error: "CMC_API_KEY is not configured on the server. Live CMC data unavailable."
    });
    return;
  }

  try {
    const url = new URL(CMC_QUOTES_URL);
    url.searchParams.set("symbol", requestedSymbols.join(","));
    url.searchParams.set("convert", "USD");

    const cmcResponse = await fetch(url, {
      headers: {
        "X-CMC_PRO_API_KEY": process.env.CMC_API_KEY
      }
    });

    if (!cmcResponse.ok) {
      console.error("CMC quotes request failed", cmcResponse.status);
      response.status(502).json({ error: `CoinMarketCap request failed with ${cmcResponse.status}.` });
      return;
    }

    const payload = await cmcResponse.json();
    const data = requestedSymbols
      .map((symbol) => {
        const asset = payload.data?.[symbol];
        return asset ? mapCmcAsset(symbol, asset) : null;
      })
      .filter(Boolean);

    response.json({
      mode: "live-cmc",
      latestQuotes: "CoinMarketCap latest quotes",
      data
    });
  } catch (error) {
    console.error("CMC proxy error", error);
    response.status(502).json({ error: "Live CMC data unavailable. Try deterministic demo data." });
  }
});

app.listen(PORT, HOST, () => {
  console.log(`SignalForge API server listening on http://${HOST}:${PORT}`);
});
