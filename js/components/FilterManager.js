/**
 * NESMA Dashboard - Filter Manager
 * Centralized filter management for dashboards
 * @version 2.0.0
 */

class FilterManager {
    constructor(options = {}) {
        this.filters = {};
        this.records = [];
        this.filteredRecords = [];
        this.onFilterChange = options.onFilterChange || (() => {});
        this.translations = options.translations || { all: 'All' };
    }

    /**
     * Initialize filters with data
     * @param {Object} filterData - Filter options from data
     * @param {Array} records - All records
     */
    init(filterData, records) {
        this.records = records;
        this.filteredRecords = [...records];
        
        // Populate filter dropdowns
        Object.entries(filterData).forEach(([key, values]) => {
            const selectElement = document.getElementById(`filter${this.capitalize(key)}`);
            if (selectElement && Array.isArray(values)) {
                this.populateSelect(selectElement, values);
            }
        });
    }

    /**
     * Populate select element
     * @param {HTMLSelectElement} select - Select element
     * @param {Array} options - Options array
     */
    populateSelect(select, options) {
        select.innerHTML = `<option value="">${this.translations.all || 'All'}</option>`;
        options.forEach(option => {
            if (option) {
                select.innerHTML += `<option value="${option}">${option}</option>`;
            }
        });
    }

    /**
     * Get current filter values
     * @returns {Object} Current filter values
     */
    getFilterValues() {
        const values = {};
        document.querySelectorAll('[id^="filter"]').forEach(element => {
            const key = element.id.replace('filter', '').toLowerCase();
            values[key] = element.value;
        });
        return values;
    }

    /**
     * Apply filters to records
     * @param {Object} filterConfig - Filter configuration
     * @returns {Array} Filtered records
     */
    applyFilters(filterConfig = {}) {
        const filterValues = this.getFilterValues();
        
        this.filteredRecords = this.records.filter(record => {
            for (const [key, config] of Object.entries(filterConfig)) {
                const filterValue = filterValues[key.toLowerCase()];
                if (filterValue) {
                    const recordValue = record[config.field];
                    
                    if (config.type === 'date-from' && recordValue < filterValue) {
                        return false;
                    }
                    if (config.type === 'date-to' && recordValue > filterValue) {
                        return false;
                    }
                    if (config.type === 'exact' && recordValue !== filterValue) {
                        return false;
                    }
                    if (config.type === 'contains' && !recordValue?.includes(filterValue)) {
                        return false;
                    }
                }
            }
            return true;
        });

        this.onFilterChange(this.filteredRecords);
        this.updateActiveFilters(filterValues);
        return this.filteredRecords;
    }

    /**
     * Reset all filters
     */
    reset() {
        document.querySelectorAll('[id^="filter"]').forEach(element => {
            element.value = '';
        });
        
        this.filteredRecords = [...this.records];
        this.onFilterChange(this.filteredRecords);
        this.updateActiveFilters({});
    }

    /**
     * Update active filters display
     * @param {Object} filterValues - Current filter values
     */
    updateActiveFilters(filterValues) {
        const container = document.getElementById('activeFilters');
        if (!container) return;

        const activeFilters = Object.entries(filterValues)
            .filter(([_, value]) => value)
            .map(([key, value]) => ({ key, value }));

        if (activeFilters.length === 0) {
            container.classList.add('hidden');
            return;
        }

        container.classList.remove('hidden');
        container.innerHTML = activeFilters
            .map(f => `<span class="badge badge-info">${this.capitalize(f.key)}: ${f.value}</span>`)
            .join('');
    }

    /**
     * Search records
     * @param {string} query - Search query
     * @param {Array} searchFields - Fields to search
     * @returns {Array} Filtered records
     */
    search(query, searchFields = []) {
        if (!query) {
            return this.applyFilters();
        }

        const lowerQuery = query.toLowerCase();
        
        this.filteredRecords = this.records.filter(record => {
            const searchText = searchFields
                .map(field => record[field])
                .filter(Boolean)
                .join(' ')
                .toLowerCase();
            
            return searchText.includes(lowerQuery);
        });

        this.onFilterChange(this.filteredRecords);
        return this.filteredRecords;
    }

    /**
     * Get filtered records
     * @returns {Array} Filtered records
     */
    getFilteredRecords() {
        return this.filteredRecords;
    }

    /**
     * Capitalize first letter
     * @param {string} str - String to capitalize
     * @returns {string} Capitalized string
     */
    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FilterManager;
}
