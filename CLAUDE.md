# NESMA Dashboard - Development Guide

## Project Overview
NESMA Supply Chain Management Portal - Dashboard system for procurement management with SLA tracking.

**Current Status:** Procurement dashboard is the main template. Other dashboards (Transportation, Payments, SLA, Warehouse, Fleet, Maintenance) are planned for future development.

## Quick Start
```bash
# Start local server
python -m http.server 8000

# Open browser
open http://localhost:8000
```

## Current Architecture

### Folder Structure
```
nesma-sla-dashboard/
├── index.html                    # Main portal (entry point)
├── procurement_dashboard.html    # Procurement dashboard (TEMPLATE)
│
├── data/                         # JSON data files
│   ├── pr_data.json             # Procurement data (6,738 PRs)
│   └── vendor_data.json         # Vendor evaluation data (45 vendors)
│
├── assets/                       # Static assets
│   ├── nesma-theme.css          # Main theme (used by all pages)
│   ├── logo-white.svg           # NESMA logo (white)
│   └── nit-logistics.png        # NIT Logistics image
│
├── scripts/                      # Python scripts
│   ├── export_procurement_data.py
│   └── export_warehouse_data.py
│
├── attachments/                  # Document attachments
│   └── vendor_evaluations/      # Vendor evaluation PDFs
│
└── .github/                      # GitHub configuration
    └── workflows/               # GitHub Actions
```

### Active Pages
| File | Description | Status |
|------|-------------|--------|
| `index.html` | Main portal | Active |
| `procurement_dashboard.html` | PR Reports & Vendor Evaluation | Active (Template) |

### Planned Dashboards (To Build)
- Transportation Dashboard
- Payments Dashboard  
- SLA Dashboard
- Warehouse Dashboard
- Fleet Dashboard
- Maintenance Dashboard

## Procurement Dashboard Features

The procurement dashboard serves as the **template** for future dashboards. Key features:

### 1. SLA Compliance Section
- Traffic light indicators (Green/Yellow/Red)
- PR Processing SLA (≤2 days target)
- PO Issuance SLA (≤30 days high value, ≤21 days standard)
- Overall compliance tracking

### 2. Multiple Tabs
- **PR Return Report**: PR status, return analysis, aging
- **PR to PO Report**: Conversion tracking, cycle time
- **Vendor Evaluation**: Vendor scores, categories

### 3. Interactive Features
- Filters: Year, Month, Status, Vendor, Project
- Clickable KPIs with detail modals
- Export: PDF & Excel
- Settings modal for customization

### 4. Charts (Chart.js)
- Monthly trends
- Status distribution
- Aging analysis
- Cycle time distribution

## Data Format

### PR Data Structure (`data/pr_data.json`)
```json
{
  "last_updated": "2026-02-02T13:28:41",
  "summary": {
    "total_prs": 6738,
    "total_approved": 5219,
    "total_returned": 767,
    "avg_pr_to_po_days": 47.5
  },
  "monthly": {
    "2025-01": { "approved": 191, "returned": 26, "rejected": 21 }
  },
  "filters": {
    "projects": ["Project A", "Project B"],
    "vendors": ["Vendor 1", "Vendor 2"]
  },
  "records": [
    {
      "pr_num": "PR-001",
      "project": "Project A",
      "vendor": "Vendor 1",
      "status": "APPROVED",
      "pr_value": 50000,
      "pr_to_po_days": 15
    }
  ]
}
```

### Vendor Data Structure (`data/vendor_data.json`)
```json
{
  "summary": {
    "total_vendors": 45,
    "average_score": 60.2
  },
  "vendors": [
    {
      "name": "Vendor Name",
      "category": "Electromechnical",
      "score": 84.7,
      "attachments": []
    }
  ]
}
```

## Styling

### Theme File
All styling is in `assets/nesma-theme.css`. Key CSS variables:
```css
:root {
    --nesma-primary: #2E3192;
    --nesma-secondary: #80D1E9;
    --nesma-dark: #0E2841;
}
```

### Badge Classes
- `.badge-success` - Green (completed/approved)
- `.badge-warning` - Yellow (pending/in-progress)  
- `.badge-danger` - Red (rejected/failed)
- `.badge-info` - Blue (informational)

### SLA Classes
- `.sla-green` - Meeting target (≥95%)
- `.sla-yellow` - Warning (85-94%)
- `.sla-red` - Below target (<85%)

## Adding New Dashboard

1. **Copy** `procurement_dashboard.html` as template
2. **Update** title, header, data URL
3. **Modify** tab structure for new content
4. **Create** data JSON file in `data/`
5. **Update** `index.html` to link new dashboard

### Template Structure
```html
<!-- Header with back button and title -->
<header class="nesma-header">...</header>

<!-- Tab Navigation -->
<div class="card">
    <div class="border-b">
        <button class="tab-btn active" onclick="switchTab('tab1')">Tab 1</button>
        <button class="tab-btn" onclick="switchTab('tab2')">Tab 2</button>
    </div>
    
    <!-- Tab Content -->
    <div id="tab-tab1" class="tab-content active">
        <!-- Filters -->
        <div class="filter-section">...</div>
        
        <!-- KPI Cards -->
        <div class="grid grid-cols-4">...</div>
        
        <!-- Charts -->
        <div class="chart-container">
            <canvas id="myChart"></canvas>
        </div>
    </div>
</div>

<script>
    // Data loading
    async function loadData() {
        const response = await fetch('data/my_data.json');
        const data = await response.json();
        // Process and display
    }
    
    // Initialize
    document.addEventListener('DOMContentLoaded', loadData);
</script>
```

## Commands

### Deploy to GitHub Pages
```bash
git add .
git commit -m "Update dashboard"
git push origin main
```

### Local Development
```bash
python -m http.server 8000
```

## Live URL
https://arahman1700.github.io/nesma-sla-dashboard/

## Version History
- **v3.0.0** - Cleanup: Removed unused files, procurement as main template
- **v2.0.0** - Modular architecture (deprecated)
- **v1.0.0** - Initial release
