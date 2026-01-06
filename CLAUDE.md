# NESMA Dashboard - Development Guide

## Project Overview
NESMA Supply Chain Management Portal - A dashboard system for logistics, procurement, and warehouse management.

## Quick Start
```bash
# Start local server
python -m http.server 8000

# Open browser
open http://localhost:8000
```

## Architecture

### Folder Structure
```
├── js/
│   ├── core/           # Config, translations
│   ├── components/     # Reusable classes
│   ├── pages/          # Page-specific code
│   └── utils/          # Helpers
├── css/
│   ├── base/           # Variables, reset
│   └── components/     # Component styles
├── data/               # JSON data files
├── assets/             # Static assets
└── scripts/            # Python scripts
```

### Core Components

#### DataService (`js/components/DataService.js`)
- Data fetching with caching
- Methods: `loadTransportation()`, `loadPayments()`, `loadProcurement()`, `loadVendors()`, `loadWarehouse()`

#### ChartManager (`js/components/ChartManager.js`)
- Chart creation and management
- Methods: `createDoughnut()`, `createBar()`, `createLine()`, `createPie()`

#### FilterManager (`js/components/FilterManager.js`)
- Filter state management
- Methods: `init()`, `applyFilters()`, `reset()`, `search()`

#### TableManager (`js/components/TableManager.js`)
- Pagination and table rendering
- Methods: `setRecords()`, `goToPage()`, `renderTable()`

### Configuration

Edit `js/core/config.js`:
```javascript
NesmaConfig.api.endpoints.myData = 'data/my_data.json';
NesmaConfig.features.enableExport = true;
```

### Adding New Dashboard

1. Create HTML file based on existing template
2. Import required scripts:
```html
<script src="js/core/config.js"></script>
<script src="js/core/translations.js"></script>
<script src="js/utils/helpers.js"></script>
<script src="js/components/DataService.js"></script>
<script src="js/components/ChartManager.js"></script>
<script src="js/components/FilterManager.js"></script>
<script src="js/components/TableManager.js"></script>
<script src="js/components/UIComponents.js"></script>
<script src="js/pages/BaseDashboard.js"></script>
```

3. Extend BaseDashboard:
```javascript
class MyDashboard extends BaseDashboard {
    constructor() {
        super({ dataUrl: 'data/my_data.json' });
    }
    
    getFilterConfig() {
        return {
            project: { field: 'project', type: 'exact' },
            dateFrom: { field: 'date', type: 'date-from' }
        };
    }
    
    updateKPIs() {
        // Custom KPI logic
    }
}
```

## Data Format

### Expected JSON Structure
```json
{
    "metadata": {
        "last_update": "2025-01-06T10:00:00"
    },
    "filters": {
        "projects": ["Project A", "Project B"],
        "suppliers": ["Supplier 1", "Supplier 2"]
    },
    "records": [
        { "id": 1, "project": "Project A", "amount": 1000 }
    ]
}
```

## Styling

### CSS Variables
Use variables from `css/base/variables.css`:
```css
.my-class {
    color: var(--nesma-primary);
    background: var(--gradient-primary);
    border-radius: var(--radius-lg);
}
```

### Badge Classes
- `badge-success` - Green (completed/approved)
- `badge-warning` - Yellow (pending/in-progress)
- `badge-danger` - Red (rejected/failed)
- `badge-info` - Blue (informational)

## Commands

### Deploy
```bash
git add . && git commit -m "Update" && git push origin main
```

### Update Data
Python scripts in `/scripts/` for Smartsheet sync.

## Best Practices

1. **Use helpers**: `NesmaHelpers.formatNumber()`, `NesmaHelpers.formatCurrency()`
2. **Use chartManager**: Don't create charts directly, use `chartManager.createBar()`
3. **Use translations**: Access via `NesmaTranslations.en.common.all`
4. **Extend BaseDashboard**: For new dashboards, don't copy/paste code
