use crate::{
    errors::MarketDataError,
    provider::{MarketDataProvider, ProviderCapabilities, RateLimit},
    AssetProfile, Coverage, InstrumentKind, ProviderInstrument, Quote, QuoteContext, SearchResult,
    SplitEvent,
};
use async_trait::async_trait;
use chrono::{DateTime, Utc};
use std::time::Duration;

pub struct FinectProvider {}

impl FinectProvider {
    pub fn new(api_key: String) -> Self {
        Self {}
    }
}

#[async_trait]
impl MarketDataProvider for FinectProvider {
    /// Unique identifier for this provider.
    ///
    /// Should be a constant string like "YAHOO", "ALPHA_VANTAGE", etc.
    /// Used for logging, circuit breaker tracking, and resolution.
    fn id(&self) -> &'static str {
        "FINECT"
    }

    /// Provider priority for ordering.
    ///
    /// Lower values = higher priority. Default is 10.
    /// The registry uses this to order providers when multiple
    /// can handle the same asset type.
    fn priority(&self) -> u8 {
        9
    }

    /// Describes what this provider can do.
    ///
    /// Returns the asset kinds supported, whether historical data
    /// is available, and whether search is supported.
    fn capabilities(&self) -> ProviderCapabilities {
        ProviderCapabilities {
            instrument_kinds: &[InstrumentKind::Equity, InstrumentKind::Bond],
            coverage: Coverage::global_best_effort(),
            supports_latest: true,
            supports_historical: true,
            supports_search: true,
            supports_profile: false,
        }
    }

    /// Rate limiting configuration.
    ///
    /// Returns the rate limits that should be applied when
    /// calling this provider.
    fn rate_limit(&self) -> RateLimit {
        RateLimit {
            requests_per_minute: 25,
            max_concurrency: 1,
            min_delay: Duration::from_millis(500),
        }
    }

    /// Fetch the latest quote for an instrument.
    ///
    /// # Arguments
    ///
    /// * `context` - The quote context containing the canonical instrument and overrides
    /// * `instrument` - The provider-specific instrument parameters (already resolved)
    ///
    /// # Returns
    ///
    /// The latest quote on success, or a `MarketDataError` on failure.
    async fn get_latest_quote(
        &self,
        _context: &QuoteContext,
        _instrument: ProviderInstrument,
    ) -> Result<Quote, MarketDataError> {
        todo!()
    }

    /// Fetch historical quotes for an instrument.
    ///
    /// # Arguments
    ///
    /// * `context` - The quote context containing the canonical instrument and overrides
    /// * `instrument` - The provider-specific instrument parameters (already resolved)
    /// * `start` - Start of the date range (inclusive)
    /// * `end` - End of the date range (inclusive)
    ///
    /// # Returns
    ///
    /// A vector of quotes for the date range, or a `MarketDataError` on failure.
    /// The quotes should be ordered by timestamp ascending.
    async fn get_historical_quotes(
        &self,
        _context: &QuoteContext,
        _instrument: ProviderInstrument,
        _start: DateTime<Utc>,
        _end: DateTime<Utc>,
    ) -> Result<Vec<Quote>, MarketDataError> {
        todo!()
    }

    /// Search for symbols matching the query.
    ///
    /// # Arguments
    ///
    /// * `query` - The search query (e.g., "AAPL", "Apple")
    ///
    /// # Returns
    ///
    /// A vector of search results, or an error if search is not supported.
    /// Default implementation returns `NotSupported`.
    async fn search(&self, _query: &str) -> Result<Vec<SearchResult>, MarketDataError> {
        todo!()
    }

    /// Fetch asset profile information.
    ///
    /// # Arguments
    ///
    /// * `symbol` - The symbol to fetch profile for
    ///
    /// # Returns
    ///
    /// The asset profile, or an error if profile is not supported.
    /// Default implementation returns `NotSupported`.
    async fn get_profile(&self, _symbol: &str) -> Result<AssetProfile, MarketDataError> {
        todo!()
    }

    /// Fetch split history for an instrument.
    ///
    /// # Returns
    ///
    /// A vector of split events, or `NotSupported` if the provider doesn't support splits.
    /// Default implementation returns `NotSupported`.
    async fn get_splits(
        &self,
        _context: &QuoteContext,
        _instrument: ProviderInstrument,
        _start: DateTime<Utc>,
        _end: DateTime<Utc>,
    ) -> Result<Vec<SplitEvent>, MarketDataError> {
        todo!()
    }
}
