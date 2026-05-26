// Economic Calendar - Real-time Data
class EconomicCalendar {
    constructor() {
        this.updateInterval = 3600000; // 1 hour
        this.init();
    }

    init() {
        this.fetchCalendarData();
        
        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.filterEvents(e.target.dataset.filter);
            });
        });

        setInterval(() => this.fetchCalendarData(), this.updateInterval);
    }

    async fetchCalendarData() {
        try {
            // Using a mock dataset since FXStreet requires API key
            // In production, integrate with FXStreet API
            const events = this.generateMockEvents();
            this.renderEvents(events);
            document.getElementById('last-updated').textContent = `Last updated: ${new Date().toLocaleTimeString()}`;
        } catch (error) {
            console.error('Error fetching calendar data:', error);
        }
    }

    generateMockEvents() {
        const now = new Date();
        const events = [
            {
                date: new Date(now.getTime() + 86400000).toLocaleDateString(),
                time: '08:30',
                currency: 'USD',
                event: 'Non-Farm Payrolls',
                impact: 'high',
                forecast: '200K',
                previous: '180K'
            },
            {
                date: new Date(now.getTime() + 86400000).toLocaleDateString(),
                time: '08:30',
                currency: 'USD',
                event: 'Unemployment Rate',
                impact: 'high',
                forecast: '3.7%',
                previous: '3.8%'
            },
            {
                date: new Date(now.getTime() + 172800000).toLocaleDateString(),
                time: '14:00',
                currency: 'USD',
                event: 'FOMC Meeting',
                impact: 'high',
                forecast: '5.50%',
                previous: '5.50%'
            },
            {
                date: new Date(now.getTime() + 259200000).toLocaleDateString(),
                time: '08:30',
                currency: 'USD',
                event: 'CPI m/m',
                impact: 'high',
                forecast: '0.3%',
                previous: '0.4%'
            },
            {
                date: new Date(now.getTime() + 345600000).toLocaleDateString(),
                time: '10:00',
                currency: 'USD',
                event: 'Retail Sales m/m',
                impact: 'medium',
                forecast: '0.5%',
                previous: '0.3%'
            },
            {
                date: new Date(now.getTime() + 432000000).toLocaleDateString(),
                time: '08:30',
                currency: 'USD',
                event: 'GDP q/q',
                impact: 'high',
                forecast: '2.1%',
                previous: '2.0%'
            },
            {
                date: new Date(now.getTime() + 518400000).toLocaleDateString(),
                time: '09:45',
                currency: 'USD',
                event: 'Manufacturing PMI',
                impact: 'medium',
                forecast: '47.5',
                previous: '46.8'
            },
            {
                date: new Date(now.getTime() + 604800000).toLocaleDateString(),
                time: '08:30',
                currency: 'USD',
                event: 'Initial Jobless Claims',
                impact: 'medium',
                forecast: '215K',
                previous: '212K'
            }
        ];
        
        return events;
    }

    renderEvents(events) {
        const tbody = document.getElementById('calendar-tbody');
        tbody.innerHTML = events.map(event => `
            <tr data-impact="${event.impact}">
                <td>${event.date}</td>
                <td>${event.time}</td>
                <td><span class="badge">${event.currency}</span></td>
                <td><strong>${event.event}</strong></td>
                <td><span class="badge ${event.impact === 'high' ? 'sell' : event.impact === 'medium' ? 'buy' : ''}">${event.impact.toUpperCase()}</span></td>
                <td>${event.forecast}</td>
                <td>${event.previous}</td>
            </tr>
        `).join('');
    }

    filterEvents(filter) {
        const rows = document.querySelectorAll('#calendar-tbody tr');
        rows.forEach(row => {
            if (filter === 'all' || row.dataset.impact === filter) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new EconomicCalendar();
});
