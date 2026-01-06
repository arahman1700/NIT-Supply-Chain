/**
 * NESMA Dashboard - Helper Utilities
 * Common utility functions used across all dashboards
 * @version 2.0.0
 */

const NesmaHelpers = {
    /**
     * Format number with locale
     * @param {number} num - Number to format
     * @param {number} decimals - Decimal places
     * @returns {string} Formatted number
     */
    formatNumber(num, decimals = 0) {
        if (num === null || num === undefined || isNaN(num)) return '0';
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        }).format(num);
    },

    /**
     * Format currency (SAR)
     * @param {number} num - Number to format
     * @returns {string} Formatted currency
     */
    formatCurrency(num) {
        if (num === null || num === undefined || isNaN(num)) return '0';
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(num);
    },

    /**
     * Format large numbers (K, M, B)
     * @param {number} num - Number to format
     * @returns {string} Formatted number with suffix
     */
    formatCompact(num) {
        if (num === null || num === undefined || isNaN(num)) return '0';
        
        if (num >= 1000000000) {
            return (num / 1000000000).toFixed(1) + 'B';
        }
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    },

    /**
     * Format date
     * @param {string} dateStr - Date string
     * @param {string} format - Output format
     * @returns {string} Formatted date
     */
    formatDate(dateStr, format = 'short') {
        if (!dateStr) return '-';
        
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr;

        const options = {
            short: { year: 'numeric', month: 'short', day: 'numeric' },
            long: { year: 'numeric', month: 'long', day: 'numeric' },
            monthYear: { year: 'numeric', month: 'short' }
        };

        return date.toLocaleDateString('en-US', options[format] || options.short);
    },

    /**
     * Get current time in Riyadh timezone
     * @returns {string} Formatted time
     */
    getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
            timeZone: 'Asia/Riyadh'
        });
    },

    /**
     * Calculate percentage
     * @param {number} value - Current value
     * @param {number} total - Total value
     * @param {number} decimals - Decimal places
     * @returns {number} Percentage
     */
    calculatePercentage(value, total, decimals = 1) {
        if (!total || total === 0) return 0;
        return parseFloat(((value / total) * 100).toFixed(decimals));
    },

    /**
     * Debounce function
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in ms
     * @returns {Function} Debounced function
     */
    debounce(func, wait = 300) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Throttle function
     * @param {Function} func - Function to throttle
     * @param {number} limit - Time limit in ms
     * @returns {Function} Throttled function
     */
    throttle(func, limit = 100) {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func(...args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    /**
     * Deep clone object
     * @param {Object} obj - Object to clone
     * @returns {Object} Cloned object
     */
    deepClone(obj) {
        if (obj === null || typeof obj !== 'object') return obj;
        return JSON.parse(JSON.stringify(obj));
    },

    /**
     * Group array by key
     * @param {Array} array - Array to group
     * @param {string} key - Key to group by
     * @returns {Object} Grouped object
     */
    groupBy(array, key) {
        return array.reduce((result, item) => {
            const groupKey = item[key] || 'Unknown';
            if (!result[groupKey]) {
                result[groupKey] = [];
            }
            result[groupKey].push(item);
            return result;
        }, {});
    },

    /**
     * Sort array by key
     * @param {Array} array - Array to sort
     * @param {string} key - Key to sort by
     * @param {string} direction - 'asc' or 'desc'
     * @returns {Array} Sorted array
     */
    sortBy(array, key, direction = 'desc') {
        return [...array].sort((a, b) => {
            const valueA = a[key] || 0;
            const valueB = b[key] || 0;
            return direction === 'desc' ? valueB - valueA : valueA - valueB;
        });
    },

    /**
     * Aggregate data by key
     * @param {Array} array - Array to aggregate
     * @param {string} groupKey - Key to group by
     * @param {string} sumKey - Key to sum
     * @returns {Object} Aggregated data
     */
    aggregate(array, groupKey, sumKey) {
        const result = {};
        array.forEach(item => {
            const key = item[groupKey] || 'Unknown';
            if (!result[key]) {
                result[key] = { count: 0, total: 0 };
            }
            result[key].count++;
            result[key].total += item[sumKey] || 0;
        });
        return result;
    },

    /**
     * Generate unique ID
     * @returns {string} Unique ID
     */
    generateId() {
        return 'id_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    /**
     * Check if element is in viewport
     * @param {HTMLElement} element - Element to check
     * @returns {boolean} Is in viewport
     */
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    /**
     * Download data as CSV
     * @param {Array} data - Data to export
     * @param {string} filename - File name
     */
    exportToCSV(data, filename = 'export.csv') {
        if (!data || data.length === 0) return;

        const headers = Object.keys(data[0]);
        const csvContent = [
            headers.join(','),
            ...data.map(row => 
                headers.map(header => {
                    const value = row[header];
                    // Escape quotes and wrap in quotes
                    return `"${String(value || '').replace(/"/g, '""')}"`;
                }).join(',')
            )
        ].join('\n');

        const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
        URL.revokeObjectURL(link.href);
    },

    /**
     * Get status badge class
     * @param {string} status - Status string
     * @returns {string} CSS class
     */
    getStatusBadgeClass(status) {
        const statusLower = (status || '').toLowerCase();
        
        if (statusLower.includes('done') || statusLower.includes('paid') || 
            statusLower.includes('approved') || statusLower.includes('complete')) {
            return 'badge-success';
        }
        if (statusLower.includes('progress') || statusLower.includes('pending') || 
            statusLower.includes('under')) {
            return 'badge-warning';
        }
        if (statusLower.includes('reject') || statusLower.includes('cancel') || 
            statusLower.includes('fail')) {
            return 'badge-danger';
        }
        return 'badge-info';
    },

    /**
     * Parse query string
     * @param {string} queryString - Query string
     * @returns {Object} Parsed parameters
     */
    parseQueryString(queryString = window.location.search) {
        const params = {};
        new URLSearchParams(queryString).forEach((value, key) => {
            params[key] = value;
        });
        return params;
    },

    /**
     * Set query string
     * @param {Object} params - Parameters to set
     */
    setQueryString(params) {
        const url = new URL(window.location);
        Object.entries(params).forEach(([key, value]) => {
            if (value) {
                url.searchParams.set(key, value);
            } else {
                url.searchParams.delete(key);
            }
        });
        window.history.replaceState({}, '', url);
    },

    /**
     * Local storage helper
     */
    storage: {
        get(key, defaultValue = null) {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            } catch {
                return defaultValue;
            }
        },
        set(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch {
                return false;
            }
        },
        remove(key) {
            try {
                localStorage.removeItem(key);
                return true;
            } catch {
                return false;
            }
        }
    }
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NesmaHelpers;
}
