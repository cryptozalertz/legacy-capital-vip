// Market Overview - Real-time Data
class MarketOverview {
    constructor() {
        this.btcChart = null;
        this.updateInterval = 30000; // 30 seconds
        this.init();
    }

    init() {
        this.fetchMarketData();
        this.fetchBTCHistory();
        this.fetchAltcoins();
        this.fetchMemeCoins();
        
        setInterval(() => {
            this.fetchMarketData();
            this.fetchAltcoins();
            this.fetchMemeCoins();
        }, this.updateInterval);
    }

    async fetchMarketData() {
        try {
            const response = await fetch('https://api.coingecko.com/api/v3/global');
            const data = await response.json();
            
            if (data.data) {
                const marketCap = data.data.total_market_cap.usd;
                const marketChange = data.data.market_cap_change_percentage_24h_usd;
                const btcDominance = data.data.market_cap_percentage.btc;
                const volume24h = data.data.total_volume.usd;
                
                document.getElementById('total-market-cap').textContent = `$${(marketCap / 1e12).toFixed(2)}T`;
                document.getElementById('market-change').textContent = `${marketChange >= 0 ? '+' : ''}${marketChange.toFixed(2)}%`;
                document.getElementById('market-change').style.color = marketChange >= 0 ? '#f3f3f3' : '#ff4444';
                document.getElementById('btc-dominance').textContent = `${btcDominance.toFixed(1)}%`;
                document.getElementById('volume-24h').textContent = `$${(volume24h / 1e9).toFixed(1)}B`;
                
                document.getElementById('last-updated').textContent = `Last updated: ${new Date().toLocaleTimeString()}`;
            }
        } catch (error) {
            console.error('Error fetching market data:', error);
        }
    }

    async fetchBTCHistory() {
        try {
            const response = await fetch('https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=7');
            const data = await response.json();
            
            if (data.prices) {
                const prices = data.prices.map(p => p[1]);
                const labels = data.prices.map(p => new Date(p[0]).toLocaleDateString());
                
                this.renderBTCChart(labels, prices);
                
                const currentPrice = prices[prices.length - 1];
                const priceChange24h = ((prices[prices.length - 1] - prices[prices.length - 2]) / prices[prices.length - 2] * 100);
                
                document.getElementById('btc-price-detail').textContent = `$${currentPrice.toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0})}`;
                document.getElementById('btc-change-24h').textContent = `${priceChange24h >= 0 ? '+' : ''}${priceChange24h.toFixed(2)}%`;
                document.getElementById('btc-change-24h').style.color = priceChange24h >= 0 ? '#f3f3f3' : '#ff4444';
            }
        } catch (error) {
            console.error('Error fetching BTC history:', error);
        }
    }

    async fetchAltcoins() {
        try {
            const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h,7d');
            const data = await response.json();
            
            const tbody = document.getElementById('altcoins-tbody');
            tbody.innerHTML = data.map((coin, index) => `
                <tr>
                    <td>${index + 1}</td>
                    <td>
                        <img src="${coin.image}" alt="${coin.name}" style="width: 24px; height: 24px; margin-right: 8px; vertical-align: middle;">
                        ${coin.name} <span style="color: #888;">(${coin.symbol.toUpperCase()})</span>
                    </td>
                    <td>$${coin.current_price.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 6})}</td>
                    <td style="color: ${coin.price_change_percentage_24h >= 0 ? '#f3f3f3' : '#ff4444'}">${coin.price_change_percentage_24h >= 0 ? '+' : ''}${coin.price_change_percentage_24h?.toFixed(2) || '0.00'}%</td>
                    <td style="color: ${coin.price_change_percentage_7d_in_currency >= 0 ? '#f3f3f3' : '#ff4444'}">${coin.price_change_percentage_7d_in_currency >= 0 ? '+' : ''}${coin.price_change_percentage_7d_in_currency?.toFixed(2) || '0.00'}%</td>
                    <td>$${(coin.market_cap / 1e9).toFixed(2)}B</td>
                    <td>$${(coin.total_volume / 1e6).toFixed(1)}M</td>
                </tr>
            `).join('');
            
            // Update BTC details
            const btc = data.find(c => c.id === 'bitcoin');
            if (btc) {
                document.getElementById('btc-market-cap').textContent = `$${(btc.market_cap / 1e9).toFixed(2)}B`;
                document.getElementById('btc-supply').textContent = `${(btc.circulating_supply / 1e6).toFixed(2)}M BTC`;
            }
        } catch (error) {
            console.error('Error fetching altcoins:', error);
        }
    }

    async fetchMemeCoins() {
        try {
            const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&category=meme-token&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h,7d');
            const data = await response.json();
            
            const tbody = document.getElementById('memes-tbody');
            tbody.innerHTML = data.map((coin, index) => `
                <tr>
                    <td>${index + 1}</td>
                    <td>
                        <img src="${coin.image}" alt="${coin.name}" style="width: 24px; height: 24px; margin-right: 8px; vertical-align: middle;">
                        ${coin.name} <span style="color: #888;">(${coin.symbol.toUpperCase()})</span>
                    </td>
                    <td>$${coin.current_price.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 6})}</td>
                    <td style="color: ${coin.price_change_percentage_24h >= 0 ? '#f3f3f3' : '#ff4444'}">${coin.price_change_percentage_24h >= 0 ? '+' : ''}${coin.price_change_percentage_24h?.toFixed(2) || '0.00'}%</td>
                    <td style="color: ${coin.price_change_percentage_7d_in_currency >= 0 ? '#f3f3f3' : '#ff4444'}">${coin.price_change_percentage_7d_in_currency >= 0 ? '+' : ''}${coin.price_change_percentage_7d_in_currency?.toFixed(2) || '0.00'}%</td>
                    <td>$${(coin.market_cap / 1e6).toFixed(2)}M</td>
                    <td>$${(coin.total_volume / 1e6).toFixed(1)}M</td>
                </tr>
            `).join('');
        } catch (error) {
            console.error('Error fetching meme coins:', error);
        }
    }

    renderBTCChart(labels, prices) {
        const ctx = document.getElementById('btcChart').getContext('2d');
        
        if (this.btcChart) {
            this.btcChart.destroy();
        }
        
        this.btcChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'BTC Price (USD)',
                    data: prices,
                    borderColor: '#f3f3f3',
                    backgroundColor: 'rgba(243, 243, 243, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        display: false
                    },
                    y: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: '#888',
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new MarketOverview();
});
