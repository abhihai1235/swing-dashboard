/**
 * scannerLibrary.js
 * ---------------------------------------------------------------------
 * A curated set of Chartink scanner definitions for common swing-trading
 * setups (trend continuation, breakout, VCP-style bases, etc).
 *
 * Each entry's `clause` is Chartink scanner syntax — paste it into
 * https://chartink.com/screener/new, run it, then use Chartink's
 * "Export as CSV" (or the copy icon) to bring results into this app
 * via the Scanner Import module.
 *
 * These are starting points, not guarantees of quality setups — always
 * apply the Trade Checklist before acting on any result.
 * ---------------------------------------------------------------------
 */

const SCANNER_LIBRARY = [
  {
    id: "trend-continuation",
    name: "Trend Continuation",
    category: "Trend",
    description: "Price above rising 50 & 200 SMA with recent higher low — classic Weinstein Stage 2 continuation.",
    clause:
`( {33489} ( latest close > latest sma( latest close , 50 ) and
latest sma( latest close , 50 ) > latest sma( latest close , 200 ) and
weekly sma( latest close , 50 ) > 1 week ago weekly sma( latest close , 50 ) and
latest close > 1 day ago close and
latest volume > latest sma( latest volume , 20 ) ) )`,
  },
  {
    id: "breakout",
    name: "Breakout",
    category: "Breakout",
    description: "Closing at/near a fresh 52-week or multi-month high on above-average volume.",
    clause:
`( {33489} ( latest close >= 0.98 * latest max( 250 , latest high ) and
latest volume > 1.5 * latest sma( latest volume , 20 ) and
latest close > 1 day ago close ) )`,
  },
  {
    id: "pullback",
    name: "Pullback to Support",
    category: "Trend",
    description: "Stock in an uptrend pulling back to the rising 20/50 SMA with volume drying up — potential re-entry.",
    clause:
`( {33489} ( latest close > latest sma( latest close , 200 ) and
latest close <= 1.02 * latest sma( latest close , 50 ) and
latest close >= 0.97 * latest sma( latest close , 50 ) and
latest volume < latest sma( latest volume , 20 ) ) )`,
  },
  {
    id: "darvas-consolidation",
    name: "Darvas-style Consolidation",
    category: "Base Quality",
    description: "Tight multi-week range near highs — a Darvas box forming just under the ceiling.",
    clause:
`( {33489} ( latest close >= 0.95 * latest max( 60 , latest high ) and
( latest max( 20 , latest high ) - latest min( 20 , latest low ) ) <= 0.10 * latest close ) )`,
  },
  {
    id: "stage2-candidates",
    name: "Stage-2 Candidates",
    category: "Trend",
    description: "Weinstein Stage 2: price and both key moving averages rising, well off the 52-week low.",
    clause:
`( {33489} ( latest close > latest sma( latest close , 30 ) and
latest sma( latest close , 30 ) > latest sma( latest close , 150 ) and
latest sma( latest close , 150 ) > latest sma( latest close , 200 ) and
latest close >= 1.25 * latest min( 250 , latest low ) ) )`,
  },
  {
    id: "momentum",
    name: "Momentum",
    category: "Momentum",
    description: "Strong short-term price momentum with RSI confirming strength, not yet extreme overbought.",
    clause:
`( {33489} ( latest rsi( 14 ) > 60 and latest rsi( 14 ) < 80 and
latest close > 5 days ago close * 1.08 and
latest volume > latest sma( latest volume , 20 ) ) )`,
  },
  {
    id: "high-rs",
    name: "High Relative Strength",
    category: "Relative Strength",
    description: "Outperforming the Nifty 50 over the last quarter — a proxy for institutional accumulation.",
    clause:
`( {33489} ( ( latest close / 60 days ago close ) > ( latest close of NIFTY / 60 days ago close of NIFTY ) * 1.10 ) )`,
  },
  {
    id: "tight-consolidation",
    name: "Tight Consolidation (VCP)",
    category: "Base Quality",
    description: "Volatility Contraction Pattern — shrinking daily range and shrinking volume ahead of a potential breakout.",
    clause:
`( {33489} ( ( latest max( 10 , latest high ) - latest min( 10 , latest low ) ) <
0.6 * ( latest max( 40 , latest high ) - latest min( 40 , latest low ) ) and
latest volume < latest sma( latest volume , 50 ) ) )`,
  },
  {
    id: "ipo-base",
    name: "IPO Base",
    category: "Base Quality",
    description: "Recently listed stock building its first constructive base after the initial post-IPO move.",
    clause:
`( {33489} ( latest close > latest sma( latest close , 50 ) and
latest close < 1.15 * latest min( 90 , latest low ) and
market cap > 500 ) )`,
  },
  {
    id: "failed-breakouts",
    name: "Failed Breakouts (Watchlist Only)",
    category: "Risk Flag",
    description: "Recent breakout that reversed back below the pivot — kept as a watchlist to study failure patterns, not to trade.",
    clause:
`( {33489} ( 5 days ago close >= 0.98 * 5 days ago max( 250 , high ) and
latest close < 0.95 * 5 days ago close ) )`,
  },
  {
    id: "breakdown",
    name: "Breakdown",
    category: "Short — Breakdown",
    description: "Closing at/near a fresh multi-month low on above-average volume — the bearish mirror of Breakout.",
    clause:
`( {33489} ( latest close <= 1.02 * latest min( 250 , latest low ) and
latest volume > 1.5 * latest sma( latest volume , 20 ) and
latest close < 1 day ago close ) )`,
  },
  {
    id: "distribution-topping",
    name: "Distribution / Topping",
    category: "Short — Breakdown",
    description: "Stock stalling below its 50/200 SMA structure with heavy down-volume — early signs of institutional selling into strength.",
    clause:
`( {33489} ( latest close < latest sma( latest close , 50 ) and
latest sma( latest close , 50 ) < 5 days ago sma( latest close , 50 ) and
latest volume > 1.3 * latest sma( latest volume , 20 ) and
latest close < 1 day ago close ) )`,
  },
  {
    id: "relative-weakness",
    name: "Relative Weakness",
    category: "Short — Trend",
    description: "Underperforming the Nifty 50 over the last quarter — the bearish mirror of High Relative Strength.",
    clause:
`( {33489} ( ( latest close / 60 days ago close ) < ( latest close of NIFTY / 60 days ago close of NIFTY ) * 0.92 ) )`,
  },
  {
    id: "downtrend-continuation",
    name: "Downtrend Continuation",
    category: "Short — Trend",
    description: "Weinstein Stage 4: price and both key moving averages falling, well off the 52-week high — the bearish mirror of Stage-2 Candidates.",
    clause:
`( {33489} ( latest close < latest sma( latest close , 30 ) and
latest sma( latest close , 30 ) < latest sma( latest close , 150 ) and
latest sma( latest close , 150 ) < latest sma( latest close , 200 ) and
latest close <= 0.80 * latest max( 250 , latest high ) ) )`,
  },
  {
    id: "bearish-rally-failure",
    name: "Bearish Rally Failure",
    category: "Short — Setup",
    description: "A relief rally into declining resistance (the falling 20/50 SMA) that stalls — a lower-risk entry to short into an existing downtrend, mirroring the long Pullback setup.",
    clause:
`( {33489} ( latest close < latest sma( latest close , 200 ) and
latest sma( latest close , 50 ) < 5 days ago sma( latest close , 50 ) and
latest close >= 0.98 * latest sma( latest close , 50 ) and
latest close <= 1.02 * latest sma( latest close , 50 ) and
latest volume < latest sma( latest volume , 20 ) ) )`,
  },

  /* ---- ChartsMaze-inspired additions ---- */
  {
    id: "horizontal-resistance",
    name: "Horizontal Resistance",
    category: "Breakout",
    description: "Pressing against a well-tested horizontal ceiling (multiple touches, contained range below it) — a classic pre-breakout setup.",
    clause:
`( {33489} ( latest high >= 0.97 * latest max( 40 , latest high ) and
latest close < latest max( 40 , latest high ) and
( latest max( 40 , latest high ) - latest min( 40 , latest low ) ) < 0.25 * latest max( 40 , latest high ) ) )`,
  },
  {
    id: "tight-setup-daily",
    name: "Tight Setup (Daily)",
    category: "Base Quality",
    description: "Under 6% high-low range over the last 10 sessions, above the rising 50 SMA — a very tight, coiled setup.",
    clause:
`( {33489} ( ( latest max( 10 , latest high ) - latest min( 10 , latest low ) ) < 0.06 * latest close and
latest close > latest sma( latest close , 50 ) ) )`,
  },
  {
    id: "rs-high-before-price-high",
    name: "RS High Before Price High",
    category: "Relative Strength",
    description: "Relative strength vs Nifty is already elite while price hasn't broken to a new high yet — RS often leads price (Zanger/O'Neil concept).",
    clause:
`( {33489} ( ( latest close / 60 days ago close ) > ( latest close of NIFTY / 60 days ago close of NIFTY ) * 1.15 and
latest close < 0.97 * latest max( 250 , latest high ) ) )`,
  },
  {
    id: "volume-gainers",
    name: "Volume Gainers",
    category: "Volume",
    description: "Trading at more than 2x its 20-day average volume today.",
    clause: `( {33489} ( latest volume > 2 * latest sma( latest volume , 20 ) ) )`,
  },
  {
    id: "high-volume-stocks",
    name: "High Volume Stocks",
    category: "Volume",
    description: "Exceptionally heavy volume (3x+ the 20-day average) with meaningful liquidity, not a thinly-traded spike.",
    clause: `( {33489} ( latest volume > 3 * latest sma( latest volume , 20 ) and latest sma( latest volume , 20 ) > 50000 ) )`,
  },
  {
    id: "volume-footprint",
    name: "Volume Footprint",
    category: "Volume",
    description: "Unusually heavy volume absorbed into a narrow daily range — a footprint of concentrated accumulation or distribution.",
    clause:
`( {33489} ( latest volume > 2 * latest sma( latest volume , 20 ) and
( latest high - latest low ) < 0.03 * latest close ) )`,
  },
  {
    id: "flags-pennants",
    name: "Flags & Pennants",
    category: "Base Quality",
    description: "A sharp prior move (flagpole) followed by a tight multi-day consolidation (the flag) — classic continuation pattern.",
    clause:
`( {33489} ( ( latest max( 20 , latest high ) - latest min( 20 , latest low ) ) > 0.15 * latest min( 20 , latest low ) and
( latest max( 5 , latest high ) - latest min( 5 , latest low ) ) < 0.05 * latest close ) )`,
  },
  {
    id: "gap-up",
    name: "Gap Up",
    category: "Gap",
    description: "Opened at least 2% above the previous close.",
    clause: `( {33489} ( latest open >= 1.02 * latest close 1 day ago ) )`,
  },
  {
    id: "gap-filling",
    name: "Gap Filling",
    category: "Gap",
    description: "Price retracing back down toward a recent gap zone after an earlier gap up — often a lower-risk re-entry or a warning the gap wasn't sustained.",
    clause:
`( {33489} ( latest close < latest close 1 day ago and
latest close > 0.97 * latest min( 5 , latest low ) ) )`,
  },
  {
    id: "inside-bar-daily",
    name: "Inside Bar (Daily)",
    category: "Base Quality",
    description: "Today's entire high-low range sits inside yesterday's range — a classic one-day consolidation/indecision candle.",
    clause: `( {33489} ( latest high <= 1 day ago high and latest low >= 1 day ago low ) )`,
  },
  {
    id: "shakeout-200ema",
    name: "Shakeout (200 EMA)",
    category: "Trend",
    description: "Intraday undercut of the rising 200 EMA that closed back above it — a stop-hunt/washout that resolved back in the trend's favor.",
    clause: `( {33489} ( latest low < latest ema( latest close , 200 ) and latest close > latest ema( latest close , 200 ) and latest ema( latest close , 200 ) >= 3 days ago ema( latest close , 200 ) ) )`,
  },
  {
    id: "shakeout-50ema",
    name: "Shakeout (50 EMA)",
    category: "Trend",
    description: "Same shakeout concept anchored to the 50 EMA — a shorter-horizon washout-and-recovery.",
    clause: `( {33489} ( latest low < latest ema( latest close , 50 ) and latest close > latest ema( latest close , 50 ) and latest ema( latest close , 50 ) >= 3 days ago ema( latest close , 50 ) ) )`,
  },
  {
    id: "shakeout-21ema",
    name: "Shakeout (21 EMA)",
    category: "Trend",
    description: "Shakeout anchored to the 21 EMA — for faster-moving swing setups.",
    clause: `( {33489} ( latest low < latest ema( latest close , 21 ) and latest close > latest ema( latest close , 21 ) and latest ema( latest close , 21 ) >= 3 days ago ema( latest close , 21 ) ) )`,
  },
  {
    id: "shakeout-10ema",
    name: "Shakeout (10 EMA)",
    category: "Trend",
    description: "Shakeout anchored to the 10 EMA — the fastest, most short-term variant.",
    clause: `( {33489} ( latest low < latest ema( latest close , 10 ) and latest close > latest ema( latest close , 10 ) and latest ema( latest close , 10 ) >= 3 days ago ema( latest close , 10 ) ) )`,
  },
  {
    id: "shorting-scanner",
    name: "Shorting Scanner",
    category: "Short — Setup",
    description: "A stricter composite short — requires multiple bearish conditions (trend, relative weakness, momentum, volume) at once for higher conviction than any single short scanner alone.",
    clause:
`( {33489} ( latest close < latest sma( latest close , 50 ) and
latest sma( latest close , 50 ) < latest sma( latest close , 200 ) and
latest rsi( 14 ) < 45 and
latest close < 1 day ago close and
latest volume > 1.2 * latest sma( latest volume , 20 ) ) )`,
  },
];

/** Look up a scanner definition by id. */
function getScannerById(id) {
  return SCANNER_LIBRARY.find((s) => s.id === id) || null;
}
