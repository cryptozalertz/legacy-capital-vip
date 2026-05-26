// Legacy Capital VIP - Real-time Data Fetcher
// Fetches live crypto data from free APIs

class RealtimeData {
    constructor() {
        this.btcPrice = 0;
        this.ethPrice = 0;
        this.solPrice = 0;
        this.fearGreed = 50;
        this.marketCap = 0;
        this.updateInterval = 30000; // 30 seconds
        this.init();
    }

    init() {
        this.fetchAllData();
        // Update every 30 seconds
        setInterval(() => this.fetchAllData(), this.updateInterval);
    }

    async fetchAllData() {
        await Promise.all([
            this.fetchPrices(),
            this.fetchFearGreed(),
            this.fetchMarketData()
        ]);
        this.updateUI();
    }

    async fetchPrices() {
        try {
            const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd&include_24hr_change=true');
            const data = await response.json();
            
            this.btcPrice = data.bitcoin.usd;
            this.ethPrice = data.ethereum.usd;
            this.solPrice = data.solana.usd;
            this.btcChange = data.bitcoin.usd_24h_change;
            this.ethChange = data.ethereum.usd_24h_change;
            this.solChange = data.solana.usd_24h_change;
            
            // Update BTC price
            const btcElement = document.getElementById('btc-price');
            if (btcElement) {
                btcElement.textContent = '$' + this.btcPrice.toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0});
                btcElement.style.color = this.btcChange >= 0 ? '#f3f3f3' : '#ff4444';
            }
            
