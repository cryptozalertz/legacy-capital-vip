// Market Heatmap - Real-time Data
class MarketHeatmap {
    constructor() {
        this.currentPeriod = '24h';
        this.updateInterval = 30000;
        this.init();
    }

    init() {
        this.fetchHeatmapData('24h');
        
        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentPeriod = e.target.dataset.period;
                this.fetchHeatmapData(this.currentPeriod);
            });
        });

        setInterval(() => this.fetchHeatmapData(this.currentPeriod), this.updateInterval);
    }

    async fetchHeatmapData(period) {
        try {
            let days;
            switch(period) {
                case '1h': days = 1; break;
                case '24h': days = 1; break;
                case '7d': days = 7; break;
                default: days = 1;
            }

            const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false&price_change_percentage=${days}d`);
            const data = await response.json();

            this.renderHeatmap(data, days);
            document.getElementById('last-updated').textContent = `Last updated: ${new Date().toLocaleTimeString()}`;
        } catch (error) {
            console.error('Error fetching heatmap data:', error);
        }
    }

    renderHeatmap(coins, days) {
        const grid = document.getElementById('heatmap-grid');
        
        grid.innerHTML = coins.map(coin => {
            const changeKey = `price_change_percentage_${days}d_in_currency`;
            const change = coin[changeKey] || 0;
            const color = this.getColor(change);
            const textColor = Math.abs(change) > 5 ? '#000' : '#fff';
            
            return `
                <div class="heatmap-item" style="background-color: ${color}; color: ${textColor};" title="${coin.name}: ${change >= 0 ? '+' : ''}${change.toFixed(2)}%">
                    <div class="coin-name">${coin.symbol.toUpperCase()}</div>
                    <div class="coin-price">$${coin.current_price.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 4})}</div>
                    <div class="coin-change">${change >= 0 ? '+' : ''}${change.toFixed(2)}%</div>
                </div>
            `;
        }).join('');
    }

    getColor(change) {
        if (change <= -10) return '#ff4444';
        if (change <= -5) return '#ff6b6b';
        if (change <= -2) return '#ff9999';
        if (change <= 2) return '#666666';
        if (change <= 5) return '#99ff99';
        if (change <= 10) return '#6bff6b';
        return '#00ff00';
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new MarketHeatmap();
});
