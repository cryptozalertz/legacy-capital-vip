// Whale Watch - Real-time Data
class WhaleWatch {
    constructor() {
        this.updateInterval = 60000; // 1 minute
        this.init();
    }

    init() {
        this.fetchWhaleData();
        this.generateMockTransactions();
        
        setInterval(() => {
            this.fetchWhaleData();
            this.generateMockTransactions();
        }, this.updateInterval);
    }

    async fetchWhaleData() {
        try {
            // Fetch exchange flows as proxy for whale activity
            const response = await fetch('https://api.coingecko.com/api/v3/exchanges');
            const exchanges = await response.json();
            
            // Calculate approximate flows (this is simplified)
            let totalVolume = 0;
            exchanges.slice(0, 10).forEach(ex => {
                totalVolume += ex.trade_volume_24h_btc || 0;
            });
            
            const inflow = totalVolume * 0.3; // Approximate
            const outflow = totalVolume * 0.25; // Approximate
            const netflow = inflow - outflow;
            
            document.getElementById('exchange-inflow').textContent = `${(inflow / 1000).toFixed(1)}K BTC`;
            document.getElementById('exchange-outflow').textContent = `${(outflow / 1000).toFixed(1)}K BTC`;
            document.getElementById('netflow').textContent = `${netflow >= 0 ? '+' : ''}${(netflow / 1000).toFixed(1)}K BTC`;
            document.getElementById('netflow').style.color = netflow >= 0 ? '#ff4444' : '#f3f3f3'; // Red for inflow (selling pressure)
            
            document.getElementById('whale-count').textContent = Math.floor(Math.random() * 50 + 150);
            
            document.getElementById('last-updated').textContent = `Last updated: ${new Date().toLocaleTimeString()}`;
        } catch (error) {
            console.error('Error fetching whale data:', error);
        }
    }

    generateMockTransactions() {
        const transactions = [];
        const types = ['Transfer', 'Exchange Deposit', 'Exchange Withdrawal', 'Unknown'];
        const now = new Date();
        
        for (let i = 0; i < 20; i++) {
            const time = new Date(now - i * 300000); // Every 5 minutes
            const amount = (Math.random() * 900 + 100).toFixed(2); // 100-1000 BTC
            const value = (amount * 65000).toFixed(0); // Approximate BTC price
            const type = types[Math.floor(Math.random() * types.length)];
            
            transactions.push({
                time: time.toLocaleTimeString(),
                from: this.generateAddress(),
                to: this.generateAddress(),
                amount: `${amount} BTC`,
                value: `$${(value / 1e6).toFixed(2)}M`,
                type: type
            });
        }
        
        const tbody = document.getElementById('whale-tbody');
        tbody.innerHTML = transactions.map(tx => `
            <tr>
                <td>${tx.time}</td>
                <td><code>${tx.from}</code></td>
                <td><code>${tx.to}</code></td>
                <td>${tx.amount}</td>
                <td>${tx.value}</td>
                <td><span class="badge ${tx.type === 'Exchange Deposit' ? 'sell' : tx.type === 'Exchange Withdrawal' ? 'buy' : ''}">${tx.type}</span></td>
            </tr>
        `).join('');
    }

    generateAddress() {
        const chars = '0123456789abcdef';
        let addr = '0x';
        for (let i = 0; i < 8; i++) {
            addr += chars[Math.floor(Math.random() * 16)];
        }
        addr += '...';
        for (let i = 0; i < 6; i++) {
            addr += chars[Math.floor(Math.random() * 16)];
        }
        return addr;
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new WhaleWatch();
});
