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
        accent: '#1E3A5F',
        
        // Status Colors
        success: '#059669',
        successLight: '#D1FAE5',
        warning: '#D97706',
        warningLight: '#FEF3C7',
        danger: '#DC2626',
        dangerLight: '#FEE2E2',
        info: '#0284C7',
        infoLight: '#E0F2FE',
        
        // Neutral Colors
        gray: '#6B7280',
        grayLight: '#9CA3AF',
        light: '#F3F4F6',
        white: '#FFFFFF',
        black: '#111827'
    },

    // Chart Colors Palette - NESMA Brand
    chartColors: [
        '#2E3192',  // Primary Blue
        '#80D1E9',  // Secondary Cyan
        '#059669',  // Success Green
        '#D97706',  // Warning Amber
        '#7C3AED',  // Purple
        '#DC2626',  // Danger Red
        '#0284C7',  // Info Sky
        '#DB2777',  // Pink
        '#0D9488',  // Teal
        '#4F46E5',  // Indigo
        '#84CC16',  // Lime
        '#F97316'   // Orange
    ],

    // Gradients - NESMA Brand
    gradients: {
        primary: 'linear-gradient(135deg, #2E3192 0%, #0E2841 100%)',
        secondary: 'linear-gradient(135deg, #80D1E9 0%, #2E3192 100%)',
        header: 'linear-gradient(135deg, #2E3192 0%, #1E3A5F 50%, #0E2841 100%)',
        dark: 'linear-gradient(135deg, #0E2841 0%, #1E3A5F 50%, #0E2841 100%)',
        light: 'linear-gradient(180deg, #F9FAFB 0%, #F3F4F6 100%)',
        success: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
        logistics: 'linear-gradient(135deg, #2E3192 0%, #0E2841 100%)',
        warehouse: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
        procurement: 'linear-gradient(135deg, #2E3192 0%, #0E2841 100%)',
        facilities: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)'
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
            color: '#059669',
            gradient: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
            icon: 'archive',
            active: true
        },
        facilities: {
            name: 'Facilities Management',
            description: 'Buildings, Maintenance & Services',
            color: '#DC2626',
            gradient: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)',
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
