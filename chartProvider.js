/**
 * chartProvider.js
 * ---------------------------------------------------------------------
 * Wraps TradingView's embeddable widget so the rest of the app never
 * talks to TradingView directly. To swap in another charting provider
 * (Lightweight Charts + your own OHLC feed, a broker's chart widget,
 * etc.) later, only this file needs to change — the Trade Workspace
 * module just calls `ChartProvider.render(...)`.
 *
 * Requires internet access to load the TradingView embed script; when
 * offline, a graceful fallback message is shown instead of a broken
 * iframe.
 * ---------------------------------------------------------------------
 */

const TV_SCRIPT_URL = "https://s3.tradingview.com/tv.js";
let tvScriptPromise = null;

function loadTradingViewScript() {
  if (window.TradingView) return Promise.resolve();
  if (tvScriptPromise) return tvScriptPromise;
  tvScriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = TV_SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => { tvScriptPromise = null; reject(new Error("Could not load TradingView (offline?)")); };
    document.head.appendChild(script);
    // Fail fast instead of hanging forever with no network — but generous
    // enough for a slow mobile connection, not just broadband.
    setTimeout(() => { tvScriptPromise = null; reject(new Error("TradingView load timed out (offline?)")); }, 15000);
  });
  return tvScriptPromise;
}

/** Map an NSE symbol to a TradingView symbol string. */
function toTradingViewSymbol(symbol, exchange = "NSE") {
  return `${exchange}:${symbol.toUpperCase()}`;
}

/**
 * Render a full advanced chart widget into a container element.
 * @param {HTMLElement} container
 * @param {string} symbol - raw NSE/BSE symbol, e.g. "TATAELXSI"
 * @param {string} interval - TradingView interval code, e.g. "D", "W", "60"
 */
async function renderAdvancedChart(container, symbol, interval = "D") {
  container.innerHTML = `<div class="empty-state"><div class="spinner"></div><p>Loading chart…</p></div>`;
  try {
    await loadTradingViewScript();
  } catch (err) {
    container.innerHTML = "";
    const msg = el("div", { class: "empty-state" }, [
      el("div", { class: "empty-state-icon" }, "⚠"),
      el("p", {}, "Chart didn't load."),
      el("p", { class: "txt-muted", style: "font-size:11px;" }, "Needs an internet connection to TradingView. If you have internet and this persists, an ad-blocker or content blocker may be preventing it."),
    ]);
    const retryBtn = el("button", { class: "btn btn-sm mt-8" }, "Retry");
    retryBtn.addEventListener("click", () => renderAdvancedChart(container, symbol, interval));
    msg.appendChild(retryBtn);
    container.appendChild(msg);
    return;
  }

  if (!document.body.contains(container)) {
    console.warn("renderAdvancedChart: container was not attached to the document — chart cannot render. This is a bug in the calling view, not a network issue.");
    return;
  }

  container.innerHTML = "";
  const widgetDiv = document.createElement("div");
  widgetDiv.id = `tv_chart_${Date.now()}`;
  widgetDiv.style.height = "520px";
  container.appendChild(widgetDiv);

  // eslint-disable-next-line no-new
  new window.TradingView.widget({
    autosize: true,
    symbol: toTradingViewSymbol(symbol),
    interval,
    timezone: "Asia/Kolkata",
    theme: "dark",
    style: "1",
    locale: "in",
    toolbar_bg: "#10141C",
    enable_publishing: false,
    allow_symbol_change: false,
    hide_top_toolbar: false,
    hide_legend: false,
    save_image: false,
    container_id: widgetDiv.id,
  });
}

const TIMEFRAMES = [
  { label: "1D", interval: "5" },
  { label: "1H", interval: "60" },
  { label: "D", interval: "D" },
  { label: "W", interval: "W" },
  { label: "M", interval: "M" },
];

