// Market Sentiment - Real-time Data
class MarketSentiment {
    constructor() {
        this.updateInterval = 3600000; // 1 hour
        this.history = [];
        this.init();
    }

    init() {
        this.fetchSentimentData();
        this.generateHourlyHistory();
        
        setInterval(() => {
            this.fetchSentimentData();
            this.addHourlyRecord();
        }, this.updateInterval);
    }

    async fetchSentimentData() {
        try {
            const response = await fetch('https://api.alternative.me/fng/?limit=1');
            const data = await response.json();
            
            if (data.data && data.data[0]) {
                const fearGreed = parseInt(data.data[0].value);
                const classification = data.data[0].value_classification;
                
                document.getElementById('fear-greed-value').textContent = fearGreed;
                document.getElementById('fear-greed-label').textContent = classification;
                
                // Update scale
                document.querySelectorAll('.scale-item').forEach(item => {
                    item.classList.remove('active');
                });
                
                const scaleMap = {
                    'Extreme Fear': 0,
                    'Fear': 1,
                    'Neutral': 2,
                    'Greed': 3,
                    'Extreme Greed': 4
                };
                
                const activeIndex = scaleMap[classification] || 2;
                document.querySelectorAll('.scale-item')[activeIndex]?.classList.add('active');
                
                // Generate other metrics based on fear/greed
                const social = this.calculateSocialSentiment(fearGreed);
                const volatility = this.calculateVolatility(fearGreed);
                const liquidity = this.calculateLiquidity(fearGreed);
                const momentum = this.calculateMomentum(fearGreed);
                
                document.getElementById('social-sentiment').textContent = social;
                document.getElementById('volatility-index').textContent = volatility;
                document.getElementById('liquidity-score').textContent = liquidity;
                document.getElementById('momentum-score').textContent = momentum;
                
                document.getElementById('last-updated').textContent = `Last updated: ${new Date().toLocaleTimeString()}`;
            }
        } catch (error) {
            console.error('Error fetching sentiment:', error);
        }
    }

    calculateSocialSentiment(fearGreed) {
        if (fearGreed <= 20) return 'Very Negative';
        if (fearGreed <= 40) return 'Negative';
        if (fearGreed <= 60) return 'Neutral';
        if (fearGreed <= 80) return 'Positive';
        return 'Very Positive';
    }

    calculateVolatility(fearGreed) {
        // Higher fear = higher volatility
        const vol = Math.abs(50 - fearGreed) * 2;
        return `${vol.toFixed(0)}/100`;
    }

    calculateLiquidity(fearGreed) {
        // Higher greed = higher liquidity
        const liq = fearGreed * 0.8 + 20;
        return `${liq.toFixed(0)}/100`;
    }

    calculateMomentum(fearGreed) {
        if (fearGreed <= 20) return 'Strong Down';
        if (fearGreed <= 40) return 'Down';
        if (fearGreed <= 60) return 'Sideways';
        if (fearGreed <= 80) return 'Up';
        return 'Strong Up';
    }

    generateHourlyHistory() {
        const now = new Date();
        for (let i = 23; i >= 0; i--) {
            const time = new Date(now - i * 3600000);
            const fearGreed = Math.floor(Math.random() * 60 + 20); // Random between 20-80
            
            this.history.push({
                time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                fearGreed: fearGreed,
                social: this.calculateSocialSentiment(fearGreed),
                volatility: this.calculateVolatility(fearGreed),
                overall: this.calculateOverall(fearGreed)
            });
        }
        
        this.renderHistory();
    }

    addHourlyRecord() {
        const now = new Date();
        const fearGreed = parseInt(document.getElementById('fear-greed-value').textContent) || 50;
        
        this.history.push({
            time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            fearGreed: fearGreed,
            social: this.calculateSocialSentiment(fearGreed),
            volatility: this.calculateVolatility(fearGreed),
            overall: this.calculateOverall(fearGreed)
        });
        
        // Keep only last 24 records
        if (this.history.length > 24) {
            this.history.shift();
        }
        
        this.renderHistory();
    }

    calculateOverall(fearGreed) {
        if (fearGreed <= 20) return 'Extreme Fear';
        if (fearGreed <= 40) return 'Fear';
        if (fearGreed <= 60) return 'Neutral';
        if (fearGreed <= 80) return 'Greed';
        return 'Extreme Greed';
    }

    renderHistory() {
        const tbody = document.getElementById('sentiment-history-tbody');
        tbody.innerHTML = this.history.slice().reverse().map(record => `
            <tr>
                <td>${record.time}</td>
                <td>${record.fearGreed}</td>
                <td>${record.social}</td>
                <td>${record.volatility}</td>
                <td><span class="badge ${record.overall === 'Extreme Fear' || record.overall === 'Fear' ? 'sell' : record.overall === 'Extreme Greed' || record.overall === 'Greed' ? 'buy' : ''}">${record.overall}</span></td>
            </tr>
        `).join('');
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new MarketSentiment();
});
