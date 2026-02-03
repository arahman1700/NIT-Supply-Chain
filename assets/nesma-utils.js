/**
 * NESMA Dashboard Shared Utilities v1.0
 * Theme Toggle, Export (PDF/Excel/CSV), Detail Modal, Chart Drill-down
 */

// ============================================
// THEME MANAGEMENT
// ============================================
const NesmaTheme = {
    storageKey: 'nesma-theme',

    init() {
        const saved = localStorage.getItem(this.storageKey);
        if (saved) {
            document.documentElement.setAttribute('data-theme', saved);
        }
        this.updateToggleIcon();
        this.updateChartDefaults();
        this.ensureParticlesContainer();
        this.updateParticles();
    },

    toggle() {
        const current = document.documentElement.getAttribute('data-theme');
        var next;
        if (current === 'dark') next = 'nit';
        else if (current === 'nit') next = 'light';
        else next = 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem(this.storageKey, next);
        this.updateToggleIcon();
        this.updateChartDefaults();
        this.updateParticles();
        if (typeof Chart !== 'undefined') {
            Chart.helpers.each(Chart.instances, (chart) => {
                if (chart) {
                    this.applyThemeToChart(chart);
                    chart.update('none');
                }
            });
        }
    },

    isDark() {
        var theme = document.documentElement.getAttribute('data-theme');
        return theme === 'dark' || theme === 'nit';
    },

    isNit() {
        return document.documentElement.getAttribute('data-theme') === 'nit';
    },

    updateToggleIcon() {
        var btn = document.getElementById('themeToggleBtn') || document.getElementById('themeToggle');
        if (!btn) return;
        btn.textContent = '';
        var theme = document.documentElement.getAttribute('data-theme');
        var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('class', 'w-5 h-5');
        svg.setAttribute('fill', 'none');
        svg.setAttribute('stroke', 'currentColor');
        svg.setAttribute('viewBox', '0 0 24 24');
        var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('stroke-linecap', 'round');
        path.setAttribute('stroke-linejoin', 'round');
        path.setAttribute('stroke-width', '2');
        if (theme === 'nit') {
            // NIT mode: sparkles icon (click goes to light)
            path.setAttribute('d', 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z');
        } else if (theme === 'dark') {
            // Dark mode: sun icon (click goes to NIT)
            path.setAttribute('d', 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z');
        } else {
            // Light mode: moon icon (click goes to dark)
            path.setAttribute('d', 'M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z');
        }
        svg.appendChild(path);
        btn.appendChild(svg);
    },

    updateChartDefaults() {
        if (typeof Chart === 'undefined') return;
        const textColor = this.isDark() ? '#E5E7EB' : '#374151';
        const gridColor = this.isDark() ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
        Chart.defaults.color = textColor;
        Chart.defaults.borderColor = gridColor;
    },

    applyThemeToChart(chart) {
        const textColor = this.isDark() ? '#E5E7EB' : '#374151';
        const gridColor = this.isDark() ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
        if (chart.options.scales) {
            Object.values(chart.options.scales).forEach(scale => {
                if (scale.ticks) scale.ticks.color = textColor;
                if (scale.grid) scale.grid.color = gridColor;
                if (scale.title) scale.title.color = textColor;
            });
        }
        if (chart.options.plugins && chart.options.plugins.legend && chart.options.plugins.legend.labels) {
            chart.options.plugins.legend.labels.color = textColor;
        }
    },

    getChartColors(count) {
        const palette = [
            '#2E3192', '#80D1E9', '#92A185', '#DEC18C',
            '#AD8082', '#4472C4', '#002060', '#203366',
            '#059669', '#D97706', '#DC2626', '#7B2D8E',
            '#4A4DC7', '#5BBCD9', '#06B6D4', '#F59E0B'
        ];
        return palette.slice(0, count);
    },

    // ---- OPTIMIZED Particle system for NIT theme ----
    // Performance-focused: fewer particles, mobile detection, reduced motion support

    isMobile() {
        return window.innerWidth <= 768 ||
               /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },

    prefersReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    },

    ensureParticlesContainer() {
        if (!document.getElementById('particles')) {
            var div = document.createElement('div');
            div.id = 'particles';
            div.className = 'particles';
            document.body.insertBefore(div, document.body.firstChild);
        }
    },

    createLogoSVG(fill1, fill2) {
        var ns = 'http://www.w3.org/2000/svg';
        var svg = document.createElementNS(ns, 'svg');
        svg.setAttribute('viewBox', '0 0 80.8 30.65');
        // Simplified SVG - fewer shapes for better performance
        var shapes = [
            {tag:'rect', attrs:{x:'46.4',y:'.04',width:'10.53',height:'30.52',fill:fill1}},
            {tag:'rect', attrs:{x:'0',y:'.02',width:'10.52',height:'30.56',fill:fill1}},
            {tag:'path', attrs:{d:'M30.89,16.55v13.93s0,.02,0,0L13.01,13.47s0,0,0,0V.06s0-.02,0,0l17.88,16.49s0,0,0,0',fill:fill1}},
            {tag:'rect', attrs:{x:'33.38',y:'10.69',width:'10.53',height:'19.87',fill:fill1}},
            {tag:'polygon', attrs:{points:'33.38 8.75 33.38 .02 43.91 .02 33.38 8.75',fill:fill2}}
        ];
        shapes.forEach(function(s) {
            var el = document.createElementNS(ns, s.tag);
            Object.keys(s.attrs).forEach(function(k) { el.setAttribute(k, s.attrs[k]); });
            svg.appendChild(el);
        });
        return svg;
    },

    createParticles(container) {
        if (!container) return;

        // Skip particles if user prefers reduced motion
        if (this.prefersReducedMotion()) {
            return;
        }

        // Nesma brand colors - reduced set for better performance
        var colorSets = [
            { fill1: '#FFFFFF', fill2: '#80D1E9' },
            { fill1: '#80D1E9', fill2: '#0E2841' },
            { fill1: '#2E3192', fill2: '#80D1E9' },
            { fill1: '#0E2841', fill2: '#FFFFFF' }
        ];

        // OPTIMIZED: Much fewer particles, slower animations
        // Desktop: 18 particles, Mobile: 0 (disabled for performance)
        var isMobile = this.isMobile();

        if (isMobile) {
            // No particles on mobile for best performance
            return;
        }

        // Desktop-only: lightweight particle config
        var layers = [
            { sizes: [60, 80, 100], opacities: [0.08, 0.12, 0.18], speeds: [80, 100, 120], count: 6 },
            { sizes: [40, 55, 70], opacities: [0.20, 0.30, 0.40], speeds: [60, 80, 100], count: 6 },
            { sizes: [25, 35, 45], opacities: [0.45, 0.55, 0.65], speeds: [45, 60, 75], count: 6 }
        ];

        // Only 4 animation types for simplicity
        var animations = ['logoMoveRight', 'logoMoveLeft', 'logoMoveDown', 'logoMoveUp'];

        // Create particles for each layer
        layers.forEach(function(layer, layerIndex) {
            for (var i = 0; i < layer.count; i++) {
                var colors = colorSets[i % colorSets.length];
                var anim = animations[i % animations.length];
                var size = layer.sizes[i % layer.sizes.length];
                var duration = layer.speeds[i % layer.speeds.length];
                var opacity = layer.opacities[i % layer.opacities.length];

                var segment = i / layer.count;
                var animOffset = -segment * duration;

                var startX, startY;
                if (anim === 'logoMoveRight') {
                    startX = -5;
                    startY = (segment * 80) + 10;
                } else if (anim === 'logoMoveLeft') {
                    startX = 105;
                    startY = (segment * 80) + 10;
                } else if (anim === 'logoMoveDown') {
                    startX = (segment * 90) + 5;
                    startY = -5;
                } else {
                    startX = (segment * 90) + 5;
                    startY = 105;
                }

                startX += (Math.random() - 0.5) * 10;
                startY += (Math.random() - 0.5) * 10;

                var particle = document.createElement('div');
                particle.className = 'logo-particle';
                particle.style.cssText = 'left:' + startX + '%;top:' + startY + '%;width:' + size + 'px;z-index:' + layerIndex + ';animation:' + anim + ' ' + duration + 's linear ' + animOffset + 's infinite;';
                particle.style.setProperty('--p-opacity', String(opacity));
                particle.appendChild(this.createLogoSVG(colors.fill1, colors.fill2));
                container.appendChild(particle);
            }
        }, this);
    },

    particlesVisible: true,

    toggleParticles: function() {
        this.particlesVisible = !this.particlesVisible;
        if (this.particlesVisible) {
            document.body.classList.remove('particles-hidden');
        } else {
            document.body.classList.add('particles-hidden');
        }
        this.updateParticlesButtonIcon();
        return this.particlesVisible;
    },

    createParticleIconSVG: function(visible) {
        var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('class', 'w-5 h-5 text-white');
        svg.setAttribute('fill', 'none');
        svg.setAttribute('stroke', 'currentColor');
        svg.setAttribute('viewBox', '0 0 24 24');
        var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('stroke-linecap', 'round');
        path.setAttribute('stroke-linejoin', 'round');
        path.setAttribute('stroke-width', '2');
        if (visible) {
            path.setAttribute('d', 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z');
        } else {
            path.setAttribute('d', 'M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636');
        }
        svg.appendChild(path);
        return svg;
    },

    updateParticlesButtonIcon: function() {
        var btn = document.getElementById('particlesToggleBtn');
        if (!btn) return;
        var oldSvg = btn.querySelector('svg');
        if (oldSvg) oldSvg.remove();
        btn.insertBefore(this.createParticleIconSVG(this.particlesVisible), btn.firstChild);
    },

    updateParticles(forceRefresh) {
        this.ensureParticlesContainer();
        var container = document.getElementById('particles');
        if (!container) return;
        // Clear and regenerate if forceRefresh or empty
        if (forceRefresh || container.children.length === 0) {
            container.textContent = '';
            this.createParticles(container);
        }
    }
};

// ============================================
// THEME TOGGLE BUTTON CREATION (safe DOM)
// ============================================
function createThemeToggleButton() {
    const btn = document.createElement('button');
    btn.id = 'themeToggleBtn';
    btn.className = 'p-2 hover:bg-white/10 rounded-lg transition-colors';
    btn.title = 'Toggle Theme';
    btn.onclick = function() { NesmaTheme.toggle(); };
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'w-5 h-5');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('viewBox', '0 0 24 24');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');
    path.setAttribute('stroke-width', '2');
    path.setAttribute('d', 'M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z');
    svg.appendChild(path);
    btn.appendChild(svg);
    return btn;
}

// ============================================
// EXPORT UTILITIES
// ============================================
const NesmaExport = {
    toExcel(data, filename, sheetName) {
        if (typeof XLSX === 'undefined') {
            alert('Excel export library not loaded');
            return;
        }
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, sheetName || 'Data');
        XLSX.writeFile(wb, (filename || 'export') + '_' + new Date().toISOString().slice(0, 10) + '.xlsx');
    },

    toCSV(data, filename) {
        if (!data || data.length === 0) return;
        const headers = Object.keys(data[0]);
        const csvRows = [headers.join(',')];
        data.forEach(row => {
            const values = headers.map(h => {
                const val = row[h] != null ? String(row[h]) : '';
                return '"' + val.replace(/"/g, '""') + '"';
            });
            csvRows.push(values.join(','));
        });
        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = (filename || 'export') + '_' + new Date().toISOString().slice(0, 10) + '.csv';
        link.click();
        URL.revokeObjectURL(link.href);
    },

    toPDF(elementId, filename) {
        if (typeof html2canvas === 'undefined' || typeof jspdf === 'undefined') {
            window.print();
            return;
        }
        const element = document.getElementById(elementId);
        if (!element) return;

        var noPrintEls = element.querySelectorAll('.no-print');
        noPrintEls.forEach(function(b) { b.style.display = 'none'; });

        html2canvas(element, {
            scale: 2,
            useCORS: true,
            backgroundColor: NesmaTheme.isDark() ? '#0E2841' : '#FFFFFF',
            logging: false
        }).then(function(canvas) {
            var pdf = new jspdf.jsPDF('l', 'mm', 'a4');
            var imgWidth = 287;
            var imgHeight = (canvas.height * imgWidth) / canvas.width;
            var heightLeft = imgHeight;
            var position = 10;

            pdf.setFillColor(46, 49, 146);
            pdf.rect(0, 0, 297, 8, 'F');
            pdf.setFontSize(8);
            pdf.setTextColor(255, 255, 255);
            pdf.text('NESMA Infrastructure & Technology', 10, 5.5);
            pdf.text(new Date().toLocaleDateString(), 260, 5.5);

            pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 5, position, imgWidth, imgHeight);
            heightLeft -= (210 - position);

            while (heightLeft > 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.setFillColor(46, 49, 146);
                pdf.rect(0, 0, 297, 8, 'F');
                pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 5, position + 10, imgWidth, imgHeight);
                heightLeft -= 200;
            }

            pdf.save((filename || 'NESMA_Report') + '_' + new Date().toISOString().slice(0, 10) + '.pdf');
            noPrintEls.forEach(function(b) { b.style.display = ''; });
        });
    }
};

