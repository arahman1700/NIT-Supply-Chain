/**
 * NESMA Dashboard - Translations
 * Centralized translations for all dashboards
 * @version 2.0.0
 */

const NesmaTranslations = {
    en: {
        // Common
        common: {
            all: 'All',
            search: 'Search...',
            export: 'Export',
            reset: 'Reset',
            loading: 'Loading data...',
            error: 'Error loading data',
            of: 'of',
            prev: 'Prev',
            next: 'Next',
            noData: 'No data available',
            lastUpdate: 'Last Update'
        },

        // Navigation
        nav: {
            home: 'Home',
            back: 'Back',
            supplyChain: 'Supply Chain Management'
        },

        // Filters
        filters: {
            title: 'Interactive Filters',
            project: 'Project',
            supplier: 'Supplier',
            equipment: 'Equipment',
            status: 'Status',
            rentType: 'Rent Type',
            dateFrom: 'From Date',
            dateTo: 'To Date',
            paymentStatus: 'Payment Status'
        },

        // Tabs
        tabs: {
            overview: 'Overview',
            suppliers: 'Suppliers',
            projects: 'Projects',
            equipment: 'Equipment',
            details: 'Details',
            prAnalysis: 'PR Analysis',
            vendorEval: 'Vendor Evaluation'
        },

        // KPIs - Transportation
        kpiTransportation: {
            totalOrders: 'Total Orders',
            totalAmount: 'Total Amount (SAR)',
            completed: 'Completed',
            inProgress: 'In Progress',
            avgDuration: 'Avg. Duration (Days)',
            completionRate: 'Completion Rate'
        },

        // KPIs - Payments
        kpiPayments: {
            totalInvoices: 'Total Invoices',
            totalAmount: 'Total Amount (SAR)',
            paid: 'Paid',
            underApproval: 'Under Approval',
            avgDays: 'Avg. Completion Days',
            paymentCycle: 'Payment Cycle (Days)'
        },

        // KPIs - Procurement
        kpiProcurement: {
            totalPRs: 'Total PRs',
            approved: 'Approved',
            returned: 'Returned',
            returnRate: 'Return Rate',
            avgProcessing: 'Avg. Processing Days'
        },

        // KPIs - Warehouse
        kpiWarehouse: {
            totalItems: 'Total Items',
            totalValue: 'Total Value (SAR)',
            lowStock: 'Low Stock',
            outOfStock: 'Out of Stock'
        },

        // Table Headers
        tableHeaders: {
            supplier: 'Supplier',
            orderCount: 'Order Count',
            invoiceCount: 'Invoice Count',
            totalAmount: 'Total Amount',
            avgAmount: 'Avg. Amount',
            percentage: 'Percentage',
            project: 'Project',
            avgDuration: 'Avg. Duration',
            avgCompletion: 'Avg. Completion',
            equipmentName: 'Equipment',
            count: 'Count',
            avgPrice: 'Avg. Price',
            jobOrder: 'Job Order',
            date: 'Date',
            amount: 'Amount'
        },

        // Charts
        charts: {
            statusDistribution: 'Status Distribution',
            monthlyTrend: 'Monthly Trend',
            supplierDistribution: 'Supplier Distribution',
            projectDistribution: 'Project Distribution',
            paymentStatus: 'Payment Status'
        },

        // Footer
        footer: {
            system: 'SLA Management System - Nesma Technology & Industry',
            copyright: 'NESMA Infrastructure & Technology'
        },

        // Portal
        portal: {
            title: 'Supply Chain Management Portal',
            subtitle: 'Integrated Operations Management System',
            selectDepartment: 'Select a department to access dashboards',
            enter: 'Enter',
            active: 'Active',
            comingSoon: 'Coming Soon',
            underDevelopment: 'Under Development'
        },

        // Departments
        departments: {
            logistics: {
                name: 'Logistics',
                description: 'Transportation, equipment, shipments & performance tracking'
            },
            procurement: {
                name: 'Procurement',
                description: 'PR Analysis & Vendor Evaluation'
            },
            warehouse: {
                name: 'Warehouse',
                description: 'Inventory, Materials & Stock Management'
            },
            facilities: {
                name: 'Facilities Management',
                description: 'Buildings, maintenance & services management'
            }
        },

        // Status
        status: {
            done: 'Done',
            inProgress: 'In Progress',
            pending: 'Pending',
            approved: 'Approved',
            rejected: 'Rejected',
            returned: 'Returned',
            paid: 'Paid'
        }
    },

    ar: {
        // Common
        common: {
            all: 'الكل',
            search: 'بحث...',
            export: 'تصدير',
            reset: 'إعادة تعيين',
            loading: 'جاري تحميل البيانات...',
            error: 'خطأ في تحميل البيانات',
            of: 'من',
            prev: 'السابق',
            next: 'التالي',
            noData: 'لا توجد بيانات',
            lastUpdate: 'آخر تحديث'
        },

        // Navigation
        nav: {
            home: 'الرئيسية',
            back: 'رجوع',
            supplyChain: 'إدارة سلسلة التوريد'
        },

        // Filters
        filters: {
            title: 'الفلاتر التفاعلية',
            project: 'المشروع',
            supplier: 'المورد',
            equipment: 'المعدات',
            status: 'الحالة',
            rentType: 'نوع الإيجار',
            dateFrom: 'من تاريخ',
            dateTo: 'إلى تاريخ',
            paymentStatus: 'حالة الدفع'
        },

        // Tabs
        tabs: {
            overview: 'نظرة عامة',
            suppliers: 'الموردين',
            projects: 'المشاريع',
            equipment: 'المعدات',
            details: 'التفاصيل',
            prAnalysis: 'تحليل طلبات الشراء',
            vendorEval: 'تقييم الموردين'
        },

        // KPIs - Transportation
        kpiTransportation: {
            totalOrders: 'إجمالي الطلبات',
            totalAmount: 'إجمالي المبلغ (ريال)',
            completed: 'مكتملة',
            inProgress: 'قيد التنفيذ',
            avgDuration: 'متوسط المدة (يوم)',
            completionRate: 'معدل الإنجاز'
        },

        // KPIs - Payments
        kpiPayments: {
            totalInvoices: 'إجمالي الفواتير',
            totalAmount: 'إجمالي المبلغ (ريال)',
            paid: 'مدفوعة',
            underApproval: 'قيد الموافقة',
            avgDays: 'متوسط أيام الإنجاز',
            paymentCycle: 'دورة الدفع (يوم)'
        },

        // KPIs - Procurement
        kpiProcurement: {
            totalPRs: 'إجمالي طلبات الشراء',
            approved: 'معتمدة',
            returned: 'مرجعة',
            returnRate: 'معدل الإرجاع',
            avgProcessing: 'متوسط أيام المعالجة'
        },

        // KPIs - Warehouse
        kpiWarehouse: {
            totalItems: 'إجمالي الأصناف',
            totalValue: 'إجمالي القيمة (ريال)',
            lowStock: 'مخزون منخفض',
            outOfStock: 'نفاد المخزون'
        },

        // Table Headers
        tableHeaders: {
            supplier: 'المورد',
            orderCount: 'عدد الطلبات',
            invoiceCount: 'عدد الفواتير',
            totalAmount: 'إجمالي المبلغ',
            avgAmount: 'متوسط المبلغ',
            percentage: 'النسبة',
            project: 'المشروع',
            avgDuration: 'متوسط المدة',
            avgCompletion: 'متوسط الإنجاز',
            equipmentName: 'المعدة',
            count: 'العدد',
            avgPrice: 'متوسط السعر',
            jobOrder: 'رقم الأمر',
            date: 'التاريخ',
            amount: 'المبلغ'
        },

        // Charts
        charts: {
            statusDistribution: 'توزيع الحالات',
            monthlyTrend: 'الاتجاه الشهري',
            supplierDistribution: 'توزيع الموردين',
            projectDistribution: 'توزيع المشاريع',
            paymentStatus: 'حالة الدفعات'
        },

        // Footer
        footer: {
            system: 'نظام إدارة اتفاقيات مستوى الخدمة - نسما للتكنولوجيا والصناعة',
            copyright: 'نسما للبنية التحتية والتقنية'
        },

        // Portal
        portal: {
            title: 'بوابة إدارة سلسلة التوريد',
            subtitle: 'نظام إدارة العمليات المتكامل',
            selectDepartment: 'اختر قسم للوصول إلى لوحات التحكم',
            enter: 'دخول',
            active: 'نشط',
            comingSoon: 'قريباً',
            underDevelopment: 'تحت التطوير'
        },

        // Departments
        departments: {
            logistics: {
                name: 'اللوجستيات',
                description: 'النقل والمعدات والشحنات وتتبع الأداء'
            },
            procurement: {
                name: 'المشتريات',
                description: 'تحليل طلبات الشراء وتقييم الموردين'
            },
            warehouse: {
                name: 'المستودعات',
                description: 'إدارة المخزون والمواد'
            },
            facilities: {
                name: 'إدارة المرافق',
                description: 'إدارة المباني والصيانة والخدمات'
            }
        },

        // Status
        status: {
            done: 'مكتمل',
            inProgress: 'قيد التنفيذ',
            pending: 'معلق',
            approved: 'معتمد',
            rejected: 'مرفوض',
            returned: 'مرجع',
            paid: 'مدفوع'
        }
    }
};

// Freeze translations
Object.freeze(NesmaTranslations);

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NesmaTranslations;
}
