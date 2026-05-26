// Top Movers - Real-time Data
class TopMovers {
    constructor() {
        this.currentPeriod = '24h';
        this.updateInterval = 30000;
        this.init();
    }

    init() {
        this.fetchMovers('24h');
        
        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentPeriod = e.target.dataset.period;
                this.fetchMovers(this.currentPeriod);
            });
        });

        setInterval(() => this.fetchMovers(this.currentPeriod), this.updateInterval);
    }

    async fetchMovers(period) {
        try {
            let days;
            switch(period) {
                case '24h': days = 1; break;
                case '3d': days = 3; break;
                case '7d': days = 7; break;
                default: days = 1;
            }

            const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false&price_change_percentage=${days}d`);
            const data = await response.json();

            // Sort by change percentage
            const sorted = data.sort((a, b) => {
                const changeA = a[`price_change_percentage_${days}d_in_currency`] || 0;
                const changeB = b[`price_change_percentage_${days}d_in_currency`] || 0;
                return changeB - changeA;
            });

            const gainers = sorted.slice(0, 20);
            const losers = sorted.slice(-20).reverse();

            this.renderMovers(gainers, 'gainers-tbody', days);
            this.renderMovers(losers, 'losers-tbody', days);

            document.getElementById('last-updated').textContent = `Last updated: ${new Date().toLocaleTimeString()}`;
        } catch (error) {
            console.error('Error fetching movers:', error);
        }
    }

    renderMovers(coins, tbodyId, days) {
        const tbody = document.getElementById(tbodyId);
        tbody.innerHTML = coins.map((coin, index) => {
            const changeKey = `price_change_percentage_${days}d_in_currency`;
            const change = coin[changeKey] || 0;
            
            return `
                <tr>
                    <td>${index + 1}</td>
                    <td>
                        <img src="${coin.image}" alt="${coin.name}" style="width: 24px; height: 24px; margin-right: 8px; vertical-align: middle;">
                        ${coin.name} <span style="color: #888;">(${coin.symbol.toUpperCase()})</span>
                    </td>
                    <td>$${coin.current_price.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 6})}</td>
                    <td style="color: ${change >= 0 ? '#f3f3f3' : '#ff4444'}">${change >= 0 ? '+' : ''}${change.toFixed(2)}%</td>
                    <td>$${(coin.total_volume / 1e6).toFixed(1)}M</td>
                    <td>$${(coin.market_cap / 1e6).toFixed(1)}M</td>
                </tr>
            `;
        }).join('');
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new TopMovers();
});
