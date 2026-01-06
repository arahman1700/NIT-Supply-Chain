/**
 * NESMA Dashboard - Configuration
 * Central configuration for all dashboards
 * @version 2.0.0
 */

const NesmaConfig = {
    // Application Info
    app: {
        name: 'NESMA Supply Chain Management',
        version: '2.0.0',
        company: 'NESMA Infrastructure & Technology'
    },

    // API Endpoints (for future Smartsheet integration)
    api: {
        baseUrl: '',
        endpoints: {
            transportation: 'transportation_full_data.json',
            payments: 'payments_full_data.json',
            procurement: 'data/pr_data.json',
            vendors: 'data/vendor_data.json',
            warehouse: 'data/warehouse_data.json'
        }
    },

    // Theme Colors
    colors: {
        primary: '#2E3192',
        secondary: '#80D1E9',
        dark: '#0E2841',
        accent: '#203366',
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
        info: '#3B82F6',
        gray: '#B3B3B3',
        light: '#E8E8E8'
    },

    // Chart Colors Palette
    chartColors: [
        '#2E3192', '#80D1E9', '#10B981', '#F59E0B', 
        '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6',
        '#F97316', '#6366F1', '#84CC16', '#06B6D4'
    ],

    // Pagination
    pagination: {
        recordsPerPage: 50,
        maxVisiblePages: 5
    },

    // Date/Time
    dateTime: {
        timezone: 'Asia/Riyadh',
        locale: 'en-US',
        dateFormat: 'YYYY-MM-DD'
    },

    // Dashboard Types
    dashboards: {
        logistics: {
            name: 'Logistics',
            color: '#2E3192',
            gradient: 'linear-gradient(135deg, #2E3192 0%, #0E2841 100%)'
        },
        procurement: {
            name: 'Procurement',
            color: '#059669',
            gradient: 'linear-gradient(135deg, #059669 0%, #064E3B 100%)'
        },
        warehouse: {
            name: 'Warehouse',
            color: '#059669',
            gradient: 'linear-gradient(135deg, #059669 0%, #064E3B 100%)'
        },
        facilities: {
            name: 'Facilities',
            color: '#DC2626',
            gradient: 'linear-gradient(135deg, #DC2626 0%, #F97316 100%)'
        }
    },

    // Feature Flags
    features: {
        enableExport: true,
        enableSearch: true,
        enableFilters: true,
        enableCharts: true,
        enablePagination: true,
        enableRealTimeSync: false
    }
};

// Freeze config to prevent modifications
Object.freeze(NesmaConfig);
Object.freeze(NesmaConfig.app);
Object.freeze(NesmaConfig.api);
Object.freeze(NesmaConfig.colors);
Object.freeze(NesmaConfig.chartColors);
Object.freeze(NesmaConfig.pagination);
Object.freeze(NesmaConfig.dateTime);
Object.freeze(NesmaConfig.dashboards);
Object.freeze(NesmaConfig.features);

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NesmaConfig;
}