            // Update ETH price
            const ethElement = document.getElementById('eth-price');
            if (ethElement) {
                ethElement.textContent = '$' + this.ethPrice.toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0});
                ethElement.style.color = this.ethChange >= 0 ? '#f3f3f3' : '#ff4444';
            }
            
            // Update SOL price
            const solElement = document.getElementById('sol-price');
            if (solElement) {
                solElement.textContent = '$' + this.solPrice.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
                solElement.style.color = this.solChange >= 0 ? '#f3f3f3' : '#ff4444';
            }
            
            console.log('Prices updated:', { btc: this.btcPrice, eth: this.ethPrice, sol: this.solPrice });
        } catch (error) {
            console.error('Error fetching prices:', error);
        }
    }

    async fetchFearGreed() {
        try {
            const response = await fetch('https://api.alternative.me/fng/?limit=1');
            const data = await response.json();
            
            if (data.data && data.data[0]) {
                this.fearGreed = parseInt(data.data[0].value);
                
                const fgElement = document.getElementById('fear-greed');
                if (fgElement) {
                    fgElement.textContent = this.fearGreed;
                }
                
                console.log('Fear & Greed updated:', this.fearGreed);
            }
        } catch (error) {
            console.error('Error fetching fear & greed:', error);
            // Fallback value
            this.fearGreed = 50;
            const fgElement = document.getElementById('fear-greed');
            if (fgElement) {
                fgElement.textContent = '50';
            }
        }
    }

    async fetchMarketData() {
        try {
            const response = await fetch('https://api.coingecko.com/api/v3/global');
            const data = await response.json();
            
            if (data.data) {
                this.marketCap = data.data.total_market_cap.usd;
                const marketChange = data.data.market_cap_change_percentage_24h_usd;
                
                // Update market cap in hero stats
                const marketCapElement = document.getElementById('market-cap');
                if (marketCapElement) {
                    const trillions = (this.marketCap / 1e12).toFixed(2);
                    marketCapElement.textContent = `$${trillions}T`;
                }
                
                // Update market cap in explore card
                const marketCapStatElement = document.getElementById('market-cap-stat');
                if (marketCapStatElement) {
                    const trillions = (this.marketCap / 1e12).toFixed(2);
                    marketCapStatElement.textContent = `$${trillions}T Market Cap`;
                }
                
                const marketChangeElement = document.getElementById('market-change-stat');
                if (marketChangeElement && marketChange !== undefined) {
                    const sign = marketChange >= 0 ? '+' : '';
                    marketChangeElement.textContent = `${sign}${marketChange.toFixed(1)}% 24h`;
                    marketChangeElement.className = marketChange >= 0 ? 'stat positive' : 'stat negative';
                }
                
                console.log('Market cap updated:', this.marketCap, 'Change:', marketChange);
            }
        } catch (error) {
            console.error('Error fetching market data:', error);
        }
    }

    updateUI() {
        // Update signal cards with real prices
        this.updateSignalCards();
        
        // Update portfolio table
        this.updatePortfolio();
        
        // Update sentiment gauge
        this.updateSentimentGauge();
        
        // Update technical levels
        this.updateTechnicalLevels();
        
        // Update sentiment label
        this.updateSentimentLabel();
    }
    
    updateSentimentLabel() {
        const sentimentElement = document.getElementById('sentiment');
        if (sentimentElement) {
            let label = 'Neutral';
            if (this.fearGreed <= 20) label = 'Extreme Fear';
            else if (this.fearGreed <= 40) label = 'Fear';
            else if (this.fearGreed <= 60) label = 'Neutral';
            else if (this.fearGreed <= 80) label = 'Greed';
            else label = 'Extreme Greed';
            
            sentimentElement.textContent = label;
        }
    }
    
    updateTechnicalLevels() {
        if (this.btcPrice > 0) {
            const btcResistance = document.getElementById('btc-resistance');
            const btcSupport = document.getElementById('btc-support');
            
            if (btcResistance) {
                const resistance = (this.btcPrice * 1.05).toFixed(0);
                btcResistance.textContent = `$${parseInt(resistance).toLocaleString()}`;
            }
            if (btcSupport) {
                const support = (this.btcPrice * 0.95).toFixed(0);
                btcSupport.textContent = `$${parseInt(support).toLocaleString()}`;
            }
        }
        
        if (this.ethPrice > 0) {
            const ethResistance = document.getElementById('eth-resistance');
            const ethSupport = document.getElementById('eth-support');
            
            if (ethResistance) {
                const resistance = (this.ethPrice * 1.05).toFixed(0);
                ethResistance.textContent = `$${parseInt(resistance).toLocaleString()}`;
            }
            if (ethSupport) {
                const support = (this.ethPrice * 0.95).toFixed(0);
                ethSupport.textContent = `$${parseInt(support).toLocaleString()}`;
            }
        }
    }

    updateSignalCards() {
        // Update BTC signal
        const btcSignal = document.querySelector('.signal-card:nth-child(1) .signal-price');
        if (btcSignal && this.btcPrice > 0) {
            btcSignal.textContent = `Entry: $${this.btcPrice.toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0})}`;
        }
        
        // Update ETH signal
        const ethSignal = document.querySelector('.signal-card:nth-child(2) .signal-price');
        if (ethSignal && this.ethPrice > 0) {
            ethSignal.textContent = `Entry: $${this.ethPrice.toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0})}`;
        }
        
        // Update SOL signal
        const solSignal = document.querySelector('.signal-card:nth-child(3) .signal-price');
        if (solSignal && this.solPrice > 0) {
            solSignal.textContent = `Entry: $${this.solPrice.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
        }
        
        // Update signal targets based on current price
        this.updateSignalTargets();
    }
    
    updateSignalTargets() {
        // Update BTC target/stop
        const btcCard = document.querySelector('.signal-card:nth-child(1)');
        if (btcCard && this.btcPrice > 0) {
            const target = (this.btcPrice * 1.07).toFixed(0);
            const stop = (this.btcPrice * 0.98).toFixed(0);
            const metrics = btcCard.querySelectorAll('.signal-metrics span');
            if (metrics.length >= 2) {
                metrics[0].innerHTML = `<i class="fas fa-bullseye"></i> Target: $${parseInt(target).toLocaleString()}`;
                metrics[1].innerHTML = `<i class="fas fa-shield-alt"></i> Stop: $${parseInt(stop).toLocaleString()}`;
            }
        }
        
        // Update ETH target/stop
        const ethCard = document.querySelector('.signal-card:nth-child(2)');
        if (ethCard && this.ethPrice > 0) {
            const target = (this.ethPrice * 1.10).toFixed(0);
            const stop = (this.ethPrice * 0.96).toFixed(0);
            const metrics = ethCard.querySelectorAll('.signal-metrics span');
            if (metrics.length >= 2) {
                metrics[0].innerHTML = `<i class="fas fa-bullseye"></i> Target: $${parseInt(target).toLocaleString()}`;
                metrics[1].innerHTML = `<i class="fas fa-shield-alt"></i> Stop: $${parseInt(stop).toLocaleString()}`;
            }
        }
        
        // Update SOL target/stop
        const solCard = document.querySelector('.signal-card:nth-child(3)');
        if (solCard && this.solPrice > 0) {
            const target = (this.solPrice * 0.92).toFixed(2);
            const stop = (this.solPrice * 1.04).toFixed(2);
            const metrics = solCard.querySelectorAll('.signal-metrics span');
            if (metrics.length >= 2) {
                metrics[0].innerHTML = `<i class="fas fa-bullseye"></i> Target: $${target}`;
                metrics[1].innerHTML = `<i class="fas fa-shield-alt"></i> Stop: $${stop}`;
            }
        }
    }

    updatePortfolio() {
        // Update portfolio prices and P&L
        const portfolioRows = document.querySelectorAll('.portfolio-table tbody tr');
        
        portfolioRows.forEach(row => {
            const assetCell = row.querySelector('td:first-child');
            const priceCell = row.querySelector('td:nth-child(3)');
            const pnlCell = row.querySelector('td:nth-child(4)');
            const entryCell = row.querySelector('td:nth-child(2)');
            
            if (assetCell && priceCell) {
                const asset = assetCell.textContent.trim();
                let currentPrice = 0;
                let change = 0;
                
                if (asset === 'BTC') {
                    currentPrice = this.btcPrice;
                    change = this.btcChange;
                } else if (asset === 'ETH') {
                    currentPrice = this.ethPrice;
                    change = this.ethChange;
                } else if (asset === 'SOL') {
                    currentPrice = this.solPrice;
                    change = this.solChange;
                }
                
                if (currentPrice > 0) {
                    priceCell.textContent = `$${currentPrice.toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0})}`;
                    
                    // Update P&L
                    if (pnlCell && entryCell) {
                        const entryText = entryCell.textContent.replace('$', '').replace(',', '');
                        const entryPrice = parseFloat(entryText);
                        if (entryPrice > 0) {
                            const pnl = ((currentPrice - entryPrice) / entryPrice * 100).toFixed(1);
                            const sign = pnl >= 0 ? '+' : '';
                            pnlCell.textContent = `${sign}${pnl}%`;
                            pnlCell.className = pnl >= 0 ? 'positive' : 'negative';
                        }
                    }
                }
            }
        });
    }

    updateSentimentGauge() {
        const gaugeValue = document.querySelector('.gauge-value');
        if (gaugeValue) {
            gaugeValue.textContent = this.fearGreed;
        }
        
        const gaugeLabel = document.querySelector('.gauge-label');
        if (gaugeLabel) {
            let label = 'Neutral';
            if (this.fearGreed <= 20) label = 'Extreme Fear';
            else if (this.fearGreed <= 40) label = 'Fear';
            else if (this.fearGreed <= 60) label = 'Neutral';
            else if (this.fearGreed <= 80) label = 'Greed';
            else label = 'Extreme Greed';
            
            gaugeLabel.textContent = label;
        }
        
        // Update sentiment text
        const sentimentText = document.querySelector('.sentiment-text');
        if (sentimentText) {
            let text = 'Market showing neutral sentiment.';
            if (this.fearGreed <= 20) text = 'Market showing extreme fear with panic selling.';
            else if (this.fearGreed <= 40) text = 'Market showing fear with cautious trading.';
            else if (this.fearGreed <= 60) text = 'Market showing neutral sentiment with balanced activity.';
            else if (this.fearGreed <= 80) text = 'Market showing greed with increased buying pressure.';
            else text = 'Market showing extreme greed with FOMO buying.';
            
            sentimentText.textContent = text;
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.realtimeData = new RealtimeData();
    console.log('Real-time data initialized');
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { RealtimeData };
}