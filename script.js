// Legacy Capital VIP - Dashboard Scripts

// Live Price Updates
function updatePrices() {
    // Simulate live price updates (replace with real API calls)
    const btcPrice = document.getElementById('btc-price');
    const fearGreed = document.getElementById('fear-greed');
    
    if (btcPrice) {
        // Add subtle animation on update
        btcPrice.style.opacity = '0.7';
        setTimeout(() => {
            btcPrice.style.opacity = '1';
        }, 300);
    }
}

// Signal Card Interactions
document.querySelectorAll('.signal-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Alert Dismissal
document.querySelectorAll('.alert-item').forEach(alert => {
    alert.addEventListener('click', function() {
        this.style.opacity = '0';
        setTimeout(() => {
            this.style.display = 'none';
        }, 300);
    });
});

// Smooth Scroll Navigation
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Portfolio P&L Animation
function animatePortfolio() {
    const pnlElements = document.querySelectorAll('.portfolio-table .positive, .portfolio-table .negative');
    
    pnlElements.forEach((el, index) => {
        setTimeout(() => {
            el.style.transform = 'scale(1.1)';
            setTimeout(() => {
                el.style.transform = 'scale(1)';
            }, 200);
        }, index * 100);
    });
}

// Whale Activity Animation
function animateWhaleBar() {
    const whaleProgress = document.querySelector('.whale-progress');
    if (whaleProgress) {
        const width = whaleProgress.style.width;
        whaleProgress.style.width = '0%';
        setTimeout(() => {
            whaleProgress.style.width = width;
        }, 100);
    }
}

// Gauge Animation
function animateGauge() {
    const gaugeValue = document.querySelector('.gauge-value');
    if (gaugeValue) {
        const finalValue = parseInt(gaugeValue.textContent);
        let currentValue = 0;
        
        const interval = setInterval(() => {
            currentValue += 2;
            gaugeValue.textContent = currentValue;
            
            if (currentValue >= finalValue) {
                clearInterval(interval);
            }
        }, 20);
    }
}

// Initialize Dashboard
document.addEventListener('DOMContentLoaded', function() {
    // Animate elements on load
    animateWhaleBar();
    animateGauge();
    animatePortfolio();
    
    // Update prices every 30 seconds
    setInterval(updatePrices, 30000);
    
    // Add loading states to buttons
    document.querySelectorAll('.btn-action').forEach(btn => {
        btn.addEventListener('click', function() {
            const originalText = this.textContent;
            this.textContent = 'Loading...';
            this.disabled = true;
            
            setTimeout(() => {
                this.textContent = originalText;
                this.disabled = false;
            }, 1500);
        });
    });
});

// WebSocket Connection (for real-time updates)
class VIPWebSocket {
    constructor() {
        this.ws = null;
        this.reconnectInterval = 5000;
    }
    
    connect() {
        // Replace with your WebSocket endpoint
        // this.ws = new WebSocket('wss://your-api.com/vip-stream');
        
        // Simulated connection for demo
        console.log('VIP WebSocket connected');
        this.startSimulatedUpdates();
    }
    
    startSimulatedUpdates() {
        // Simulate incoming signals
        setInterval(() => {
            this.simulateNewSignal();
        }, 30000);
    }
    
    simulateNewSignal() {
        const signals = ['BUY', 'SELL', 'STRONG BUY'];
        const assets = ['BTC', 'ETH', 'SOL', 'AVAX'];
        
        const signal = {
            type: signals[Math.floor(Math.random() * signals.length)],
            asset: assets[Math.floor(Math.random() * assets.length)],
            price: Math.floor(Math.random() * 1000) + 100,
            confidence: Math.floor(Math.random() * 20) + 80
        };
        
        console.log('New signal:', signal);
        // In production, this would update the UI
    }
    
    disconnect() {
        if (this.ws) {
            this.ws.close();
        }
    }
}

// Initialize WebSocket (commented out until backend is ready)
// const vipWS = new VIPWebSocket();
// vipWS.connect();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { VIPWebSocket };
}