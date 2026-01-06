/**
 * NESMA Dashboard - UI Components
 * Reusable UI components
 * @version 2.0.0
 */

const UIComponents = {
    /**
     * Create loading overlay
     * @param {string} text - Loading text
     * @returns {string} HTML string
     */
    loadingOverlay(text = 'Loading data...') {
        return `
            <div id="loadingOverlay" class="loading-overlay">
                <div class="text-center">
                    <div class="spinner mx-auto mb-4"></div>
                    <p class="text-gray-600" id="loadingText">${text}</p>
                </div>
            </div>
        `;
    },

    /**
     * Create KPI card
     * @param {Object} options - Card options
     * @returns {string} HTML string
     */
    kpiCard({ icon, value, label, color = '#2e3192', id = '' }) {
        return `
            <div class="stat-card glass-card rounded-xl p-4">
                <div class="text-3xl mb-2">${icon}</div>
                <div class="text-2xl font-bold" style="color: ${color}" ${id ? `id="${id}"` : ''}>${value}</div>
                <div class="text-sm text-gray-500" ${id ? `id="${id}Label"` : ''}>${label}</div>
            </div>
        `;
    },

    /**
     * Create filter section
     * @param {Array} filters - Filter definitions
     * @param {string} title - Section title
     * @returns {string} HTML string
     */
    filterSection(filters, title = 'Interactive Filters') {
        const filterInputs = filters.map(filter => {
            if (filter.type === 'select') {
                return `
                    <div>
                        <label class="block text-sm font-medium text-gray-600 mb-1">${filter.label}</label>
                        <select id="${filter.id}" onchange="${filter.onChange || 'applyFilters()'}" 
                                class="filter-select w-full px-3 py-2 rounded-lg outline-none">
                            <option value="">All</option>
                        </select>
                    </div>
                `;
            }
            if (filter.type === 'date') {
                return `
                    <div>
                        <label class="block text-sm font-medium text-gray-600 mb-1">${filter.label}</label>
                        <input type="date" id="${filter.id}" onchange="${filter.onChange || 'applyFilters()'}" 
                               class="filter-select w-full px-3 py-2 rounded-lg outline-none">
                    </div>
                `;
            }
            return '';
        }).join('');

        return `
            <div class="glass-card rounded-2xl p-6">
                <div class="flex items-center justify-between mb-4">
                    <h2 class="text-lg font-bold text-gray-800">${title}</h2>
                    <button onclick="resetFilters()" class="text-sm text-[#2e3192] hover:underline">Reset</button>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                    ${filterInputs}
                </div>
                <div id="activeFilters" class="mt-4 flex flex-wrap gap-2 hidden"></div>
            </div>
        `;
    },

    /**
     * Create tab navigation
     * @param {Array} tabs - Tab definitions
     * @returns {string} HTML string
     */
    tabNavigation(tabs) {
        return `
            <div class="flex border-b overflow-x-auto">
                ${tabs.map((tab, index) => `
                    <button onclick="switchTab('${tab.id}')" 
                            class="tab-btn ${index === 0 ? 'active' : ''} flex-1 px-6 py-3 text-center font-medium"
                            id="tab${this.capitalize(tab.id)}">
                        ${tab.label}
                    </button>
                `).join('')}
            </div>
        `;
    },

    /**
     * Create badge
     * @param {string} text - Badge text
     * @param {string} type - Badge type (success, warning, danger, info)
     * @returns {string} HTML string
     */
    badge(text, type = 'info') {
        const classes = {
            success: 'bg-green-100 text-green-800',
            warning: 'bg-yellow-100 text-yellow-800',
            danger: 'bg-red-100 text-red-800',
            info: 'bg-blue-100 text-blue-800'
        };
        
        return `<span class="badge ${classes[type] || classes.info}">${text}</span>`;
    },

    /**
     * Create status badge based on status text
     * @param {string} status - Status text
     * @returns {string} HTML string
     */
    statusBadge(status) {
        const statusLower = (status || '').toLowerCase();
        
        let type = 'info';
        if (statusLower.includes('done') || statusLower.includes('paid') || 
            statusLower.includes('approved') || statusLower.includes('complete')) {
            type = 'success';
        } else if (statusLower.includes('progress') || statusLower.includes('pending') || 
                   statusLower.includes('under')) {
            type = 'warning';
        } else if (statusLower.includes('reject') || statusLower.includes('cancel') || 
                   statusLower.includes('fail')) {
            type = 'danger';
        }
        
        return this.badge(status || '-', type);
    },

    /**
     * Create header
     * @param {Object} options - Header options
     * @returns {string} HTML string
     */
    header({ title, subtitle, backLink = '', showExport = true }) {
        return `
            <header class="gradient-primary text-white py-4 px-6 shadow-lg">
                <div class="max-w-7xl mx-auto flex items-center justify-between">
                    <div class="flex items-center gap-4">
                        ${backLink ? `
                            <a href="${backLink}" class="text-white/80 hover:text-white transition">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                                </svg>
                            </a>
                        ` : ''}
                        <img src="assets/logo-white.svg" alt="NESMA" class="h-8 lg:h-10">
                        <div>
                            <h1 class="text-2xl font-bold">${title}</h1>
                            <p class="text-white/70 text-sm">${subtitle}</p>
                        </div>
                    </div>
                    ${showExport ? `
                        <button onclick="exportData()" class="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition flex items-center gap-2">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                            </svg>
                            <span>Export</span>
                        </button>
                    ` : ''}
                </div>
            </header>
        `;
    },

    /**
     * Create footer
     * @param {Object} options - Footer options
     * @returns {string} HTML string
     */
    footer({ text = 'SLA Management System - Nesma Technology & Industry', version = '' }) {
        return `
            <footer class="text-center py-6 text-gray-500 text-sm">
                <p>${text}</p>
                <p class="mt-1">Last Update: <span id="lastUpdate">-</span></p>
                ${version ? `<p class="mt-1 text-gray-400">${version}</p>` : ''}
            </footer>
        `;
    },

    /**
     * Create empty state
     * @param {string} message - Empty state message
     * @param {string} icon - Icon HTML or emoji
     * @returns {string} HTML string
     */
    emptyState(message = 'No data available', icon = '📋') {
        return `
            <div class="text-center py-12">
                <div class="text-6xl mb-4">${icon}</div>
                <p class="text-gray-500">${message}</p>
            </div>
        `;
    },

    /**
     * Create search input
     * @param {Object} options - Search options
     * @returns {string} HTML string
     */
    searchInput({ placeholder = 'Search...', onInput = 'searchRecords()' }) {
        return `
            <div class="relative flex-1">
                <input type="text" id="searchInput" onkeyup="${onInput}" 
                       placeholder="${placeholder}" 
                       class="filter-select w-full px-4 py-2 pl-10 rounded-lg outline-none">
                <svg class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" 
                     fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
            </div>
        `;
    },

    /**
     * Show/hide loading overlay
     * @param {boolean} show - Show or hide
     */
    toggleLoading(show) {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.style.display = show ? 'flex' : 'none';
        }
    },

    /**
     * Update loading text
     * @param {string} text - New loading text
     */
    setLoadingText(text) {
        const textElement = document.getElementById('loadingText');
        if (textElement) {
            textElement.textContent = text;
        }
    },

    /**
     * Capitalize first letter
     * @param {string} str - String to capitalize
     * @returns {string} Capitalized string
     */
    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UIComponents;
}
