/**
 * NESMA Dashboard - Chart Manager
 * Centralized chart creation and management
 * @version 2.0.0
 */

class ChartManager {
    constructor() {
        this.charts = new Map();
        this.defaultOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        font: {
                            family: "'Inter', 'Cairo', sans-serif"
                        }
                    }
                },
                title: {
                    font: {
                        family: "'Inter', 'Cairo', sans-serif",
                        size: 16,
                        weight: 'bold'
                    }
                }
            }
        };
    }

    /**
     * Get chart colors
     * @param {number} count - Number of colors needed
     * @returns {Array} Array of colors
     */
    getColors(count = 8) {
        const palette = [
            '#2E3192', '#80D1E9', '#10B981', '#F59E0B',
            '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6',
            '#F97316', '#6366F1', '#84CC16', '#06B6D4'
        ];
        return palette.slice(0, count);
    }

    /**
     * Create or update chart
     * @param {string} id - Chart canvas ID
     * @param {string} type - Chart type
     * @param {Object} data - Chart data
     * @param {Object} options - Chart options
     * @returns {Chart} Chart instance
     */
    createChart(id, type, data, options = {}) {
        // Destroy existing chart
        this.destroyChart(id);

        const ctx = document.getElementById(id);
        if (!ctx) {
            console.error(`Canvas element with id '${id}' not found`);
            return null;
        }

        const mergedOptions = this.mergeOptions(this.defaultOptions, options);
        
        const chart = new Chart(ctx.getContext('2d'), {
            type,
            data,
            options: mergedOptions
        });

        this.charts.set(id, chart);
        return chart;
    }

    /**
     * Create doughnut chart
     * @param {string} id - Canvas ID
     * @param {Array} labels - Labels
     * @param {Array} data - Data values
     * @param {string} title - Chart title
     * @returns {Chart} Chart instance
     */
    createDoughnut(id, labels, data, title = '') {
        const colors = this.getColors(labels.length);
        
        return this.createChart(id, 'doughnut', {
            labels,
            datasets: [{
                data,
                backgroundColor: colors,
                borderWidth: 0
            }]
        }, {
            plugins: {
                legend: { position: 'left' },
                title: { display: !!title, text: title }
            }
        });
    }

    /**
     * Create pie chart
     * @param {string} id - Canvas ID
     * @param {Array} labels - Labels
     * @param {Array} data - Data values
     * @param {string} title - Chart title
     * @returns {Chart} Chart instance
     */
    createPie(id, labels, data, title = '') {
        const colors = this.getColors(labels.length);
        
        return this.createChart(id, 'pie', {
            labels,
            datasets: [{
                data,
                backgroundColor: colors
            }]
        }, {
            plugins: {
                legend: { position: 'right' },
                title: { display: !!title, text: title }
            }
        });
    }

    /**
     * Create bar chart
     * @param {string} id - Canvas ID
     * @param {Array} labels - Labels
     * @param {Array} data - Data values
     * @param {string} label - Dataset label
     * @param {Object} options - Additional options
     * @returns {Chart} Chart instance
     */
    createBar(id, labels, data, label = '', options = {}) {
        const defaultColor = '#2E3192';
        
        return this.createChart(id, 'bar', {
            labels,
            datasets: [{
                label,
                data,
                backgroundColor: options.color || defaultColor,
                borderRadius: 8
            }]
        }, {
            indexAxis: options.horizontal ? 'y' : 'x',
            plugins: {
                title: { display: !!options.title, text: options.title }
            },
            scales: {
                y: { beginAtZero: true }
            }
        });
    }

    /**
     * Create horizontal bar chart
     * @param {string} id - Canvas ID
     * @param {Array} labels - Labels
     * @param {Array} data - Data values
     * @param {string} label - Dataset label
     * @param {string} title - Chart title
     * @param {string} color - Bar color
     * @returns {Chart} Chart instance
     */
    createHorizontalBar(id, labels, data, label = '', title = '', color = '#2E3192') {
        return this.createBar(id, labels, data, label, {
            horizontal: true,
            title,
            color
        });
    }

    /**
     * Create line chart
     * @param {string} id - Canvas ID
     * @param {Array} labels - Labels
     * @param {Array} data - Data values
     * @param {string} label - Dataset label
     * @param {string} title - Chart title
     * @returns {Chart} Chart instance
     */
    createLine(id, labels, data, label = '', title = '') {
        return this.createChart(id, 'line', {
            labels,
            datasets: [{
                label,
                data,
                borderColor: '#2E3192',
                backgroundColor: 'rgba(46, 49, 146, 0.1)',
                fill: true,
                tension: 0.4
            }]
        }, {
            plugins: {
                title: { display: !!title, text: title }
            },
            scales: {
                y: { beginAtZero: true }
            }
        });
    }

    /**
     * Create multi-line chart
     * @param {string} id - Canvas ID
     * @param {Array} labels - Labels
     * @param {Array} datasets - Array of dataset objects
     * @param {string} title - Chart title
     * @returns {Chart} Chart instance
     */
    createMultiLine(id, labels, datasets, title = '') {
        const colors = this.getColors(datasets.length);
        
        const formattedDatasets = datasets.map((ds, i) => ({
            label: ds.label,
            data: ds.data,
            borderColor: colors[i],
            backgroundColor: `${colors[i]}20`,
            fill: ds.fill || false,
            tension: 0.4
        }));

        return this.createChart(id, 'line', {
            labels,
            datasets: formattedDatasets
        }, {
            plugins: {
                title: { display: !!title, text: title }
            },
            scales: {
                y: { beginAtZero: true }
            }
        });
    }

    /**
     * Destroy chart
     * @param {string} id - Chart ID
     */
    destroyChart(id) {
        if (this.charts.has(id)) {
            this.charts.get(id).destroy();
            this.charts.delete(id);
        }
    }

    /**
     * Destroy all charts
     */
    destroyAll() {
        this.charts.forEach(chart => chart.destroy());
        this.charts.clear();
    }

    /**
     * Update chart data
     * @param {string} id - Chart ID
     * @param {Object} newData - New data
     */
    updateChart(id, newData) {
        const chart = this.charts.get(id);
        if (chart) {
            chart.data = newData;
            chart.update();
        }
    }

    /**
     * Merge options deeply
     * @param {Object} target - Target options
     * @param {Object} source - Source options
     * @returns {Object} Merged options
     */
    mergeOptions(target, source) {
        const result = { ...target };
        
        for (const key in source) {
            if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                result[key] = this.mergeOptions(result[key] || {}, source[key]);
            } else {
                result[key] = source[key];
            }
        }
        
        return result;
    }
}

// Create singleton instance
const chartManager = new ChartManager();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ChartManager, chartManager };
}
