// News Feed - Real-time Data
class NewsFeed {
    constructor() {
        this.updateInterval = 300000; // 5 minutes
        this.init();
    }

    init() {
        this.fetchNews();
        
        // Category filters
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.filterNews(e.target.dataset.category);
            });
        });

        setInterval(() => this.fetchNews(), this.updateInterval);
    }

    async fetchNews() {
        try {
            // Using CryptoPanic API (free tier available)
            // In production, use your API key
            const response = await fetch('https://cryptopanic.com/api/v1/posts/?auth_token=demo&public=true');
            const data = await response.json();
            
            if (data.results) {
                this.renderNews(data.results);
                document.getElementById('last-updated').textContent = `Last updated: ${new Date().toLocaleTimeString()}`;
            }
        } catch (error) {
            console.error('Error fetching news:', error);
            // Fallback to mock data
            this.renderMockNews();
        }
    }

    renderNews(articles) {
        const grid = document.getElementById('news-grid');
        
        grid.innerHTML = articles.slice(0, 12).map(article => {
            const category = this.categorizeNews(article.title);
            return `
                <div class="news-card" data-category="${category}">
                    <div class="news-image" style="background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%); height: 150px; display: flex; align-items: center; justify-content: center;">
                        <i class="fas fa-newspaper" style="font-size: 3rem; color: #f3f3f3;"></i>
                    </div>
                    <div class="news-content" style="padding: 1.5rem;">
                        <span class="news-category" style="color: #f3f3f3; font-size: 0.75rem; text-transform: uppercase; font-weight: 600;">${category}</span>
                        <h3 style="margin: 0.5rem 0; font-size: 1rem; line-height: 1.4;">
                            <a href="${article.url}" target="_blank" style="color: #fff; text-decoration: none;">${article.title}</a>
                        </h3>
                        <div class="news-meta" style="color: #888; font-size: 0.875rem; margin-top: 1rem;">
                            <span><i class="far fa-clock"></i> ${new Date(article.created_at).toLocaleDateString()}</span>
                            <span style="margin-left: 1rem;"><i class="far fa-comment"></i> ${article.votes?.positive || 0} likes</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    renderMockNews() {
        const mockArticles = [
            {
                title: 'Bitcoin Surges Past $67,000 as Institutional Adoption Accelerates',
                url: '#',
                created_at: new Date().toISOString(),
                votes: { positive: 245 }
            },
            {
                title: 'Ethereum 2.0 Staking Reaches New All-Time High',
                url: '#',
                created_at: new Date(Date.now() - 3600000).toISOString(),
                votes: { positive: 189 }
            },
            {
                title: 'SEC Approves New Spot Bitcoin ETF Applications',
                url: '#',
                created_at: new Date(Date.now() - 7200000).toISOString(),
                votes: { positive: 567 }
            },
            {
                title: 'DeFi Protocol Launches Revolutionary Yield Farming Strategy',
                url: '#',
                created_at: new Date(Date.now() - 10800000).toISOString(),
                votes: { positive: 123 }
            },
            {
                title: 'Major Bank Announces Crypto Custody Services',
                url: '#',
                created_at: new Date(Date.now() - 14400000).toISOString(),
                votes: { positive: 334 }
            },
            {
                title: 'NFT Market Shows Signs of Recovery After Prolonged Downturn',
                url: '#',
                created_at: new Date(Date.now() - 18000000).toISOString(),
                votes: { positive: 89 }
            }
        ];

        const grid = document.getElementById('news-grid');
        grid.innerHTML = mockArticles.map(article => {
            const category = this.categorizeNews(article.title);
            return `
                <div class="news-card" data-category="${category}" style="background: var(--card); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; transition: transform 0.3s;">
                    <div class="news-image" style="background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%); height: 150px; display: flex; align-items: center; justify-content: center;">
                        <i class="fas fa-newspaper" style="font-size: 3rem; color: #f3f3f3;"></i>
                    </div>
                    <div class="news-content" style="padding: 1.5rem;">
                        <span class="news-category" style="color: #f3f3f3; font-size: 0.75rem; text-transform: uppercase; font-weight: 600;">${category}</span>
                        <h3 style="margin: 0.5rem 0; font-size: 1rem; line-height: 1.4;">
                            <a href="${article.url}" target="_blank" style="color: #fff; text-decoration: none;">${article.title}</a>
                        </h3>
                        <div class="news-meta" style="color: #888; font-size: 0.875rem; margin-top: 1rem;">
                            <span><i class="far fa-clock"></i> ${new Date(article.created_at).toLocaleDateString()}</span>
                            <span style="margin-left: 1rem;"><i class="far fa-comment"></i> ${article.votes.positive} likes</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    categorizeNews(title) {
        const lower = title.toLowerCase();
        if (lower.includes('bitcoin') || lower.includes('btc')) return 'bitcoin';
        if (lower.includes('ethereum') || lower.includes('eth')) return 'ethereum';
        if (lower.includes('sec') || lower.includes('regulation') || lower.includes('etf')) return 'regulation';
        if (lower.includes('defi') || lower.includes('yield') || lower.includes('staking')) return 'defi';
        if (lower.includes('nft')) return 'nft';
        return 'general';
    }

    filterNews(category) {
        const cards = document.querySelectorAll('.news-card');
        cards.forEach(card => {
            if (category === 'all' || card.dataset.category === category) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new NewsFeed();
});