// ============================================
// DETAIL MODAL SYSTEM
// ============================================
const NesmaModal = {
    currentData: [],
    currentColumns: [],
    sortColumn: null,
    sortDirection: 'asc',
    currentPage: 1,
    pageSize: 50,
    searchTerm: '',

    _buildModalDOM() {
        var overlay = document.createElement('div');
        overlay.id = 'nesmaDetailModal';
        overlay.className = 'nesma-modal-overlay';
        overlay.addEventListener('click', function(e) { if (e.target === overlay) NesmaModal.close(); });

        var container = document.createElement('div');
        container.className = 'nesma-modal-container';

        // Header
        var header = document.createElement('div');
        header.className = 'nesma-modal-header';

        var titleWrap = document.createElement('div');
        var title = document.createElement('h3');
        title.id = 'nesmaModalTitle';
        title.className = 'text-lg font-bold';
        var subtitle = document.createElement('p');
        subtitle.id = 'nesmaModalSubtitle';
        subtitle.className = 'text-sm opacity-70 mt-1';
        titleWrap.appendChild(title);
        titleWrap.appendChild(subtitle);

        var actionsWrap = document.createElement('div');
        actionsWrap.className = 'flex items-center gap-2';

        var exportBtns = document.createElement('div');
        exportBtns.className = 'nesma-modal-export-btns';

        var btnExcel = document.createElement('button');
        btnExcel.className = 'btn-export btn-excel text-xs';
        btnExcel.title = 'Export Excel';
        btnExcel.textContent = 'Excel';
        btnExcel.onclick = function() { NesmaModal.exportExcel(); };

        var btnCSV = document.createElement('button');
        btnCSV.className = 'btn-export btn-csv text-xs';
        btnCSV.title = 'Export CSV';
        btnCSV.textContent = 'CSV';
        btnCSV.onclick = function() { NesmaModal.exportCSV(); };

        var btnPDF = document.createElement('button');
        btnPDF.className = 'btn-export btn-pdf text-xs';
        btnPDF.title = 'Export PDF';
        btnPDF.textContent = 'PDF';
        btnPDF.onclick = function() { NesmaModal.exportPDF(); };

        exportBtns.appendChild(btnExcel);
        exportBtns.appendChild(btnCSV);
        exportBtns.appendChild(btnPDF);

        var closeBtn = document.createElement('button');
        closeBtn.className = 'close-btn';
        closeBtn.textContent = '\u00D7';
        closeBtn.onclick = function() { NesmaModal.close(); };

        actionsWrap.appendChild(exportBtns);
        actionsWrap.appendChild(closeBtn);

        header.appendChild(titleWrap);
        header.appendChild(actionsWrap);

        // Toolbar
        var toolbar = document.createElement('div');
        toolbar.className = 'nesma-modal-toolbar';
        var searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.id = 'nesmaModalSearch';
        searchInput.placeholder = 'Search...';
        searchInput.className = 'nesma-modal-search';
        searchInput.addEventListener('input', function() { NesmaModal.search(this.value); });
        var countSpan = document.createElement('span');
        countSpan.id = 'nesmaModalCount';
        countSpan.className = 'text-xs text-gray-500';
        toolbar.appendChild(searchInput);
        toolbar.appendChild(countSpan);

        // Body
        var body = document.createElement('div');
        body.id = 'nesmaModalBody';
        body.className = 'nesma-modal-body';

        // Pagination
        var pagination = document.createElement('div');
        pagination.id = 'nesmaModalPagination';
        pagination.className = 'nesma-modal-pagination';

        container.appendChild(header);
        container.appendChild(toolbar);
        container.appendChild(body);
        container.appendChild(pagination);
        overlay.appendChild(container);

        return overlay;
    },

    ensureModal() {
        if (!document.getElementById('nesmaDetailModal')) {
            document.body.appendChild(this._buildModalDOM());
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') NesmaModal.close();
            });
        }
    },

    /**
     * Show detail modal with data table
     * @param {string} title - Modal title
     * @param {Array} data - Array of objects
     * @param {Array} columns - [{key, label, format?, align?}]
     * @param {string} subtitle - Optional subtitle
     */
    show(title, data, columns, subtitle) {
        this.ensureModal();
        this.currentData = data || [];
        this.currentColumns = columns || this.autoColumns(data);
        this.sortColumn = null;
        this.sortDirection = 'asc';
        this.currentPage = 1;
        this.searchTerm = '';

        document.getElementById('nesmaModalTitle').textContent = title;
        document.getElementById('nesmaModalSubtitle').textContent = subtitle || (data.length + ' records');
        var searchEl = document.getElementById('nesmaModalSearch');
        if (searchEl) searchEl.value = '';

        this.render();
        document.getElementById('nesmaDetailModal').classList.add('show');
    },

    autoColumns(data) {
        if (!data || data.length === 0) return [];
        return Object.keys(data[0]).slice(0, 10).map(function(key) {
            return {
                key: key,
                label: key.replace(/_/g, ' ').replace(/\b\w/g, function(c) { return c.toUpperCase(); })
            };
        });
    },

    getFilteredData() {
        if (!this.searchTerm) return this.currentData;
        var term = this.searchTerm.toLowerCase();
        var cols = this.currentColumns;
        return this.currentData.filter(function(row) {
            return cols.some(function(col) {
                var val = row[col.key];
                return val != null && String(val).toLowerCase().indexOf(term) >= 0;
            });
        });
    },

    getSortedData() {
        var data = this.getFilteredData();
        if (this.sortColumn) {
            var col = this.sortColumn;
            var dir = this.sortDirection === 'asc' ? 1 : -1;
            data = data.slice().sort(function(a, b) {
                var va = a[col] != null ? a[col] : '';
                var vb = b[col] != null ? b[col] : '';
                if (typeof va === 'number' && typeof vb === 'number') return (va - vb) * dir;
                return String(va).localeCompare(String(vb)) * dir;
            });
        }
        return data;
    },

    render() {
        var self = this;
        var sorted = this.getSortedData();
        var total = sorted.length;
        var start = (this.currentPage - 1) * this.pageSize;
        var page = sorted.slice(start, start + this.pageSize);

        document.getElementById('nesmaModalCount').textContent =
            total + ' record' + (total !== 1 ? 's' : '') + (this.searchTerm ? ' (filtered)' : '');

        // Build table with safe DOM
        var modalBody = document.getElementById('nesmaModalBody');
        modalBody.textContent = '';

        var scrollDiv = document.createElement('div');
        scrollDiv.className = 'scroll-container';
        scrollDiv.style.maxHeight = '55vh';

        var table = document.createElement('table');
        table.className = 'data-table text-sm';

        var thead = document.createElement('thead');
        var headerRow = document.createElement('tr');
        this.currentColumns.forEach(function(col) {
            var th = document.createElement('th');
            th.style.cursor = 'pointer';
            if (col.align === 'right') th.style.textAlign = 'right';
            var labelText = col.label;
            if (self.sortColumn === col.key) {
                labelText += self.sortDirection === 'asc' ? ' \u25B2' : ' \u25BC';
            }
            th.textContent = labelText;
            th.addEventListener('click', function() { NesmaModal.sort(col.key); });
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        var tbody = document.createElement('tbody');
        if (page.length === 0) {
            var emptyRow = document.createElement('tr');
            var emptyCell = document.createElement('td');
            emptyCell.setAttribute('colspan', String(this.currentColumns.length));
            emptyCell.className = 'text-center py-8 text-gray-400';
            emptyCell.textContent = 'No records found';
            emptyRow.appendChild(emptyCell);
            tbody.appendChild(emptyRow);
        } else {
            page.forEach(function(row) {
                var tr = document.createElement('tr');
                self.currentColumns.forEach(function(col) {
                    var td = document.createElement('td');
                    if (col.align === 'right') td.style.textAlign = 'right';
                    var val = row[col.key];
                    if (col.format) {
                        val = col.format(val, row);
                    } else if (typeof val === 'number') {
                        val = val.toLocaleString();
                    } else {
                        val = val != null ? val : '-';
                    }
                    td.textContent = String(val);
                    tr.appendChild(td);
                });
                tbody.appendChild(tr);
            });
        }
        table.appendChild(tbody);
        scrollDiv.appendChild(table);
        modalBody.appendChild(scrollDiv);

        this.renderPagination(total);
    },

    renderPagination(total) {
        var paginationEl = document.getElementById('nesmaModalPagination');
        paginationEl.textContent = '';
        var pages = Math.ceil(total / this.pageSize);
        if (pages <= 1) return;

        var self = this;
        var wrapper = document.createElement('div');
        wrapper.className = 'flex items-center justify-between';

        var pageInfo = document.createElement('span');
        pageInfo.className = 'text-xs text-gray-500';
        pageInfo.textContent = 'Page ' + this.currentPage + ' of ' + pages;

        var btnGroup = document.createElement('div');
        btnGroup.className = 'flex gap-1';

        function makeBtn(text, page, disabled) {
            var btn = document.createElement('button');
            btn.className = 'pagination-btn' + (page === self.currentPage ? ' active' : '');
            btn.textContent = text;
            if (disabled) btn.disabled = true;
            else btn.addEventListener('click', function() { NesmaModal.goPage(page); });
            return btn;
        }

        btnGroup.appendChild(makeBtn('\u00AB', 1, this.currentPage === 1));
        btnGroup.appendChild(makeBtn('\u2039', this.currentPage - 1, this.currentPage === 1));

        var startP = Math.max(1, this.currentPage - 2);
        var endP = Math.min(pages, this.currentPage + 2);
        for (var p = startP; p <= endP; p++) {
            btnGroup.appendChild(makeBtn(String(p), p, false));
        }

        btnGroup.appendChild(makeBtn('\u203A', this.currentPage + 1, this.currentPage === pages));
        btnGroup.appendChild(makeBtn('\u00BB', pages, this.currentPage === pages));

        wrapper.appendChild(pageInfo);
        wrapper.appendChild(btnGroup);
        paginationEl.appendChild(wrapper);
    },

    sort(key) {
        if (this.sortColumn === key) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortColumn = key;
            this.sortDirection = 'asc';
        }
        this.currentPage = 1;
        this.render();
    },

    search(term) {
        this.searchTerm = term;
        this.currentPage = 1;
        this.render();
    },

    goPage(page) {
        var maxPage = Math.ceil(this.getFilteredData().length / this.pageSize);
        this.currentPage = Math.max(1, Math.min(page, maxPage));
        this.render();
    },

    close() {
        var modal = document.getElementById('nesmaDetailModal');
        if (modal) modal.classList.remove('show');
    },

    exportExcel() {
        NesmaExport.toExcel(
            this.formatExportData(),
            document.getElementById('nesmaModalTitle').textContent || 'export',
            'Data'
        );
    },

    exportCSV() {
        NesmaExport.toCSV(
            this.formatExportData(),
            document.getElementById('nesmaModalTitle').textContent || 'export'
        );
    },

    exportPDF() {
        if (typeof html2canvas !== 'undefined' && typeof jspdf !== 'undefined') {
            var body = document.getElementById('nesmaModalBody');
            html2canvas(body, { scale: 2, backgroundColor: '#ffffff' }).then(function(canvas) {
                var pdf = new jspdf.jsPDF('l', 'mm', 'a4');
                var imgWidth = 277;
                var imgHeight = (canvas.height * imgWidth) / canvas.width;
                pdf.setFillColor(46, 49, 146);
                pdf.rect(0, 0, 297, 8, 'F');
                pdf.setFontSize(8);
                pdf.setTextColor(255, 255, 255);
                pdf.text(document.getElementById('nesmaModalTitle').textContent || 'Report', 10, 5.5);
                pdf.text(new Date().toLocaleDateString(), 260, 5.5);
                pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 10, 12, imgWidth, Math.min(imgHeight, 190));
                pdf.save((document.getElementById('nesmaModalTitle').textContent || 'Report') + '.pdf');
            });
        } else {
            window.print();
        }
    },

    formatExportData() {
        var data = this.getSortedData();
        var cols = this.currentColumns;
        return data.map(function(row) {
            var out = {};
            cols.forEach(function(col) {
                out[col.label] = row[col.key] != null ? row[col.key] : '';
            });
            return out;
        });
    }
};