/* ---------------------------------------------------------------------- */
/* Lightweight "embed widgets" — ticker tape, technical rating, single      */
/* quote. Unlike the advanced chart above, these don't share a global      */
/* TradingView.widget constructor: each is its own self-contained script   */
/* that TradingView's CDN turns into an iframe once inserted into the DOM. */
/* Genuinely live data, free, no API key — this is the real ceiling of     */
/* "live prices" achievable without a paid data vendor or broker API.      */
/* ---------------------------------------------------------------------- */

function mountTradingViewEmbed(container, widgetFile, config, { minHeight = 60 } = {}) {
  if (!document.body.contains(container)) {
    console.warn(`mountTradingViewEmbed(${widgetFile}): container was not attached to the document — widget cannot render. This is a bug in the calling view, not a network issue.`);
    return;
  }
  container.innerHTML = "";
  const wrapper = document.createElement("div");
  wrapper.className = "tradingview-widget-container";
  wrapper.style.minHeight = `${minHeight}px`;
  const inner = document.createElement("div");
  inner.className = "tradingview-widget-container__widget";
  wrapper.appendChild(inner);
  const script = document.createElement("script");
  script.type = "text/javascript";
  script.src = `https://s3.tradingview.com/external-embedding/${widgetFile}`;
  script.async = true;
  script.text = JSON.stringify(config);
  wrapper.appendChild(script);
  container.appendChild(wrapper);

  // These widgets have no onload/onerror hook of their own (the script
  // fetches an iframe internally), so fall back to a message with a retry
  // button if nothing rendered within a generous window — mirrors the
  // advanced chart's fallback for a consistent experience.
  setTimeout(() => {
    if (!wrapper.querySelector("iframe")) {
      container.innerHTML = "";
      const msg = el("div", { class: "txt-muted", style: "font-size:11px; padding:8px 0;" }, "Live data didn't load — needs internet, or an ad-blocker may be interfering.");
      const retryBtn = el("button", { class: "btn btn-sm", style: "margin-left:8px;" }, "Retry");
      retryBtn.addEventListener("click", () => mountTradingViewEmbed(container, widgetFile, config, { minHeight }));
      container.append(msg, retryBtn);
    }
  }, 12000);
}

/** Live scrolling ticker tape for a list of {proName, title} symbols. */
function renderTickerTape(container, symbols) {
  mountTradingViewEmbed(container, "embed-widget-ticker-tape.js", {
    symbols,
    showSymbolLogo: true,
    isTransparent: true,
    displayMode: "adaptive",
    colorTheme: "dark",
    locale: "in",
  });
}

/** Live technical-rating gauge (Strong Buy → Strong Sell) for one symbol. */
function renderTechnicalAnalysisGauge(container, symbol, interval = "1D") {
  mountTradingViewEmbed(container, "embed-widget-technical-analysis.js", {
    interval,
    width: "100%",
    isTransparent: true,
    height: 200,
    symbol: toTradingViewSymbol(symbol),
    showIntervalTabs: true,
    locale: "in",
    colorTheme: "dark",
  }, { minHeight: 200 });
}

/** Live single-symbol quote (price + change), compact. */
function renderSingleQuote(container, symbol) {
  mountTradingViewEmbed(container, "embed-widget-single-quote.js", {
    symbol: toTradingViewSymbol(symbol),
    width: "100%",
    locale: "in",
    colorTheme: "dark",
    isTransparent: true,
  });
}

/** Default NSE index set used for the app-wide live ticker tape ribbon. */
const DEFAULT_INDEX_TICKER_SYMBOLS = [
  { proName: "NSE:NIFTY", title: "NIFTY 50" },
  { proName: "NSE:BANKNIFTY", title: "BANK NIFTY" },
  { proName: "BSE:SENSEX", title: "SENSEX" },
  { proName: "NSE:CNXMIDCAP", title: "NIFTY MIDCAP 100" },
  { proName: "NSE:CNXSMALLCAP", title: "NIFTY SMALLCAP 100" },
  { proName: "NSE:INDIAVIX", title: "INDIA VIX" },
];
