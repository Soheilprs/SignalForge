import { MarketData, TokenSymbol } from "../../types";
import { MarketDataProvider } from "./marketDataProvider";

interface CmcQuoteResponse {
  data?: Record<
    string,
    {
      name?: string;
      symbol?: string;
      quote?: {
        USD?: {
          price?: number;
          market_cap?: number;
          volume_24h?: number;
          percent_change_1h?: number;
          percent_change_24h?: number;
          percent_change_7d?: number;
        };
      };
    }
  >;
}

function getCmcApiKey(): string | undefined {
  return import.meta.env.VITE_CMC_API_KEY;
}

function mapCmcAsset(symbol: TokenSymbol, asset: NonNullable<CmcQuoteResponse["data"]>[string]): MarketData {
  const quote = asset.quote?.USD;

  return {
    symbol,
    name: asset.name ?? symbol,
    price: quote?.price ?? 0,
    marketCap: quote?.market_cap ?? 0,
    volume24h: quote?.volume_24h ?? 0,
    percentChange1h: quote?.percent_change_1h ?? 0,
    percentChange24h: quote?.percent_change_24h ?? 0,
    percentChange7d: quote?.percent_change_7d ?? 0,
    // CoinMarketCap's latest quote endpoint does not directly provide this MVP's
    // volatility/liquidityScore fields. A production integration should map these
    // from historical OHLCV dispersion and liquidity/depth metrics, or compute them
    // in a normalization layer before returning MarketData.
    volatility: 0.35,
    liquidityScore: Math.min(100, Math.max(0, Math.round((quote?.volume_24h ?? 0) / Math.max(1, quote?.market_cap ?? 1) * 1000)))
  };
}

export const cmcMarketDataProvider: MarketDataProvider = {
  id: "cmc",
  label: "CoinMarketCap API data",
  async getMarketData(selectedSymbols) {
    const apiKey = getCmcApiKey();

    if (!apiKey) {
      throw new Error("VITE_CMC_API_KEY is not configured. Use mock mode or add a CoinMarketCap API key.");
    }

    const symbols = selectedSymbols.join(",");
    const response = await fetch(
      `https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?symbol=${encodeURIComponent(symbols)}&convert=USD`,
      {
        headers: {
          "X-CMC_PRO_API_KEY": apiKey
        }
      }
    );

    if (!response.ok) {
      throw new Error(`CoinMarketCap request failed with ${response.status}`);
    }

    const payload = (await response.json()) as CmcQuoteResponse;

    return selectedSymbols
      .map((symbol) => {
        const asset = payload.data?.[symbol];
        return asset ? mapCmcAsset(symbol, asset) : null;
      })
      .filter((asset): asset is MarketData => asset !== null);
  }
};
