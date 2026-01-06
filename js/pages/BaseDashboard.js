/**
 * NESMA Dashboard - Base Dashboard Class
 * Foundation for all dashboard pages
 * @version 2.0.0
 */

class BaseDashboard {
    constructor(options = {}) {
        this.options = {
            dataUrl: '',
            translations: NesmaTranslations,
            config: NesmaConfig,
            lang: 'en',
            ...options
        };

        this.data = null;
        this.filteredRecords = [];
        this.currentPage = 1;
        this.recordsPerPage = this.options.config.pagination.recordsPerPage;
        this.charts = {};

        // Initialize managers
        this.dataService = dataService;
        this.chartManager = chartManager;
        this.filterManager = null;
        this.tableManager = null;

        // Bind methods
        this.init = this.init.bind(this);
        this.loadData = this.loadData.bind(this);
        this.applyFilters = this.applyFilters.bind(this);
        this.resetFilters = this.resetFilters.bind(this);
        this.updateDashboard = this.updateDashboard.bind(this);
        this.exportData = this.exportData.bind(this);
    }

    /**
     * Initialize dashboard
     */
    async init() {
        try {
            this.showLoading(true);
            await this.loadData();
            this.initializeFilters();
            this.initializeManagers();
            this.updateDashboard();
            this.setupEventListeners();
            this.updateLastUpdate();
            this.showLoading(false);
        } catch (error) {
            console.error('Dashboard initialization error:', error);
            this.showError('Error loading dashboard');
        }
    }

    /**
     * Load data from source
     */
    async loadData() {
        if (!this.options.dataUrl) {
            throw new Error('Data URL not specified');
        }
        this.data = await this.dataService.fetch(this.options.dataUrl);
        this.filteredRecords = [...(this.data.records || [])];
    }

    /**
     * Initialize filter manager
     */
    initializeFilters() {
        if (!this.data?.filters) return;

        this.filterManager = new FilterManager({
            onFilterChange: (records) => {
                this.filteredRecords = records;
                this.currentPage = 1;
                this.updateDashboard();
            },
            translations: this.getTranslations().common
        });

        this.filterManager.init(this.data.filters, this.data.records || []);
    }

    /**
     * Initialize table manager
     */
    initializeManagers() {
        this.tableManager = new TableManager({
            recordsPerPage: this.recordsPerPage,
            onPageChange: () => this.updateDetailsTable()
        });

        // Set global reference for pagination
        window.tableManager = this.tableManager;
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Search input
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('keyup', NesmaHelpers.debounce(() => {
                this.searchRecords(searchInput.value);
            }, 300));
        }

        // Filter selects
        document.querySelectorAll('[id^="filter"]').forEach(element => {
            element.addEventListener('change', () => this.applyFilters());
        });

        // Expose methods globally for inline handlers
        window.applyFilters = this.applyFilters;
        window.resetFilters = this.resetFilters;
        window.exportData = this.exportData;
        window.switchTab = this.switchTab.bind(this);
        window.goToPage = (page) => {
            this.tableManager.goToPage(page);
            this.updateDetailsTable();
        };
    }

    /**
     * Apply filters
     */
    applyFilters() {
        if (this.filterManager) {
            this.filterManager.applyFilters(this.getFilterConfig());
        }
    }

    /**
     * Get filter configuration
     * Override in child classes
     */
    getFilterConfig() {
        return {};
    }

    /**
     * Reset filters
     */
    resetFilters() {
        if (this.filterManager) {
            this.filterManager.reset();
        }
    }

    /**
     * Search records
     */
    searchRecords(query) {
        if (this.filterManager) {
            this.filterManager.search(query, this.getSearchFields());
        }
    }

    /**
     * Get search fields
     * Override in child classes
     */
    getSearchFields() {
        return [];
    }

    /**
     * Update dashboard
     */
    updateDashboard() {
        this.updateKPIs();
        this.updateCharts();
        this.updateTables();
    }

    /**
     * Update KPIs
     * Override in child classes
     */
    updateKPIs() {}

    /**
     * Update charts
     * Override in child classes
     */
    updateCharts() {}

    /**
     * Update tables
     * Override in child classes
     */
    updateTables() {
        this.tableManager.setRecords(this.filteredRecords);
        this.updateDetailsTable();
    }

    /**
     * Update details table
     * Override in child classes
     */
    updateDetailsTable() {}

    /**
     * Switch tab
     */
    switchTab(tabName) {
        document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
        document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));

        const content = document.getElementById(tabName + 'Content');
        if (content) content.classList.remove('hidden');

        const tab = document.querySelector(`[onclick*="switchTab('${tabName}')"]`);
        if (tab) tab.classList.add('active');
    }

    /**
     * Export data to CSV
     */
    exportData() {
        const data = this.getExportData();
        if (data && data.length > 0) {
            NesmaHelpers.exportToCSV(data, this.getExportFilename());
        }
    }

    /**
     * Get export data
     * Override in child classes
     */
    getExportData() {
        return this.filteredRecords;
    }

    /**
     * Get export filename
     * Override in child classes
     */
    getExportFilename() {
        return 'export.csv';
    }

    /**
     * Get translations
     */
    getTranslations() {
        return this.options.translations[this.options.lang] || this.options.translations.en;
    }

    /**
     * Show/hide loading
     */
    showLoading(show) {
        UIComponents.toggleLoading(show);
    }

    /**
     * Show error message
     */
    showError(message) {
        UIComponents.setLoadingText(message);
    }

    /**
     * Update last update timestamp
     */
    updateLastUpdate() {
        const element = document.getElementById('lastUpdate');
        if (element && this.data?.metadata?.last_update) {
            element.textContent = this.data.metadata.last_update;
        }
    }

    /**
     * Aggregate data
     */
    aggregateData(groupKey, sumKey) {
        return NesmaHelpers.aggregate(this.filteredRecords, groupKey, sumKey);
    }

    /**
     * Get sorted aggregation
     */
    getSortedAggregation(groupKey, sumKey, sortBy = 'total', limit = 10) {
        const aggregated = this.aggregateData(groupKey, sumKey);
        return Object.entries(aggregated)
            .sort((a, b) => b[1][sortBy] - a[1][sortBy])
            .slice(0, limit);
    }

    /**
     * Destroy dashboard
     */
    destroy() {
        this.chartManager.destroyAll();
        this.data = null;
        this.filteredRecords = [];
    }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BaseDashboard;
}