// ============================================
// CHART DRILL-DOWN
// ============================================
var NesmaChartDrill = {
    /**
     * Add click handler to a Chart.js chart for drill-down
     * @param {Chart} chart - Chart.js instance
     * @param {Function} getRecords - (label, datasetIndex, index) => {title, data, columns, subtitle}
     */
    attach: function(chart, getRecords) {
        if (!chart || !chart.canvas) return;
        chart.canvas.style.cursor = 'pointer';
        chart.canvas.onclick = function(evt) {
            var points = chart.getElementsAtEventForMode(evt, 'nearest', { intersect: true }, true);
            if (points.length > 0) {
                var point = points[0];
                var label = chart.data.labels ? chart.data.labels[point.index] : '';
                var result = getRecords(label, point.datasetIndex, point.index);
                if (result && result.data && result.data.length > 0) {
                    NesmaModal.show(result.title, result.data, result.columns, result.subtitle);
                }
            }
        };
    }
};

// ============================================
// ESCAPE HTML UTILITY (global helper)
// ============================================
function escapeHtml(text) {
    if (text == null) return '';
    var div = document.createElement('div');
    div.textContent = String(text);
    return div.innerHTML;
}

// ============================================
// INITIALIZE ON LOAD
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    NesmaTheme.init();
});
