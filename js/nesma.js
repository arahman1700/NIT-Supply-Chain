/**
 * NESMA Dashboard - Main Entry Point
 * Combines all modules into a single namespace
 * @version 2.0.0
 */

(function(global) {
    'use strict';

    // Create main namespace
    const Nesma = {
        // Version info
        version: '2.0.0',
        
        // Core modules (loaded from separate files)
        Config: typeof NesmaConfig !== 'undefined' ? NesmaConfig : null,
        Translations: typeof NesmaTranslations !== 'undefined' ? NesmaTranslations : null,
        Helpers: typeof NesmaHelpers !== 'undefined' ? NesmaHelpers : null,
        
        // Component instances
        dataService: typeof dataService !== 'undefined' ? dataService : null,
        chartManager: typeof chartManager !== 'undefined' ? chartManager : null,
        
        // Component classes
        DataService: typeof DataService !== 'undefined' ? DataService : null,
        ChartManager: typeof ChartManager !== 'undefined' ? ChartManager : null,
        FilterManager: typeof FilterManager !== 'undefined' ? FilterManager : null,
        TableManager: typeof TableManager !== 'undefined' ? TableManager : null,
        BaseDashboard: typeof BaseDashboard !== 'undefined' ? BaseDashboard : null,
        
        // UI Components
        UI: typeof UIComponents !== 'undefined' ? UIComponents : null,

        /**
         * Initialize Nesma dashboard system
         * @param {Object} options - Initialization options
         */
        init(options = {}) {
            console.log(`NESMA Dashboard v${this.version} initialized`);
            
            // Set up global error handler
            this.setupErrorHandler();
            
            // Start time updater
            this.startTimeUpdater();
            
            // Initialize particles if needed
            if (options.particles) {
                this.initParticles();
            }
            
            return this;
        },

        /**
         * Set up global error handler
         */
        setupErrorHandler() {
            window.onerror = (msg, url, lineNo, columnNo, error) => {
                console.error('Dashboard Error:', {
                    message: msg,
                    url: url,
                    line: lineNo,
                    column: columnNo,
                    error: error
                });
                return false;
            };
        },

        /**
         * Start time updater for headers
         */
        startTimeUpdater() {
            const updateTime = () => {
                const timeElement = document.getElementById('currentTime');
                if (timeElement && this.Helpers) {
                    timeElement.textContent = this.Helpers.getCurrentTime();
                }
            };
            
            updateTime();
            setInterval(updateTime, 1000);
        },

        /**
         * Initialize particle animation
         * @param {string} containerId - Container element ID
         * @param {number} count - Number of particles
         */
        initParticles(containerId = 'particles', count = 25) {
            const container = document.getElementById(containerId);
            if (!container) return;

            for (let i = 0; i < count; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.animationDelay = Math.random() * 20 + 's';
                particle.style.animationDuration = (20 + Math.random() * 10) + 's';
                container.appendChild(particle);
            }
        },

        /**
         * Create a new dashboard instance
         * @param {string} type - Dashboard type
         * @param {Object} options - Dashboard options
         * @returns {BaseDashboard} Dashboard instance
         */
        createDashboard(type, options = {}) {
            if (!this.BaseDashboard) {
                console.error('BaseDashboard not loaded');
                return null;
            }

            const dashboard = new this.BaseDashboard({
                ...options,
                config: this.Config,
                translations: this.Translations
            });

            return dashboard;
        },

        /**
         * Load data from endpoint
         * @param {string} endpoint - Data endpoint key
         * @returns {Promise<Object>} Data
         */
        async loadData(endpoint) {
            if (!this.dataService) {
                console.error('DataService not loaded');
                return null;
            }

            const url = this.Config?.api?.endpoints?.[endpoint];
            if (!url) {
                console.error(`Endpoint '${endpoint}' not found in config`);
                return null;
            }

            return this.dataService.fetch(url);
        },

        /**
         * Format number using helpers
         * @param {number} num - Number to format
         * @param {number} decimals - Decimal places
         * @returns {string} Formatted number
         */
        formatNumber(num, decimals = 0) {
            return this.Helpers?.formatNumber(num, decimals) || num.toString();
        },

        /**
         * Format currency using helpers
         * @param {number} num - Number to format
         * @returns {string} Formatted currency
         */
        formatCurrency(num) {
            return this.Helpers?.formatCurrency(num) || num.toString();
        },

        /**
         * Get translation
         * @param {string} key - Translation key (dot notation)
         * @param {string} lang - Language code
         * @returns {string} Translation
         */
        t(key, lang = 'en') {
            if (!this.Translations) return key;
            
            const keys = key.split('.');
            let value = this.Translations[lang];
            
            for (const k of keys) {
                value = value?.[k];
                if (value === undefined) break;
            }
            
            return value || key;
        },

        /**
         * Show loading overlay
         * @param {boolean} show - Show or hide
         * @param {string} text - Loading text
         */
        showLoading(show, text = 'Loading...') {
            if (this.UI) {
                this.UI.toggleLoading(show);
                if (text) this.UI.setLoadingText(text);
            }
        },

        /**
         * Export data to CSV
         * @param {Array} data - Data to export
         * @param {string} filename - File name
         */
        exportCSV(data, filename) {
            if (this.Helpers) {
                this.Helpers.exportToCSV(data, filename);
            }
        },

        /**
         * Get status badge HTML
         * @param {string} status - Status text
         * @returns {string} Badge HTML
         */
        statusBadge(status) {
            return this.UI?.statusBadge(status) || status;
        }
    };

    // Expose to global scope
    global.Nesma = Nesma;

    // Auto-initialize on DOMContentLoaded
    document.addEventListener('DOMContentLoaded', () => {
        // Check if auto-init is disabled
        if (document.body.dataset.nesmaAutoInit !== 'false') {
            Nesma.init();
        }
    });

})(typeof window !== 'undefined' ? window : this);
