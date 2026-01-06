/**
 * NESMA Dashboard - Data Service
 * Centralized data fetching and management
 * @version 2.0.0
 */

class DataService {
    constructor() {
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    }

    /**
     * Fetch data from URL with caching
     * @param {string} url - URL to fetch
     * @param {boolean} useCache - Use cached data if available
     * @returns {Promise<Object>} Fetched data
     */
    async fetch(url, useCache = true) {
        // Check cache
        if (useCache && this.cache.has(url)) {
            const cached = this.cache.get(url);
            if (Date.now() - cached.timestamp < this.cacheTimeout) {
                return cached.data;
            }
        }

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            
            // Cache the data
            this.cache.set(url, {
                data,
                timestamp: Date.now()
            });
            
            return data;
        } catch (error) {
            console.error(`Error fetching ${url}:`, error);
            throw error;
        }
    }

    /**
     * Clear cache
     * @param {string} url - Specific URL to clear, or all if not provided
     */
    clearCache(url = null) {
        if (url) {
            this.cache.delete(url);
        } else {
            this.cache.clear();
        }
    }

    /**
     * Load transportation data
     * @returns {Promise<Object>} Transportation data
     */
    async loadTransportation() {
        return this.fetch('transportation_full_data.json');
    }

    /**
     * Load payments data
     * @returns {Promise<Object>} Payments data
     */
    async loadPayments() {
        return this.fetch('payments_full_data.json');
    }

    /**
     * Load procurement data
     * @returns {Promise<Object>} Procurement data
     */
    async loadProcurement() {
        return this.fetch('data/pr_data.json');
    }

    /**
     * Load vendor data
     * @returns {Promise<Object>} Vendor data
     */
    async loadVendors() {
        return this.fetch('data/vendor_data.json');
    }

    /**
     * Load warehouse data
     * @returns {Promise<Object>} Warehouse data
     */
    async loadWarehouse() {
        return this.fetch('data/warehouse_data.json');
    }
}

// Create singleton instance
const dataService = new DataService();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DataService, dataService };
}
