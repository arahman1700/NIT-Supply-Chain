/**
 * NESMA Dashboard - Configuration
 * Central configuration for all dashboards
 * Based on NIT Brand Identity 2025
 * @version 2.1.0
 */

const NesmaConfig = {
    // Application Info
    app: {
        name: 'NESMA Supply Chain Management',
        version: '2.1.0',
        company: 'NESMA Infrastructure & Technology',
        copyright: 'NESMA Infrastructure & Technology',
        year: 2026
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

    // Theme Colors - NESMA Brand Identity 2025
    colors: {
        // Primary Brand
        primary: '#2E3192',
        secondary: '#80D1E9',
        dark: '#0E2841',
        accent: '#203366',
        
        // Status Colors
        success: '#10B981',
        successLight: '#D1FAE5',
        warning: '#F59E0B',
        warningLight: '#FEF3C7',
        danger: '#EF4444',
        dangerLight: '#FEE2E2',
        info: '#80D1E9',
        infoLight: '#E0F7FA',
        
        // Neutral Colors
        gray: '#6B7280',
        grayLight: '#B3B3B3',
        light: '#E8E8E8',
        white: '#FFFFFF',
        black: '#111827'
    },

    // Chart Colors Palette - NESMA Brand
    chartColors: [
        '#2E3192',  // Primary Blue
        '#80D1E9',  // Secondary Cyan
        '#10B981',  // Success Green
        '#F59E0B',  // Warning Amber
        '#0E2841',  // Dark Navy
        '#EF4444',  // Danger Red
        '#203366',  // Medium Blue
        '#B3B3B3',  // Gray
        '#0E2841',  // Dark Navy (alt)
        '#2E3192',  // Primary Blue (alt)
        '#10B981',  // Success Green (alt)
        '#F59E0B'   // Warning Amber (alt)
    ],

    // Gradients - NESMA Brand
    gradients: {
        primary: 'linear-gradient(135deg, #2E3192 0%, #0E2841 100%)',
        secondary: 'linear-gradient(135deg, #80D1E9 0%, #2E3192 100%)',
        header: 'linear-gradient(135deg, #2E3192 0%, #203366 50%, #0E2841 100%)',
        dark: 'linear-gradient(135deg, #0E2841 0%, #203366 50%, #0E2841 100%)',
        light: 'linear-gradient(180deg, #E8E8E8 0%, #F5F5F5 100%)',
        success: 'linear-gradient(135deg, #10B981 0%, #0E2841 100%)',
        logistics: 'linear-gradient(135deg, #2E3192 0%, #0E2841 100%)',
        warehouse: 'linear-gradient(135deg, #10B981 0%, #0E2841 100%)',
        procurement: 'linear-gradient(135deg, #2E3192 0%, #0E2841 100%)',
        facilities: 'linear-gradient(135deg, #EF4444 0%, #0E2841 100%)'
    },

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

    // Language - Fixed to English
    language: {
        default: 'en',
        current: 'en'
    },

    // Dashboard Types
    dashboards: {
        logistics: {
            name: 'Logistics',
            description: 'Transportation, Equipment & Performance',
            color: '#2E3192',
            gradient: 'linear-gradient(135deg, #2E3192 0%, #0E2841 100%)',
            icon: 'truck',
            active: true
        },
        procurement: {
            name: 'Procurement',
            description: 'PR Analysis & Vendor Evaluation',
            color: '#2E3192',
            gradient: 'linear-gradient(135deg, #2E3192 0%, #0E2841 100%)',
            icon: 'shopping-bag',
            active: true
        },
        warehouse: {
            name: 'Warehouse',
            description: 'Inventory & Materials Management',
            color: '#10B981',
            gradient: 'linear-gradient(135deg, #10B981 0%, #0E2841 100%)',
            icon: 'archive',
            active: true
        },
        facilities: {
            name: 'Facilities Management',
            description: 'Buildings, Maintenance & Services',
            color: '#EF4444',
            gradient: 'linear-gradient(135deg, #EF4444 0%, #0E2841 100%)',
            icon: 'building',
            active: false
        }
    },

    // Feature Flags
    features: {
        enableExport: true,
        enableSearch: true,
        enableFilters: true,
        enableCharts: true,
        enablePagination: true,
        enableRealTimeSync: false,
        enableSettings: true
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
