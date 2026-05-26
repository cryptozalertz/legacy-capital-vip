// Legacy Capital VIP Portal Scripts

// Explore Menu Toggle
class ExploreMenu {
    constructor() {
        this.toggle = document.querySelector('.explore-toggle');
        this.menu = document.querySelector('.explore-menu');
        this.isOpen = true; // Default open
        
        this.init();
    }
    
    init() {
        if (this.toggle) {
            this.toggle.addEventListener('click', () => this.toggleMenu());
        }
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.explore-nav') && this.isOpen) {
                this.closeMenu();
            }
        });
    }
    
    toggleMenu() {
        if (this.isOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }
    
    openMenu() {
        if (this.menu) {
            this.menu.style.display = 'flex';
            this.menu.style.opacity = '0';
            setTimeout(() => {
                this.menu.style.opacity = '1';
            }, 10);
        }
        if (this.toggle) {
            this.toggle.querySelector('.fa-chevron-down').style.transform = 'rotate(180deg)';
        }
        this.isOpen = true;
    }
    
    closeMenu() {
        if (this.menu) {
            this.menu.style.opacity = '0';
            setTimeout(() => {
                this.menu.style.display = 'none';
            }, 300);
        }
        if (this.toggle) {
            this.toggle.querySelector('.fa-chevron-down').style.transform = 'rotate(0deg)';
        }
        this.isOpen = false;
    }
}

// Explore Card Interactions
class ExploreCards {
    constructor() {
        this.cards = document.querySelectorAll('.explore-card');
        this.init();
    }
    
    init() {
        this.cards.forEach(card => {
            // Add click handler
            card.addEventListener('click', () => {
                const cardId = card.id;
                this.handleCardClick(cardId);
            });
            
            // Add hover animation
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-8px)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });
    }
    
    handleCardClick(cardId) {
        console.log(`Exploring: ${cardId}`);
        
        // Show loading state
        const card = document.getElementById(cardId);
        if (card) {
            const btn = card.querySelector('.btn-explore');
            const originalText = btn.textContent;
            btn.textContent = 'Loading...';
            btn.disabled = true;
            
            // Simulate content loading
            setTimeout(() => {
                btn.textContent = originalText;
                btn.disabled = false;
                
                // Scroll to section or show modal
                this.showExploreContent(cardId);
            }, 800);
        }
    }
    
    showExploreContent(cardId) {
        // Create modal or expand section
        const modal = document.createElement('div');
        modal.className = 'explore-modal';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${this.getCardTitle(cardId)}</h2>
                    <button class="modal-close"><i class="fas fa-times"></i></button>
                </div>
                <div class="modal-body">
                    <p>Loading ${cardId} data...</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close modal handler
        modal.querySelector('.modal-close').addEventListener('click', () => {
            modal.remove();
        });
        
        modal.querySelector('.modal-overlay').addEventListener('click', () => {
            modal.remove();
        });
    }
    
    getCardTitle(cardId) {
        const titles = {
            'market-overview': 'Market Overview',
            'top-movers': 'Top Movers',
            'whale-watch': 'Whale Watch',
            'sentiment': 'Market Sentiment',
            'heatmap': 'Market Heatmap',
            'calendar': 'Economic Calendar',
            'news': 'News Feed',
            'learn': 'Learn & Earn'
        };
        return titles[cardId] || 'Explore';
    }
}

// Portal Navigation
class PortalNavigation {
    constructor() {
        this.navLinks = document.querySelectorAll('.nav-links a');
        this.sections = document.querySelectorAll('.portal-section');
        this.init();
    }
    
    init() {
        // Smooth scroll for nav links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href.startsWith('#')) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                        
                        // Update active state
                        this.navLinks.forEach(l => l.classList.remove('active'));
                        link.classList.add('active');
                    }
                }
            });
        });
        
        // Update active nav on scroll
        window.addEventListener('scroll', () => {
            this.updateActiveNav();
        });
    }
    
    updateActiveNav() {
        const scrollPos = window.scrollY + 200;
        
        this.sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            
            if (scrollPos >= top && scrollPos < top + height) {
                this.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
}

// Live Price Ticker
class PriceTicker {
    constructor() {
        this.prices = {
            btc: document.getElementById('btc-price'),
            eth: document.getElementById('eth-price'),
            sol: document.getElementById('sol-price')
        };
        this.init();
    }
    
    init() {
        // Update prices every 30 seconds
        setInterval(() => this.updatePrices(), 30000);
        
        // Initial update
        this.updatePrices();
    }
    
    updatePrices() {
        // Simulate price updates (replace with real API)
        const btcBase = 67234;
        const variation = (Math.random() - 0.5) * 200;
        const newPrice = btcBase + variation;
        
        if (this.prices.btc) {
            this.prices.btc.textContent = `$${newPrice.toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0})}`;
            this.prices.btc.style.color = variation > 0 ? 'var(--success)' : 'var(--danger)';
            
            setTimeout(() => {
                this.prices.btc.style.color = '';
            }, 1000);
        }
    }
}

// Section Reveal Animation
class SectionReveal {
    constructor() {
        this.sections = document.querySelectorAll('.portal-section');
        this.init();
    }
    
    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1
        });
        
        this.sections.forEach(section => {
            observer.observe(section);
        });
    }
}

// Initialize Portal
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    new ExploreMenu();
    new ExploreCards();
    new PortalNavigation();
    new PriceTicker();
    new SectionReveal();
    
    // Add loading animation to explore buttons
    document.querySelectorAll('.btn-explore').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const originalText = this.textContent;
            this.textContent = 'Loading...';
            this.disabled = true;
            
            setTimeout(() => {
                this.textContent = originalText;
                this.disabled = false;
            }, 1500);
        });
    });
    
    console.log('Legacy Capital VIP Portal initialized');
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ExploreMenu, ExploreCards, PortalNavigation, PriceTicker, SectionReveal };
}