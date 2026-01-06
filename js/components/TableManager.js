/**
 * NESMA Dashboard - Table Manager
 * Centralized table rendering and pagination
 * @version 2.0.0
 */

class TableManager {
    constructor(options = {}) {
        this.recordsPerPage = options.recordsPerPage || 50;
        this.currentPage = 1;
        this.records = [];
        this.onPageChange = options.onPageChange || (() => {});
    }

    /**
     * Set records
     * @param {Array} records - Records array
     */
    setRecords(records) {
        this.records = records;
        this.currentPage = 1;
    }

    /**
     * Get paginated records
     * @returns {Object} Paginated records info
     */
    getPaginatedRecords() {
        const start = (this.currentPage - 1) * this.recordsPerPage;
        const end = start + this.recordsPerPage;
        
        return {
            records: this.records.slice(start, end),
            start,
            end: Math.min(end, this.records.length),
            total: this.records.length,
            currentPage: this.currentPage,
            totalPages: Math.ceil(this.records.length / this.recordsPerPage)
        };
    }

    /**
     * Go to page
     * @param {number} page - Page number
     */
    goToPage(page) {
        const totalPages = Math.ceil(this.records.length / this.recordsPerPage);
        
        if (page < 1 || page > totalPages) return;
        
        this.currentPage = page;
        this.onPageChange(this.getPaginatedRecords());
    }

    /**
     * Render pagination
     * @param {string} containerId - Container element ID
     * @param {Object} options - Pagination options
     */
    renderPagination(containerId, options = {}) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const { currentPage, totalPages } = this.getPaginatedRecords();
        
        if (totalPages <= 1) {
            container.innerHTML = '';
            return;
        }

        const prevText = options.prevText || 'Prev';
        const nextText = options.nextText || 'Next';
        
        let html = '';

        // Previous button
        html += `
            <button onclick="tableManager.goToPage(${currentPage - 1})" 
                    ${currentPage === 1 ? 'disabled' : ''} 
                    class="px-3 py-1 rounded border ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}">
                ${prevText}
            </button>
        `;

        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
                html += `
                    <button onclick="tableManager.goToPage(${i})" 
                            class="px-3 py-1 rounded ${i === currentPage ? 'bg-[#2e3192] text-white' : 'hover:bg-gray-100'}">
                        ${i}
                    </button>
                `;
            } else if (i === currentPage - 3 || i === currentPage + 3) {
                html += '<span class="px-2">...</span>';
            }
        }

        // Next button
        html += `
            <button onclick="tableManager.goToPage(${currentPage + 1})" 
                    ${currentPage === totalPages ? 'disabled' : ''} 
                    class="px-3 py-1 rounded border ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}">
                ${nextText}
            </button>
        `;

        container.innerHTML = html;
    }

    /**
     * Render table
     * @param {string} tbodyId - Table body element ID
     * @param {Array} columns - Column definitions
     * @param {Function} rowRenderer - Custom row renderer function
     */
    renderTable(tbodyId, columns, rowRenderer = null) {
        const tbody = document.getElementById(tbodyId);
        if (!tbody) return;

        const { records, start } = this.getPaginatedRecords();

        if (rowRenderer) {
            tbody.innerHTML = records.map((record, index) => 
                rowRenderer(record, start + index)
            ).join('');
        } else {
            tbody.innerHTML = records.map((record, index) => {
                const cells = columns.map(col => {
                    const value = record[col.field];
                    const formatted = col.formatter ? col.formatter(value, record) : value;
                    return `<td class="${col.class || 'px-3 py-2'}">${formatted || '-'}</td>`;
                }).join('');
                
                return `<tr class="border-b hover:bg-gray-50"><td class="px-3 py-2">${start + index + 1}</td>${cells}</tr>`;
            }).join('');
        }
    }

    /**
     * Render summary table
     * @param {string} tbodyId - Table body element ID
     * @param {Array} data - Aggregated data array
     * @param {Array} columns - Column definitions
     */
    renderSummaryTable(tbodyId, data, columns) {
        const tbody = document.getElementById(tbodyId);
        if (!tbody) return;

        tbody.innerHTML = data.map(row => {
            const cells = columns.map(col => {
                const value = row[col.field];
                const formatted = col.formatter ? col.formatter(value, row) : value;
                return `<td class="${col.class || 'px-4 py-3'}">${formatted || '-'}</td>`;
            }).join('');
            
            return `<tr class="border-b hover:bg-gray-50">${cells}</tr>`;
        }).join('');
    }

    /**
     * Update records count display
     * @param {string} showingId - Showing count element ID
     * @param {string} totalId - Total count element ID
     */
    updateRecordsCount(showingId, totalId) {
        const { end, total } = this.getPaginatedRecords();
        
        const showingElement = document.getElementById(showingId);
        const totalElement = document.getElementById(totalId);
        
        if (showingElement) showingElement.textContent = end;
        if (totalElement) totalElement.textContent = total;
    }

    /**
     * Sort records
     * @param {string} field - Field to sort by
     * @param {string} direction - 'asc' or 'desc'
     */
    sort(field, direction = 'desc') {
        this.records.sort((a, b) => {
            const valueA = a[field] || 0;
            const valueB = b[field] || 0;
            
            if (typeof valueA === 'string') {
                return direction === 'desc' 
                    ? valueB.localeCompare(valueA)
                    : valueA.localeCompare(valueB);
            }
            
            return direction === 'desc' ? valueB - valueA : valueA - valueB;
        });
        
        this.currentPage = 1;
    }
}

// Create global instance for pagination callbacks
let tableManager = null;

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TableManager;
}
